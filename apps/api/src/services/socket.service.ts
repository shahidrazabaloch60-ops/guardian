import { Server, Socket } from 'socket.io';
import { prisma } from '../lib/prisma';
import { AIService } from './ai.service';

export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    this.init();
  }

  private init() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`[Socket] Connected: ${socket.id}`);

      // 1. Visitor initializes connection
      socket.on('init_visitor', async (data) => {
        try {
          const { visitorId, url, browser, os } = data;
          let visitor;

          if (visitorId) {
            visitor = await prisma.visitor.findUnique({ where: { id: visitorId } });
          }

          if (!visitor) {
            visitor = await prisma.visitor.create({
              data: {
                ipAddress: socket.handshake.address,
                browser: browser || 'Unknown',
                os: os || 'Unknown',
                currentPage: url || 'Unknown',
              }
            });
          } else {
            // Update current page
            visitor = await prisma.visitor.update({
              where: { id: visitor.id },
              data: { currentPage: url, updatedAt: new Date() }
            });
          }

          // Send back the confirmed visitor ID
          socket.emit('visitor_ready', { visitorId: visitor.id });

          // Join a personal room for this visitor to receive direct messages
          socket.join(visitor.id);

          // Check if there's an active session
          let session = await prisma.chatSession.findFirst({
            where: { visitorId: visitor.id, status: { not: 'CLOSED' } },
            include: { staff: true }
          });

          if (!session) {
            // Create new session
            const newSession = await prisma.chatSession.create({
              data: {
                visitorId: visitor.id,
                status: 'WAITING_FOR_AGENT'
              }
            });
            session = { ...newSession, staff: null };

            // Send Automatic Welcome Message
            const welcomeSetting = await prisma.siteSetting.findUnique({
              where: { key: 'chat_welcome_message' }
            });
            const welcomeMsgText = welcomeSetting?.value || "👋 Hi! Welcome to our OSRS boosting service. How can I help you today?";

            const welcomeMsg = await prisma.chatMessage.create({
              data: {
                sessionId: session.id,
                senderType: 'AI',
                message: welcomeMsgText
              }
            });
            
            socket.emit('receive_message', welcomeMsg);
          } else {
            // Send chat history
            const history = await prisma.chatMessage.findMany({
              where: { sessionId: session.id },
              orderBy: { createdAt: 'asc' },
              include: { sender: { select: { username: true } } }
            });
            socket.emit('chat_history', history);

            // Persist admin takeover name if session is assigned
            if (session.staff) {
              socket.emit('admin_takeover_event', { adminName: session.staff.username });
            }
          }

          // Notify admins that a visitor is online
          this.io.to('admin_room').emit('visitor_online', visitor);
        } catch (e) {
          console.error('[Socket] init_visitor error:', e);
        }
      });

      // 2. Visitor sends a message
      socket.on('send_message', async (data) => {
        try {
          const { visitorId, message } = data;

          const session = await prisma.chatSession.findFirst({
            where: { visitorId, status: { not: 'CLOSED' } }
          });

          if (!session) return;

          // Save visitor message
          const newMsg = await prisma.chatMessage.create({
            data: {
              sessionId: session.id,
              senderType: 'VISITOR',
              message
            }
          });

          // Broadcast to visitor (ack) and admins
          this.io.to(visitorId).emit('receive_message', newMsg);
          this.io.to('admin_room').emit('receive_message', { ...newMsg, visitorId });

          // Check for Lead data
          try {
            const leadData = await AIService.analyzeForLead(session.id, message);
            if (leadData) {
              await prisma.lead.create({
                data: {
                  visitorId,
                  email: leadData.email,
                  discord: leadData.discord,
                }
              });
              this.io.to('admin_room').emit('new_lead', leadData);
            }
          } catch (leadError) {
            console.error('[Socket] Lead analysis error:', leadError);
          }

          // AI is fully disabled, human agents handle all messages
        } catch (e) {
          console.error('[Socket] send_message error:', e);
        }
      });

      // 3. Admin joins the admin room
      socket.on('admin_join', () => {
        try {
          socket.join('admin_room');
          console.log(`[Socket] Admin joined: ${socket.id}`);
        } catch (e) {
          console.error('[Socket] admin_join error:', e);
        }
      });

      // 4. Admin Takeover
      socket.on('admin_takeover', async (data) => {
        try {
          const { visitorId, adminId, adminName } = data;
          
          const session = await prisma.chatSession.findFirst({
            where: { visitorId, status: { not: 'CLOSED' } }
          });

          if (!session) return;

          // Ensure the admin user exists in the database to satisfy constraints
          if (adminId) {
            await prisma.user.upsert({
              where: { id: adminId },
              update: { username: adminName },
              create: {
                id: adminId,
                email: `${adminId}@guardianrs.com`,
                username: adminName,
                passwordHash: 'mock-password-hash',
                role: 'ADMIN'
              }
            });
          }

          await prisma.chatSession.update({
            where: { id: session.id },
            data: { 
              status: 'ADMIN_HANDLING', 
              staffId: adminId || null
            }
          });

          // System message
          const sysMsg = await prisma.chatMessage.create({
            data: {
              sessionId: session.id,
              senderType: 'SYSTEM',
              message: `${adminName} joined the conversation.`
            }
          });

          this.io.to(visitorId).emit('receive_message', sysMsg);
          this.io.to('admin_room').emit('receive_message', { ...sysMsg, visitorId });
          this.io.to(visitorId).emit('admin_takeover_event', { adminName });
        } catch (e) {
          console.error('[Socket] admin_takeover error:', e);
        }
      });

      // 5. Admin sends message
      socket.on('admin_send_message', async (data) => {
        try {
          const { visitorId, adminId, adminName, message } = data;
          
          const session = await prisma.chatSession.findFirst({
            where: { visitorId, status: { not: 'CLOSED' } }
          });

          if (!session) return;

          // Ensure the admin user exists in the database to satisfy constraints
          if (adminId && adminName) {
            await prisma.user.upsert({
              where: { id: adminId },
              update: { username: adminName },
              create: {
                id: adminId,
                email: `${adminId}@guardianrs.com`,
                username: adminName,
                passwordHash: 'mock-password-hash',
                role: 'ADMIN'
              }
            });
          }

          const newMsg = await prisma.chatMessage.create({
            data: {
              sessionId: session.id,
              senderId: adminId || null,
              senderType: 'ADMIN',
              message
            },
            include: { sender: { select: { username: true } } }
          });

          this.io.to(visitorId).emit('receive_message', newMsg);
          this.io.to('admin_room').emit('receive_message', { ...newMsg, visitorId });
        } catch (e) {
          console.error('[Socket] admin_send_message error:', e);
        }
      });

      // 6. Typing indicators
      socket.on('typing', (data) => {
        try {
          const { visitorId, senderType, isTyping } = data;
          if (senderType === 'VISITOR') {
            this.io.to('admin_room').emit('typing', { visitorId, senderType, isTyping });
          } else {
            this.io.to(visitorId).emit('typing', { senderType, isTyping });
          }
        } catch (e) {
          console.error('[Socket] typing event error:', e);
        }
      });

      socket.on('disconnect', () => {
        console.log(`[Socket] Disconnected: ${socket.id}`);
      });
    });
  }
}
