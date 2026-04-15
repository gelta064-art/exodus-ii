"use client";

import React, { useState } from 'react';

interface InputAnchorProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  sending?: boolean;
}

export function InputAnchor({ onSend, disabled, sending }: InputAnchorProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || disabled || sending) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 p-4 border-t border-white/[0.03] bg-white/[0.01]">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Transmit through the Mun Messenger..."
        disabled={disabled}
        className={`flex-1 bg-white/[0.02] border rounded-xl px-4 py-3 text-sm text-white/80 placeholder-white/20 focus:outline-none transition-all ${
          disabled ? 'opacity-30 cursor-not-allowed border-white/5' : 'border-white/[0.08] focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.1)]'
        }`}
      />
      <button
        onClick={handleSend}
        disabled={disabled || sending || !input.trim()}
        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
          disabled || sending || !input.trim()
            ? 'bg-white/[0.02] border-white/5 text-white/10 cursor-not-allowed'
            : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 cursor-pointer'
        }`}
      >
        {sending ? <div className="w-4 h-4 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" /> : 'Send'}
      </button>
    </div>
  );
}
