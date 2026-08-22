import React from 'react';
import { toast } from 'sonner';
import { BellIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, Disclaimer, EmptyState, PageHeader } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';

export function Notifications() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } =
  useNexmove();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle="Calm, useful alerts — what changed, why it matters, and what to review."
        action={
        notifications.length > 0 &&
        <Button
          variant="secondary"
          onClick={() => {
            markAllRead();
            toast.success('All notifications marked as read');
          }}
          disabled={unreadCount === 0}>
          
              Mark all as read
            </Button>

        } />
      

      {notifications.length === 0 ?
      <EmptyState
        icon={<BellIcon className="h-5 w-5" />}
        title="Nothing to review right now"
        body="Budget changes, goal milestones, SIP reminders and portfolio notes will appear here as your data updates." /> :


      <ul className="space-y-3">
          {notifications.map((n) =>
        <li key={n.id}>
              <Card className={`p-4 ${n.read ? '' : 'border-brand-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold text-ink">{n.title}</h2>
                      <Badge tone={n.tone}>{n.tone === 'positive' ? 'Milestone' : n.tone === 'attention' ? 'Review' : 'Info'}</Badge>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500" aria-label="Unread" />}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{n.body}</p>
                    <p className="mt-1.5 text-xs text-muted">{n.time}</p>
                  </div>
                  {!n.read &&
              <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)}>
                      Mark read
                    </Button>
              }
                </div>
              </Card>
            </li>
        )}
        </ul>
      }

      <Disclaimer />
    </div>);

}