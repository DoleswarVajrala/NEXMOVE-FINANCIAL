import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeftIcon, LockIcon, MailIcon } from 'lucide-react';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Disclaimer, Field, inputClass } from '../components/ui/Bits';
import { useNexmove } from '../contexts/NexmoveContext';
import { BRAND_IMAGE } from '../data/demo';

export function SignIn() {
  const { signIn, startDemo, onboarded } = useNexmove();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setLoading(true);
    window.setTimeout(() => {
      signIn(email);
      setLoading(false);
      toast.success('Signed in to NEXMOVE');
      navigate(onboarded ? '/dashboard' : '/onboarding');
    }, 650);
  };

  return (
    <div className="grid min-h-screen w-full bg-canvas lg:grid-cols-[1fr_1fr]">
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" /> Back
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted">
            Sign in to continue building your next financial move.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <Field label="Email" htmlFor="email">
              <div className="relative">
                <MailIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true" />
                
                <input
                  id="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputClass} pl-9`} />
                
              </div>
            </Field>
            <Field label="Password" htmlFor="password" hint="Any 6+ characters work in this prototype.">
              <div className="relative">
                <LockIcon
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  aria-hidden="true" />
                
                <input
                  id="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pl-9`} />
                
              </div>
            </Field>

            {error &&
            <p role="alert" className="rounded-xl bg-danger-100 px-3 py-2 text-sm font-medium text-danger-600">
                {error}
              </p>
            }

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-line" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              or
            </span>
            <span className="h-px flex-1 bg-line" />
          </div>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              startDemo();
              toast.success('Demo account loaded with realistic data');
              navigate('/dashboard');
            }}>
            
            Try Demo Account
          </Button>
          <p className="mt-4 text-center text-sm text-muted">
            New to NEXMOVE?{' '}
            <Link to="/onboarding" className="font-semibold text-brand-600">
              Build your financial plan
            </Link>
          </p>
          <Disclaimer />
        </div>
      </div>

      <div className="relative hidden items-center justify-center bg-navy-900 p-10 lg:flex">
        <Card className="overflow-hidden border-navy-600 bg-navy-900">
          <img
            src={BRAND_IMAGE}
            alt="NEXMOVE — Your Next Financial Move"
            className="max-h-[520px] w-full object-contain" />
          
        </Card>
      </div>
    </div>);

}