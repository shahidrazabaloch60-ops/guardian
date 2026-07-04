'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Paperclip, Smile } from 'lucide-react';
import { useChat } from '../../hooks/useChat';
import { cn } from '../../lib/utils';

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, isAiTyping, isAdminTyping, adminName, isConnected, visitorId, isOpen, setIsOpen } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isAiTyping, isAdminTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col glass-card border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-white/5 border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10">
                  <img 
                    src={adminName 
                      ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${adminName}` 
                      : `https://api.dicebear.com/7.x/bottts/svg?seed=WelcomeBot`
                    } 
                    alt="header-avatar" 
                    className="w-full h-full object-cover" 
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'} border-2 border-[#12122a] rounded-full`}></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">{adminName ? adminName : 'Guardian Assistant'}</span>
                  <span className="text-xs text-surface-400">{isConnected ? '🟢 Online' : '🔴 Connecting...'}</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-surface-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-dark/40 scrollbar-hide">
              {messages.map((msg, idx) => {
                const isVisitor = msg.senderType === 'VISITOR';
                const isSystem = msg.senderType === 'SYSTEM';

                // Cartoonish avatar assignment
                let avatarUrl = '';
                if (isVisitor) {
                  // Fun cartoon emoji for the customer
                  avatarUrl = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${visitorId || 'visitor'}`;
                } else if (msg.senderType === 'ADMIN') {
                  // Cartoonish adventurer avatar for the admin
                  avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${msg.sender?.username || msg.senderName || adminName || 'Admin'}`;
                } else {
                  // Robot style avatar for automated greeting bot
                  avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=WelcomeBot`;
                }

                if (isSystem) {
                  return (
                    <div key={msg.id || idx} className="self-center my-2 text-xs text-surface-400 italic bg-white/5 px-3 py-1 rounded-full border border-white/5">
                      {msg.message}
                    </div>
                  );
                }

                return (
                  <div key={msg.id || idx} className={cn("flex max-w-[85%] gap-2.5", isVisitor ? "self-end flex-row-reverse" : "self-start flex-row")}>
                    {/* Avatar circle */}
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    </div>

                    {/* Speech bubble */}
                    <div className={cn("flex flex-col", isVisitor ? "items-end" : "items-start")}>
                      {!isVisitor && (
                        <span className="text-[10px] text-surface-400 mb-1 ml-1 font-medium">
                          {msg.senderType === 'ADMIN' ? (msg.sender?.username || msg.senderName || adminName || 'Admin') : 'Assistant'}
                        </span>
                      )}
                      
                      <div className={cn(
                        "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                        isVisitor 
                          ? "bg-primary-600 text-white rounded-tr-none shadow-[0_4px_12px_rgba(99,102,241,0.15)]" 
                          : "bg-white/10 text-surface-100 rounded-tl-none border border-white/5"
                      )}>
                        {msg.message}
                      </div>

                      <span className="text-[9px] text-surface-500 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {(isAiTyping || isAdminTyping) && (
                <div className="self-start flex max-w-[85%] gap-2.5 flex-row">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    <img 
                      src={isAdminTyping 
                        ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${adminName || 'Admin'}` 
                        : `https://api.dicebear.com/7.x/bottts/svg?seed=WelcomeBot`
                      } 
                      alt="typing-avatar" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] text-surface-400 mb-1 ml-1 font-medium">
                      {isAdminTyping ? `${adminName || 'Admin'} is typing...` : 'Assistant is typing...'}
                    </span>
                    <div className="px-4 py-3 rounded-2xl bg-white/10 rounded-tl-none border border-white/5 flex gap-1 items-center h-[36px]">
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-surface-400 rounded-full" />
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-surface-400 rounded-full" />
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-surface-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2">
              <button type="button" className="text-surface-400 hover:text-white p-2">
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
              />
              <button type="submit" disabled={!input.trim()} className="text-white bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-full transition-colors flex items-center justify-center">
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform z-50"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
}
