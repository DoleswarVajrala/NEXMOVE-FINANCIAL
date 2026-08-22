import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuitIcon, SendIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Disclaimer, PageHeader, inputClass } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { answerFor, suggestedPrompts } from '../utils/nexAi';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export function NexAI() {
  const { profile, holdings, goals, riskScore, riskProfile, health, spend } =
  useNexmove();
  const monthlySpend = spend.reduce((s, e) => s + e.amount, 0);
  const [messages, setMessages] = useState<Message[]>([
  {
    id: 'welcome',
    role: 'ai',
    text: `Hi ${profile.name.split(' ')[0] || 'there'}, I am NEX AI. I can explain your money in plain language — your risk, your goals, your spending or any financial term you are unsure about. What would you like to understand?`
  }]
  );
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, thinking]);

  const send = (text: string) => {
    const question = text.trim();
    if (!question) return;
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', text: question };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);
    window.setTimeout(() => {
      const reply = answerFor(question, {
        profile,
        holdings,
        goals,
        riskScore,
        riskProfile,
        healthScore: health.score,
        monthlySpend
      });
      setMessages((m) => [...m, { id: `a${Date.now()}`, role: 'ai', text: reply }]);
      setThinking(false);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="NEX AI"
        subtitle="Your personal finance coach — explanations in plain language, grounded in your own numbers." />
      

      <Card className="flex h-[62vh] min-h-[420px] flex-col">
        <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500 text-white">
            <BrainCircuitIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">NEX AI</p>
            <p className="text-xs text-muted">Educational insights · not financial advice</p>
          </div>
        </div>

        <div className="nx-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4" role="log" aria-live="polite">
          {messages.map((m) =>
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
              <p
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === 'user' ?
              'bg-brand-500 text-white' :
              'border border-line bg-canvas text-ink'}`
              }>
              
                {m.text}
              </p>
            </motion.div>
          )}
          {thinking &&
          <div className="flex justify-start">
              <p className="flex items-center gap-1.5 rounded-2xl border border-line bg-canvas px-4 py-3">
                {[0, 1, 2].map((i) =>
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-muted"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />

              )}
                <span className="sr-only">NEX AI is thinking</span>
              </p>
            </div>
          }
          <div ref={endRef} />
        </div>

        <div className="border-t border-line px-5 py-3">
          <div className="nx-scroll mb-3 flex gap-2 overflow-x-auto pb-1">
            {suggestedPrompts.map((p) =>
            <button
              key={p}
              type="button"
              onClick={() => send(p)}
              className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-150 ease-out hover:border-brand-400 hover:text-brand-600">
              
                {p}
              </button>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2">
            
            <label htmlFor="nex-input" className="sr-only">
              Ask NEX AI a question
            </label>
            <input
              id="nex-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your money…"
              className={inputClass} />
            
            <Button type="submit" disabled={!input.trim() || thinking}>
              <SendIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>

      <Disclaimer />
    </div>);

}