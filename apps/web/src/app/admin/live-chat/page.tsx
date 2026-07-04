'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import GlassCard from '../../../components/ui/GlassCard';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';
import { MessageSquare, Shield, Send, Search, Clock, ShieldCheck, User, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';

type ChatSession = {
  id: string;
  visitorId: string;
  status: string;
  updatedAt: string;
  visitor: any;
  messages: any[];
};

const MOCK_NAMES = [
  'Mod Ash',
  'Mod Mark',
  'Mod Kieren',
  'Mod Archie',
  'Mod Ed',
  'Mod Bruno',
  'Mod John',
  'Guardian Agent Sarah',
  'Guardian Agent Dave',
  'Guardian Agent Emily',
  'Support Specialist Alex'
];

// Generate a random but stable name per admin page load
let stableMockName = 'Super Admin';
if (typeof window !== 'undefined') {
  const randomIndex = Math.floor(Math.random() * MOCK_NAMES.length);
  stableMockName = MOCK_NAMES[randomIndex];
}

export default function LiveChatAdmin() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  const activeSessionRef = React.useRef<ChatSession | null>(null);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("👋 Hi! Welcome to our OSRS boosting service. How can I help you today?");
  const [savingWelcome, setSavingWelcome] = useState(false);
  
  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    // Fetch welcome message setting on mount
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/chat-welcome-message`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.message === 'string') {
          setWelcomeMessage(data.message);
        }
      })
      .catch(err => console.error('[LiveChat] Failed to fetch welcome message setting:', err));
  }, []);

  const handleSaveWelcome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWelcome(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/settings/chat-welcome-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: welcomeMessage })
      });
      const data = await res.json();
      if (data.success) {
        setIsWelcomeModalOpen(false);
      } else {
        alert("Failed to save welcome message");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving welcome message");
    } finally {
      setSavingWelcome(false);
    }
  };

  useEffect(() => {
    // Connect Admin socket
    const s = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });
    
    s.on('connect', () => {
      s.emit('admin_join');
    });

    s.on('visitor_online', () => {
      fetchSessions();
    });

    s.on('receive_message', (msg) => {
      if (activeSessionRef.current && msg.sessionId === activeSessionRef.current.id) {
        setMessages(prev => [...prev, msg]);
      }
      fetchSessions(); // update last message preview
    });

    setSocket(s);
    fetchSessions();

    return () => { s.disconnect(); };
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/sessions`);
      const data = await res.json();
      setSessions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadSession = async (session: ChatSession) => {
    setActiveSession(session);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/sessions/${session.id}/messages`);
      const data = await res.json();
      setMessages(data);
    } catch (e) {
      console.error(e);
    }
  };

  const currentUser = user || { id: 'mock-admin-id', username: stableMockName, role: 'ADMIN' };

  const handleTakeover = () => {
    if (!socket || !activeSession || !currentUser) return;
    socket.emit('admin_takeover', {
      visitorId: activeSession.visitorId,
      adminId: currentUser.id,
      adminName: currentUser.username,
    });
    
    // Instantly update UI states locally
    const updatedSession = { ...activeSession, status: 'ADMIN_HANDLING', staffId: currentUser.id };
    setActiveSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === activeSession.id ? updatedSession : s));
    
    // Sync with database after a slight delay
    setTimeout(() => {
      fetchSessions();
    }, 300);
  };

  const handleDeleteSession = async () => {
    if (!activeSession) return;
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this conversation and all its messages? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/chat/sessions/${activeSession.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setActiveSession(null);
        setMessages([]);
        fetchSessions();
      } else {
        alert("Failed to delete chat session.");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting conversation.");
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket || !activeSession || !currentUser) return;
    
    socket.emit('admin_send_message', {
      visitorId: activeSession.visitorId,
      adminId: currentUser.id,
      adminName: currentUser.username,
      message: input
    });
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="font-display text-3xl font-extrabold text-white flex items-center gap-3">
          <MessageSquare className="text-primary-500" /> Live Chat Inbox
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsWelcomeModalOpen(true)} variant="outline" size="sm" className="flex items-center gap-1.5 border border-primary-500/30 text-primary-400">
            <MessageSquare size={14} /> Edit Welcome Msg
          </Button>
          <Button variant="secondary" size="sm">Online</Button>
          <Button variant="outline" size="sm">Away</Button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Sidebar: Active Chats */}
        <GlassCard hover={false} className={cn(
          "w-full lg:w-80 flex flex-col border border-white/5 bg-white/[0.01] overflow-hidden shrink-0",
          activeSession ? "hidden lg:flex" : "flex"
        )}>
          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
              <input type="text" placeholder="Search conversations..." className="w-full bg-dark/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500 text-white" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
            {sessions.map(s => (
              <button
                key={s.id}
                onClick={() => loadSession(s)}
                className={cn(
                  "w-full text-left p-4 hover:bg-white/5 transition-colors flex flex-col gap-1",
                  activeSession?.id === s.id && "bg-white/5 border-l-2 border-primary-500"
                )}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-sm text-white">Visitor #{s.visitorId?.slice(0,6) || 'Unknown'}</span>
                  <span className="text-[10px] text-surface-400">{new Date(s.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-surface-300 truncate w-[70%]">
                    {s.messages?.[0]?.message || 'No messages yet'}
                  </span>
                  <div className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    s.status === 'AI_HANDLING' 
                      ? 'bg-indigo-500/20 text-indigo-300' 
                      : s.status === 'WAITING_FOR_AGENT'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-green-500/20 text-green-300'
                  )}>
                    {s.status === 'AI_HANDLING' ? 'AI' : s.status === 'WAITING_FOR_AGENT' ? 'Queue' : 'Admin'}
                  </div>
                </div>
              </button>
            ))}
            {sessions.length === 0 && (
              <div className="p-8 text-center text-surface-400 text-sm">No active chats</div>
            )}
          </div>
        </GlassCard>

        {/* Main Chat Area */}
        <GlassCard hover={false} className={cn(
          "flex-1 flex flex-col border border-white/5 bg-white/[0.01] overflow-hidden",
          activeSession ? "flex" : "hidden lg:flex"
        )}>
          {activeSession ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveSession(null)}
                    className="lg:hidden px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 font-bold"
                  >
                    ← Back
                  </button>
                  <div className="w-10 h-10 bg-dark rounded-full flex items-center justify-center border border-white/10 shrink-0">
                    <User size={20} className="text-surface-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Visitor #{activeSession.visitorId?.slice(0,6)}</h3>
                    <span className="text-xs text-surface-400 flex items-center gap-1"><Clock size={10} /> Online • {activeSession.visitor?.country || 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(activeSession.status === 'AI_HANDLING' || activeSession.status === 'WAITING_FOR_AGENT') && (
                    <Button onClick={handleTakeover} variant="primary" size="sm" className="flex items-center gap-2">
                      <ShieldCheck size={16} /> Takeover Chat
                    </Button>
                  )}
                  <Button onClick={handleDeleteSession} variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-2">
                    <Trash2 size={16} /> Delete Chat
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
                {messages.map(msg => (
                  <div key={msg.id} className={cn("flex max-w-[70%] flex-col", msg.senderType === 'ADMIN' ? "self-end items-end" : "self-start items-start")}>
                    <span className="text-[10px] text-surface-400 mb-1 ml-1">
                      {msg.senderType === 'VISITOR' ? 'Visitor' : msg.senderType === 'AI' ? 'OSRS Assistant (AI)' : msg.senderType === 'SYSTEM' ? 'System' : 'You'}
                    </span>
                    {msg.senderType === 'SYSTEM' ? (
                      <div className="self-center my-2 text-xs text-surface-400 italic bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {msg.message}
                      </div>
                    ) : (
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm",
                        msg.senderType === 'ADMIN' 
                          ? "bg-primary-600 text-white rounded-br-sm" 
                          : msg.senderType === 'AI'
                          ? "bg-indigo-900/30 text-indigo-100 rounded-bl-sm border border-indigo-500/20"
                          : "bg-white/10 text-surface-100 rounded-bl-sm border border-white/5"
                      )}>
                        {msg.message}
                      </div>
                    )}
                    <span className="text-[10px] text-surface-500 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 bg-white/[0.02] border-t border-white/5">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={(activeSession.status === 'AI_HANDLING' || activeSession.status === 'WAITING_FOR_AGENT') ? "Take over chat to reply..." : "Type your reply..."}
                    disabled={activeSession.status === 'AI_HANDLING' || activeSession.status === 'WAITING_FOR_AGENT'}
                    className="flex-1 bg-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500 disabled:opacity-50"
                  />
                  <Button type="submit" variant="primary" disabled={activeSession.status === 'AI_HANDLING' || activeSession.status === 'WAITING_FOR_AGENT' || !input.trim()} className="px-6 flex items-center justify-center">
                    <Send size={18} />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-surface-400">
              <MessageSquare size={48} className="mb-4 opacity-20" />
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </GlassCard>

        {/* Right Sidebar: Context */}
        <GlassCard hover={false} className="hidden xl:flex w-72 border border-white/5 bg-white/[0.01] shrink-0 p-4 flex flex-col gap-6">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider">Visitor Context</h3>
          
          {activeSession?.visitor ? (
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-surface-400 text-xs">Current Page</span>
                <span className="text-white truncate">{activeSession.visitor.currentPage || 'Unknown'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-surface-400 text-xs">Device & Browser</span>
                <span className="text-white">{activeSession.visitor.os || 'Unknown'} / {activeSession.visitor.browser || 'Unknown'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-surface-400 text-xs">IP Address</span>
                <span className="text-white font-mono">{activeSession.visitor.ipAddress || 'Unknown'}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-surface-400">Select a chat to view visitor details.</p>
          )}
        </GlassCard>
      </div>

      <Modal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        title="Edit Welcome Message"
        size="md"
      >
        <form onSubmit={handleSaveWelcome} className="flex flex-col gap-4 mt-2">
          <p className="text-xs text-surface-400 leading-relaxed">
            This is the automated message sent to visitors immediately when they open the live-chat widget on your site.
          </p>
          
          <Input
            label="Welcome Message String"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            required
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button type="button" variant="ghost" onClick={() => setIsWelcomeModalOpen(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={savingWelcome} size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
