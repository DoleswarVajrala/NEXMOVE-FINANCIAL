import React, { useState } from 'react';
import { toast } from 'sonner';
import { BookOpenIcon, CheckCircle2Icon, ChevronRightIcon } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, Disclaimer, PageHeader } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { learnTopics } from '../data/learn';

export function Learn() {
  const { completedTopics, toggleTopic } = useNexmove();
  const [activeId, setActiveId] = useState(learnTopics[0].id);
  const [answer, setAnswer] = useState<number | null>(null);

  const topic = learnTopics.find((t) => t.id === activeId) ?? learnTopics[0];
  const progress = Math.round(completedTopics.length / learnTopics.length * 100);
  const isDone = completedTopics.includes(topic.id);

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Learn"
        subtitle="Short, jargon-free lessons that make every other page make sense." />
      

      <Card className="mb-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Financial knowledge</p>
            <p className="text-xs text-muted">
              {completedTopics.length} of {learnTopics.length} topics completed
            </p>
          </div>
          <span className="nx-num text-2xl font-bold text-brand-600">{progress}%</span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand-500 transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardHeader title="Topics" subtitle="Start anywhere" />
          <ul className="nx-scroll max-h-[520px] divide-y divide-line overflow-y-auto">
            {learnTopics.map((t) => {
              const done = completedTopics.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveId(t.id);
                      setAnswer(null);
                    }}
                    className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors duration-150 ease-out ${
                    t.id === activeId ? 'bg-brand-50 dark:bg-navy-800' : 'hover:bg-canvas'}`
                    }
                    aria-current={t.id === activeId}>
                    
                    <span>
                      <span className="block text-sm font-medium text-ink">{t.title}</span>
                      <span className="text-xs text-muted">{t.minutes} min read</span>
                    </span>
                    {done ?
                    <CheckCircle2Icon className="h-4 w-4 shrink-0 text-emeraldx-500" aria-label="Completed" /> :

                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                    }
                  </button>
                </li>);

            })}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title={topic.title}
            subtitle={topic.summary}
            action={<Badge tone={isDone ? 'positive' : 'info'}>{isDone ? 'Completed' : `${topic.minutes} min`}</Badge>} />
          
          <div className="space-y-4 p-5">
            {topic.body.map((p) =>
            <p key={p} className="text-sm leading-relaxed text-muted">
                {p}
              </p>
            )}

            <div className="rounded-xl border border-line bg-canvas p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                Real-world example
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink">{topic.example}</p>
            </div>

            <div className="rounded-xl border border-line p-4">
              <div className="flex items-center gap-2">
                <BookOpenIcon className="h-4 w-4 text-brand-500" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-ink">Quick check</h3>
              </div>
              <p className="mt-2 text-sm text-ink">{topic.quiz.question}</p>
              <div className="mt-3 grid gap-2">
                {topic.quiz.options.map((o, i) => {
                  const chosen = answer === i;
                  const correct = i === topic.quiz.answerIndex;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setAnswer(i)}
                      className={`rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors duration-150 ease-out ${
                      answer === null ?
                      'border-line hover:border-brand-400' :
                      correct ?
                      'border-emeraldx-500 bg-emeraldx-100/50 dark:bg-navy-800' :
                      chosen ?
                      'border-danger-500 bg-danger-100/50 dark:bg-navy-800' :
                      'border-line opacity-70'}`
                      }>
                      
                      {o}
                    </button>);

                })}
              </div>
              {answer !== null &&
              <p className="mt-3 rounded-xl bg-canvas px-3 py-2.5 text-sm leading-relaxed text-muted">
                  {answer === topic.quiz.answerIndex ? 'Correct. ' : 'Not quite. '}
                  {topic.quiz.explanation}
                </p>
              }
            </div>

            <Button
              onClick={() => {
                toggleTopic(topic.id);
                toast.success(isDone ? `${topic.title} marked as unread` : `${topic.title} completed`);
              }}
              variant={isDone ? 'secondary' : 'primary'}>
              
              {isDone ? 'Mark as not completed' : 'Mark topic complete'}
            </Button>
          </div>
        </Card>
      </div>

      <Disclaimer />
    </div>);

}