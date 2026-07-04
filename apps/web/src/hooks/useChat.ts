'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export type Message = {
  id: string;
  senderType: 'VISITOR' | 'AI' | 'ADMIN' | 'SYSTEM';
  message: string;
  createdAt: string;
  senderName?: string;
  senderAvatar?: string;
  sender?: {
    username: string;
  };
};

// Programmatic synthesizer for a pleasant chat notification sound
function playNotificationSound() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playTone = (time: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + duration);
    };

    const now = ctx.currentTime;
    // Ascent chime sound (Ascending double chime)
    playTone(now, 880, 0.15);      // A5 tone
    playTone(now + 0.08, 1174.66, 0.3); // D6 tone
  } catch (e) {
    console.error('[Chat Sound] AudioContext failed:', e);
  }
}

export function useChat() {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // We use a ref for isOpen so listeners inside useEffect can check its fresh value
  const isOpenRef = useRef(false);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  // Load and initialize widget open state on mount to prevent SSR mismatch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat_widget_open');
      if (saved === 'true') {
        setIsOpen(true);
      } else if (saved === null) {
        // Default to open for new visitors landing on the site
        setIsOpen(true);
        localStorage.setItem('chat_widget_open', 'true');
      }
    }
  }, []);

  // Save visibility state whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_widget_open', isOpen ? 'true' : 'false');
    }
  }, [isOpen]);

  // Automatically play chime sound whenever the chat widget transitions to open
  useEffect(() => {
    if (isOpen) {
      playNotificationSound();
    }
  }, [isOpen]);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log('[Chat] Connecting to:', apiUrl);

    const socketInstance = io(apiUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      console.log('[Chat] Connected! Socket ID:', socketInstance.id);
      setIsConnected(true);

      // Initialize visitor
      const storedVisitorId = localStorage.getItem('visitor_id');
      socketInstance.emit('init_visitor', {
        visitorId: storedVisitorId,
        url: window.location.pathname,
        browser: navigator.userAgent,
        os: navigator.platform,
      });
    });

    socketInstance.on('disconnect', () => {
      console.log('[Chat] Disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('[Chat] Connection error:', err.message);
      setIsConnected(false);
    });

    socketInstance.on('visitor_ready', (data) => {
      console.log('[Chat] Visitor ready:', data.visitorId);
      setVisitorId(data.visitorId);
      localStorage.setItem('visitor_id', data.visitorId);
    });

    socketInstance.on('chat_history', (history: Message[]) => {
      console.log('[Chat] Received history:', history.length, 'messages');
      setMessages(history);
    });

    socketInstance.on('receive_message', (msg: Message) => {
      console.log('[Chat] New message received:', msg.senderType, msg.message?.substring(0, 50));
      setMessages((prev) => [...prev, msg]);
      
      if (msg.senderType !== 'VISITOR') {
        if (msg.senderType === 'ADMIN') {
          // Admin messages always pop open the chat or play a chime if already open
          if (!isOpenRef.current) {
            setIsOpen(true);
          } else {
            playNotificationSound();
          }
        } else if (msg.senderType === 'AI') {
          // Welcome/bot messages open only if already configured to open
          if (!isOpenRef.current) {
            setIsOpen(true);
          } else {
            playNotificationSound();
          }
        }
      }
    });

    socketInstance.on('typing', (data) => {
      if (data.senderType === 'AI') setIsAiTyping(data.isTyping);
      if (data.senderType === 'ADMIN') setIsAdminTyping(data.isTyping);
    });

    socketInstance.on('admin_takeover_event', (data) => {
      console.log('[Chat] Admin takeover event received:', data.adminName);
      setAdminName(data.adminName);
      
      if (!isOpenRef.current) {
        setIsOpen(true);
      } else {
        playNotificationSound();
      }
    });

    return () => {
      console.log('[Chat] Cleaning up socket');
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current && visitorId && message.trim()) {
      socketRef.current.emit('send_message', { visitorId, message });
    }
  }, [visitorId]);

  return {
    messages,
    sendMessage,
    isAiTyping,
    isAdminTyping,
    adminName,
    isConnected,
    visitorId,
    isOpen,
    setIsOpen,
  };
}
