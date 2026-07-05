'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

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
    playTone(now, 880, 0.15);
    playTone(now + 0.08, 1174.66, 0.3);
  } catch (e) {
    console.error('[Chat Sound] AudioContext failed:', e);
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiTyping] = useState(false);
  const [isAdminTyping] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isOpenRef = useRef(false);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chat_widget_open');
      if (saved === 'true') {
        setIsOpen(true);
      } else if (saved === null) {
        setIsOpen(true);
        localStorage.setItem('chat_widget_open', 'true');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chat_widget_open', isOpen ? 'true' : 'false');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      playNotificationSound();
    }
  }, [isOpen]);

  // Combined refs to hold current messages state for interval check
  const messagesLengthRef = useRef(0);
  useEffect(() => {
    messagesLengthRef.current = messages.length;
  }, [messages]);

  // Main polling logic
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const storedVisitorId = localStorage.getItem('visitor_id');
    let activeInterval: NodeJS.Timeout;

    const initializeChat = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/chat/visitor/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorId: storedVisitorId,
            url: window.location.pathname,
            browser: navigator.userAgent,
            os: navigator.platform,
          })
        });

        const result = await res.json();
        if (result.success && result.data) {
          const { visitorId: vId, sessionId: sId, history, adminName: adm } = result.data;
          setVisitorId(vId);
          setSessionId(sId);
          localStorage.setItem('visitor_id', vId);
          setMessages(history || []);
          setAdminName(adm);
          setIsConnected(true);

          // Start interval polling after successful initialization
          startPolling(vId, sId);
        }
      } catch (err) {
        console.error('[Chat] Initialization failed:', err);
        setIsConnected(false);
      }
    };

    const startPolling = (vId: string, sId: string) => {
      activeInterval = setInterval(async () => {
        try {
          const res = await fetch(`${apiUrl}/api/chat/visitor/poll?visitorId=${vId}&sessionId=${sId}`);
          const result = await res.json();
          if (result.success && result.data) {
            const { messages: polledMessages, adminName: adm } = result.data;
            
            // Check if messages list changed
            if (polledMessages && polledMessages.length !== messagesLengthRef.current) {
              setMessages(polledMessages);
              
              // Play notification if the last message is from staff/AI
              const lastMsg = polledMessages[polledMessages.length - 1];
              if (lastMsg && lastMsg.senderType !== 'VISITOR') {
                if (!isOpenRef.current) {
                  setIsOpen(true);
                } else {
                  playNotificationSound();
                }
              }
            }
            
            setAdminName(adm);
            setIsConnected(true);
          }
        } catch (err) {
          console.error('[Chat] Polling error:', err);
        }
      }, 3500); // Poll every 3.5 seconds
    };

    initializeChat();

    return () => {
      if (activeInterval) clearInterval(activeInterval);
    };
  }, []);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim()) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Optimistic UI updates
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      senderType: 'VISITOR',
      message: messageText,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      const res = await fetch(`${apiUrl}/api/chat/visitor/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          sessionId,
          message: messageText
        })
      });

      const result = await res.json();
      if (result.success && result.data) {
        // Swap out optimistic message with database message containing final id
        setMessages((prev) => 
          prev.map((msg) => msg.id === tempId ? result.data : msg)
        );
      }
    } catch (err) {
      console.error('[Chat] Send message failed:', err);
    }
  }, [visitorId, sessionId]);

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
