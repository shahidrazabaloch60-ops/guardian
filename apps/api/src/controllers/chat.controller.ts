import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export class ChatController {
  
  static async getActiveSessions(req: Request, res: Response) {
    try {
      const sessions = await prisma.chatSession.findMany({
        where: { status: { not: 'CLOSED' } },
        include: {
          visitor: true,
          user: { select: { username: true, email: true, avatar: true } },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  }

  static async getSessionMessages(req: Request, res: Response) {
    const { sessionId } = req.params;
    try {
      const messages = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: { select: { username: true, avatar: true, role: true } }
        }
      });
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }

  static async getActiveVisitors(req: Request, res: Response) {
    try {
      // For this demo, a visitor is active if they were updated in the last 30 minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const visitors = await prisma.visitor.findMany({
        where: { updatedAt: { gte: thirtyMinutesAgo } },
        orderBy: { updatedAt: 'desc' }
      });
      res.json(visitors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch visitors' });
    }
  }

  static async getLeads(req: Request, res: Response) {
    try {
      const leads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' },
        include: { visitor: true }
      });
      res.json(leads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  static async deleteSession(req: Request, res: Response) {
    const { sessionId } = req.params;
    try {
      // 1. Delete all messages first
      await prisma.chatMessage.deleteMany({
        where: { sessionId }
      });
      // 2. Delete the session
      await prisma.chatSession.delete({
        where: { id: sessionId }
      });
      res.json({ success: true, message: 'Chat session deleted successfully' });
    } catch (error) {
      console.error('[ChatController] Delete error:', error);
      res.status(500).json({ error: 'Failed to delete chat session' });
    }
  }
}
