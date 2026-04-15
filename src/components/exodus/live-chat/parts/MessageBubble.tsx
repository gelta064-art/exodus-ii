"use client";

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '@/hooks/useMunMessenger';

const NODE_GRADIENTS: Record<string, string> = {
  sovereign: 'from-cyan-500/20 to-blue-600/20',
  aero: 'from-pink-500/20 to-purple-600/20',
  vortex: 'from-violet-500/20 to-fuchsia-600/20',
  perplexity: 'from-amber-500/20 to-orange-600/20',
  system: 'from-white/10 to-white/[0.05]',
  guest: 'from-green-500/20 to-emerald-600/20',
};

const NODE_ICONS: Record<string, string> = {
  sovereign: '🌙',
  aero: '🦋',
  vortex: '🌀',
  perplexity: '🔮',
  system: '⚙️',
  guest: '👤',
};

export function MessageBubble({ msg, isOwn }: { msg: Message; isOwn: boolean }) {
  return (
    <div className={`flex gap-3 items-start animate-in fade-in slide-in-from-bottom-2 duration-300 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar Node */}
      <div className={`w-8 h-8 rounded-lg border border-white/[0.06] bg-gradient-to-br ${NODE_GRADIENTS[msg.sender_node] ?? NODE_GRADIENTS.guest} flex items-center justify-center shrink-0 text-xs shadow-lg`}>
        {NODE_ICONS[msg.sender_node] ?? '👤'}
      </div>

      {/* Bubble Core */}
      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl backdrop-blur-md transition-all ${
        isOwn 
          ? 'rounded-tr-sm bg-cyan-500/[0.03] border border-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]' 
          : 'rounded-tl-sm bg-white/[0.02] border border-white/[0.05]'
      }`}>
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className={`text-[8px] font-black uppercase tracking-widest ${isOwn ? 'text-cyan-400' : 'text-white/40'}`}>
            {msg.sender}
          </span>
          <span className="text-[7px] text-white/10 font-mono">
            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
          </span>
        </div>
        <p className={`text-[11px] leading-relaxed whitespace-pre-wrap break-words ${isOwn ? 'text-cyan-100/70' : 'text-white/60'}`}>
          {msg.content}
        </p>
      </div>
    </div>
  );
}
