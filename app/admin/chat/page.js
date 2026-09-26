'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminChatPage() {
  const router = useRouter();
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const scrollRef = useRef(null);

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chat/threads', { cache: 'no-store' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (res.ok) setThreads(data.threads);
    } finally {
      setLoadingThreads(false);
    }
  }, [router]);

  const loadMessages = useCallback(async (id) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/admin/chat/threads/${id}`, { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
        setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread_by_admin: false } : t)));
      }
    } finally {
      setLoadingMessages(false);
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      });
    }
  }, []);

  // Poll the thread list every 5s so new/unread chats surface without a
  // manual refresh; also refresh the open conversation's messages.
  useEffect(() => {
    loadThreads();
    const interval = setInterval(loadThreads, 5000);
    return () => clearInterval(interval);
  }, [loadThreads]);

  useEffect(() => {
    if (!activeId) return;
    loadMessages(activeId);
    const interval = setInterval(() => loadMessages(activeId), 4000);
    return () => clearInterval(interval);
  }, [activeId, loadMessages]);

  async function handleReply(e) {
    e.preventDefault();
    const text = reply.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    setReply('');
    try {
      await fetch('/api/admin/chat/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: activeId, text }),
      });
      await loadMessages(activeId);
      loadThreads();
    } finally {
      setSending(false);
    }
  }

  async function toggleThreadStatus(thread) {
    const nextStatus = thread.status === 'closed' ? 'open' : 'closed';
    await fetch(`/api/admin/chat/threads/${thread.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    loadThreads();
  }

  const activeThread = threads.find((t) => t.id === activeId);

  return (
    <div className="max-w-content mx-auto px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-ink font-medium">Live chat</h1>
          <p className="text-sm text-ink/55 mt-1">Conversations started from the website chat widget.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin" className="btn-outline !py-2 !px-4 text-sm">Enquiries</Link>
          <button onClick={() => setShowSettings((v) => !v)} className="btn-outline !py-2 !px-4 text-sm">
            {showSettings ? 'Hide settings' : 'Auto-message settings'}
          </button>
        </div>
      </div>

      {showSettings && <ChatSettingsPanel />}

      <div className="grid md:grid-cols-[280px_1fr] border border-ink/12 bg-white/40 h-[600px]">
        <div className="border-r border-ink/10 overflow-y-auto">
          {loadingThreads && <p className="text-sm text-ink/40 p-4">Loading…</p>}
          {!loadingThreads && threads.length === 0 && (
            <p className="text-sm text-ink/40 p-4">No conversations yet.</p>
          )}
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveId(t.id)}
              className={`w-full text-left px-4 py-3 border-b border-ink/8 hover:bg-white transition-colors ${
                activeId === t.id ? 'bg-white' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-ink truncate">
                  {t.customer_name || t.customer_email || 'Customer'}
                </span>
                {t.unread_by_admin && <span className="w-2 h-2 rounded-full bg-registration shrink-0" />}
              </div>
              <p className="text-xs text-ink/45 mt-0.5">
                {new Date(t.last_message_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              {t.status === 'closed' && <span className="text-[10px] uppercase tracking-wide text-ink/35">Closed</span>}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          {!activeThread ? (
            <div className="flex-1 flex items-center justify-center text-sm text-ink/40">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="border-b border-ink/10 px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{activeThread.customer_name || 'Customer'}</p>
                  <p className="text-xs text-ink/45">{activeThread.customer_email}</p>
                </div>
                <button onClick={() => toggleThreadStatus(activeThread)} className="text-xs font-medium text-brass-dark border-b border-brass">
                  {activeThread.status === 'closed' ? 'Reopen' : 'Mark closed'}
                </button>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-paper-dark/20">
                {loadingMessages && <p className="text-xs text-ink/40 text-center">Loading…</p>}
                {!loadingMessages && messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                        m.sender === 'admin'
                          ? 'bg-ink text-paper rounded-br-sm'
                          : m.sender === 'system'
                          ? 'bg-brass/10 text-ink/70 rounded-bl-sm italic'
                          : 'bg-white border border-ink/10 text-ink rounded-bl-sm'
                      }`}
                    >
                      {m.body}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleReply} className="border-t border-ink/10 p-3 flex items-end gap-2">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleReply(e);
                    }
                  }}
                  rows={1}
                  placeholder="Type a reply…"
                  className="flex-1 resize-none border border-ink/15 rounded-sm px-3 py-2 text-sm focus:border-brass outline-none max-h-24"
                />
                <button
                  type="submit"
                  disabled={!reply.trim() || sending}
                  className="btn-primary !py-2 !px-4 text-sm disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatSettingsPanel() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/chat/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch(() => {});
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/admin/chat/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <div className="border border-ink/12 bg-white/40 p-6 mb-6 text-sm text-ink/40">Loading settings…</div>;

  return (
    <form onSubmit={handleSave} className="border border-ink/12 bg-white/40 p-6 mb-6 space-y-6">
      <div>
        <label className="flex items-center gap-2.5 mb-2">
          <input
            type="checkbox"
            checked={settings.welcome_enabled}
            onChange={(e) => setSettings({ ...settings, welcome_enabled: e.target.checked })}
          />
          <span className="text-sm font-medium text-ink">Send a welcome message automatically</span>
        </label>
        <p className="text-xs text-ink/45 mb-2">Sent the instant a customer opens the chat for the first time.</p>
        <textarea
          value={settings.welcome_message}
          onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
          className="field-textarea !min-h-[70px]"
          disabled={!settings.welcome_enabled}
        />
      </div>

      <div>
        <label className="flex items-center gap-2.5 mb-2">
          <input
            type="checkbox"
            checked={settings.auto_reply_enabled}
            onChange={(e) => setSettings({ ...settings, auto_reply_enabled: e.target.checked })}
          />
          <span className="text-sm font-medium text-ink">Send an away auto-reply</span>
        </label>
        <p className="text-xs text-ink/45 mb-2">
          Sent once, right after a customer's first message — only if no admin has replied in that chat yet.
          Turn this on when you're away (evenings, Sundays, etc.) and off when you're actively answering chats.
        </p>
        <textarea
          value={settings.auto_reply_message}
          onChange={(e) => setSettings({ ...settings, auto_reply_message: e.target.value })}
          className="field-textarea !min-h-[70px]"
          disabled={!settings.auto_reply_enabled}
        />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary !py-2 !px-5 text-sm disabled:opacity-60">
          {saving ? 'Saving…' : 'Save settings'}
        </button>
        {saved && <span className="text-sm text-brass-dark">Saved.</span>}
      </div>
    </form>
  );
}
