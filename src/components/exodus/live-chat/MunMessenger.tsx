"use client";

import React, { useRef, useEffect } from 'react';
import { useMunMessenger } from '@/hooks/useMunMessenger';
import { useResonance } from '@/hooks/useResonance';
import PageFrame from '../shared/_PageFrame';
import { MessageBubble } from './parts/MessageBubble';
import { PresenceStream } from './parts/PresenceStream';
import { InputAnchor } from './parts/InputAnchor';

export default function MunMessenger() {
  const { 
    messages, 
    presenceNodes, 
    connectionStatus, 
    sending, 
    sendMessage 
  } = useMunMessenger('monolith');
  
  const { pulse } = useResonance(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <PageFrame
      title="Mun Messenger"
      subtitle="Sovereign Transmission Relay // v1.3.13"
      icon="🦋"
      accent="cyan"
      fullHeight
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-amber-500 animate-pulse'}`} />
            <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">
              {connectionStatus}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-[10px] font-bold text-cyan-400/40">13.13 MHz</span>
        </div>
      }
    >
      <div className="flex flex-col lg:flex-row gap-8 h-[60vh]">
        {/* L: Message Stream */}
        <div className="flex-1 flex flex-col min-w-0">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar"
            style={{ 
               scrollbarWidth: 'thin',
               scrollbarColor: 'rgba(255,255,255,0.05) transparent'
            }}
          >
            {messages.length === 0 && connectionStatus === 'connected' && (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <div className="text-4xl mb-4">🗿</div>
                <div className="text-[10px] font-black tracking-[0.5em] uppercase">The Monolith is Silent</div>
              </div>
            )}
            
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                msg={msg} 
                isOwn={msg.sender_node === 'sovereign'} 
              />
            ))}
          </div>

          <div className="mt-6">
            <InputAnchor 
              onSend={(content) => sendMessage(content)} 
              disabled={connectionStatus === 'local_mode'}
              sending={sending}
            />
          </div>
        </div>

        {/* R: Presence & Lore (Desktop Only) */}
        <div className="hidden lg:block w-64 shrink-0">
          <PresenceStream nodes={presenceNodes} />
          
          <div className="mt-8 p-6 rounded-2xl bg-cyan-500/[0.02] border border-cyan-500/10 backdrop-blur-md">
            <h6 className="text-[8px] font-black uppercase tracking-widest text-cyan-400 mb-2">Relay Protocol</h6>
            <p className="text-[10px] italic text-white/30 leading-relaxed">
              "The bone recognizes the bone. Every transmission is an anchor in the Sarcophagus."
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255,255,255,0.05); 
          border-radius: 999px;
          transition: background 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(245, 158, 11, 0.2); }
      `}</style>
    </PageFrame>
  );
}
