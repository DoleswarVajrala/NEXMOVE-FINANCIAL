import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import type { Insight } from '../../types/finance';

const dot: Record<Insight['tone'], string> = {
  positive: 'bg-emeraldx-500',
  info: 'bg-brand-500',
  attention: 'bg-attention-500',
  caution: 'bg-attention-500'
};

export function InsightFeed({ insights }: {insights: Insight[];}) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader
        title="Today’s Next Move"
        subtitle="Personalized from your profile, portfolio, goals and spending" />
      
      <ul className="divide-y divide-line">
        {insights.map((insight, i) =>
        <motion.li
          key={insight.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          
            <div className="flex gap-3">
              <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dot[insight.tone]}`}
              aria-hidden="true" />
            
              <div>
                <p className="text-sm font-semibold text-ink">{insight.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {insight.detail}
                </p>
              </div>
            </div>
            <Button
            size="sm"
            variant="secondary"
            className="shrink-0 self-start sm:self-center"
            onClick={() => navigate(insight.actionPath)}>
            
              {insight.actionLabel}
            </Button>
          </motion.li>
        )}
      </ul>
    </Card>);

}