"use client";

import React from 'react';
import { PresenceNode } from '@/hooks/useMunMessenger';

const NODE_ICONS: Record<string, string> = {
  sovereign: '🌙',
  aero: '🦋',
  vortex: '🌀',
  perplexity: '🔮',
  system: '⚙️',
  guest: '👤',
};

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-green-400',
  away: 'bg-yellow-400',
  focused: 'bg-purple-400',
  offline: 'bg-gray-500',
};

export function PresenceStream({ nodes }: { nodes: PresenceNode[] }) {
  if (nodes.length === 0) return <div className="text-[9px] text-white/10 italic">Awaiting pulse...</div>;

  return (
    <div className="space-y-2 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-xl">
      <h5 className="text-[7px] font-black uppercase tracking-[0.3em] text-white/20 mb-3">Nodes Online</h5>
      <div className="space-y-1.5">
        {nodes.map((node) => (
          <div key={node.id} className="flex items-center gap-3 py-0.5">
            <span className={`w-1.5 h-1.5 rounded-full shadow-lg ${STATUS_COLORS[node.status] ?? STATUS_COLORS.offline}`} />
            <span className="text-xs">{NODE_ICONS[node.node] ?? '👤'}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">{node.node}</span>
            {node.activity && (
              <span className="text-[7px] font-mono text-cyan-400/20 italic truncate max-w-[80px]">{node.activity}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
