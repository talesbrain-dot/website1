'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { getSupabasePublic } from '@/lib/supabasePublicClient';
import { ChatIcon, SendIcon, CloseIcon } from '@/components/icons';

export default function ChatWidget() {
  const { user, loading, configError } = useAuth();
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);
  const channelRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  }, []);

  // Load (or create) the thread + history once the panel is opened, then
  // subscribe to realtime inserts so admin replies show up instantly.
  useEffect(() => {
    if (!open || !user || configError) return;

    let cancelled = false;

    (async () => {
      setChatLoading(true);
      setError('');
      const supabase = getSupabasePublic();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        setChatLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/chat/thread', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || 'Could not load chat.');
          setChatLoading(false);
          return;
        }
        setThread(data.thread);
        setMessages(data.messages);
        setChatLoading(false);
        scrollToBottom();

        channelRef.current = supabase
          .channel(`chat-thread-${data.thread.id}`)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `thread_id=eq.${data.thread.id}` },
            (payload) => {
              setMessages((prev) => (prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]));
              scrollToBottom();
            }
          )
          .subscribe();
      } catch {
        if (!cancelled) {
          setError('Could not reach the server.');
          setChatLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        getSupabasePublic()?.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user, configError]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);
    setError('');

    // Optimistic bubble so sending feels instant; the realtime event for
    // our own message is de-duped by id in the handler above once it
    // arrives (this optimistic one uses a temporary negative id).
    const optimistic = { id: -Date.now(), sender: 'customer', body: text, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, optimistic]);
    setInput('');
    scrollToBottom();

    const supabase = getSupabasePublic();
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Could not send your message.');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setSending(false);
    }
  }

  // Don't render at all if login isn't configured on this deployment yet.
  if (configError) return null;

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 left-5 z-30 w-14 h-14 rounded-full bg-ink text-paper flex items-center justify-center shadow-lg shadow-ink/25 hover:scale-105 active:scale-95 transition-transform duration-150"
      >
        {open ? <CloseIcon className="w-6 h-6" /> : <ChatIcon className="w-6 h-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-5 z-30 w-[calc(100vw-2.5rem)] max-w-sm h-[480px] max-h-[70vh] bg-white border border-ink/12 rounded-md shadow-2xl shadow-ink/20 flex flex-col overflow-hidden animate-fade-up">
          <div className="bg-ink text-paper px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <p className="font-medium text-sm">Chat with us</p>
              <p className="text-xs text-paper/55">Kamboj Press</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-paper/60 hover:text-paper">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center text-sm text-ink/40">Loading…</div>
          ) : !user ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <p className="text-sm text-ink/65 mb-4">Log in to chat with our team directly.</p>
              <Link href="/account/login?next=/" className="btn-primary !py-2 !px-4 text-sm" onClick={() => setOpen(false)}>
                Log in / Sign up
              </Link>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-paper-dark/30">
                {chatLoading && <p className="text-xs text-ink/40 text-center">Loading chat…</p>}
                {!chatLoading && messages.length === 0 && (
                  <p className="text-xs text-ink/40 text-center">Say hello to start the conversation.</p>
                )}
                {messages.map((m) => (
                  <ChatBubble key={m.id} message={m} />
                ))}
              </div>

              {error && <p className="text-xs text-registration px-4 pt-2">{error}</p>}

              <form onSubmit={handleSend} className="border-t border-ink/10 p-3 flex items-end gap-2 shrink-0">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  rows={1}
                  placeholder="Type a message…"
                  className="flex-1 resize-none border border-ink/15 rounded-sm px-3 py-2 text-sm focus:border-brass outline-none max-h-24"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="w-9 h-9 shrink-0 rounded-full bg-brass text-ink-dark flex items-center justify-center disabled:opacity-40 transition-opacity"
                  aria-label="Send"
                >
                  <SendIcon className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

function ChatBubble({ message }) {
  const isCustomer = message.sender === 'customer';
  const isSystem = message.sender === 'system';
  return (
    <div className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
          isCustomer
            ? 'bg-ink text-paper rounded-br-sm'
            : isSystem
            ? 'bg-brass/10 text-ink/70 rounded-bl-sm italic'
            : 'bg-white border border-ink/10 text-ink rounded-bl-sm'
        }`}
      >
        {message.body}
      </div>
    </div>
  );
}
