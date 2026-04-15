"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface Message {
  id: string;
  sender: string;
  sender_node: string;
  room: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PresenceNode {
  id: string;
  node: string;
  status: 'online' | 'away' | 'focused' | 'offline';
  activity: string;
  last_seen: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'local_mode';

export function useMunMessenger(room: string = 'monolith') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [presenceNodes, setPresenceNodes] = useState<PresenceNode[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [sending, setSending] = useState(false);
  
  const messageIdsRef = useRef<Set<string>>(new Set());

  const fetchPresence = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('presence').select('*');
      if (!error && data) {
        setPresenceNodes(data as PresenceNode[]);
      }
    } catch { /* silent */ }
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      const supabase = createClient();
      const [messagesRes, presenceRes] = await Promise.all([
        supabase.from('messages').select('*').eq('room', room).order('created_at', { ascending: true }).limit(50),
        supabase.from('presence').select('*'),
      ]);

      if (messagesRes.error) {
        setConnectionStatus('local_mode');
        return;
      }

      const msgs = (messagesRes.data ?? []) as Message[];
      setMessages(msgs);
      messageIdsRef.current = new Set(msgs.map((m) => m.id));

      if (presenceRes.data) {
        setPresenceNodes(presenceRes.data as PresenceNode[]);
      }

      setConnectionStatus('connected');
    } catch {
      setConnectionStatus('local_mode');
    }
  }, [room]);

  useEffect(() => {
    loadInitialData();
    const supabase = createClient();
    const channel = supabase.channel(`messenger-${room}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room=eq.${room}` }, (payload) => {
        const incoming = payload.new as Message;
        if (messageIdsRef.current.has(incoming.id)) return;
        messageIdsRef.current.add(incoming.id);
        setMessages((prev) => [...prev, incoming]);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'presence' }, () => {
        fetchPresence();
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setConnectionStatus('connected');
      });

    return () => { supabase.removeChannel(channel); };
  }, [room, loadInitialData, fetchPresence]);

  const sendMessage = async (content: string, sender: string = 'Sovereign', senderNode: string = 'sovereign') => {
    if (!content.trim() || connectionStatus === 'local_mode' || sending) return;
    setSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('messages').insert({
        sender,
        sender_node: senderNode,
        room,
        content: content.trim(),
      });
      if (error) throw error;
    } catch (err) {
      console.error('[Mun Messenger] Push failed:', err);
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    presenceNodes,
    connectionStatus,
    sending,
    sendMessage,
    refreshPresence: fetchPresence
  };
}
