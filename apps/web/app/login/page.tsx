'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';

const DEMO_USERS = [
  { email: 'nickfury@slooze.com', name: 'Nick Fury', role: 'Admin', country: '🌍 Both' },
  { email: 'captainmarvel@slooze.com', name: 'Captain Marvel', role: 'Manager', country: '🇮🇳 India' },
  { email: 'captainamerica@slooze.com', name: 'Captain America', role: 'Manager', country: '🇺🇸 America' },
  { email: 'thanos@slooze.com', name: 'Thanos', role: 'Member', country: '🇮🇳 India' },
  { email: 'thor@slooze.com', name: 'Thor', role: 'Member', country: '🇮🇳 India' },
  { email: 'travis@slooze.com', name: 'Travis', role: 'Member', country: '🇺🇸 America' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password. Try password: password123');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(ellipse at top left, rgba(255,107,53,0.08) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(59,130,246,0.05) 0%, transparent 50%)',
    }}>
      {/* Left — Demo users panel */}
      <div style={{
        display: 'none',
        width: '420px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        padding: '48px 36px',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto',
      }} className="demo-panel">
        <div>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>🍽️</div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Slooze Eats
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Demo users — click to prefill</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              onClick={() => quickLogin(u.email)}
              style={{
                background: email === u.email ? 'var(--accent-glow)' : 'var(--bg-card)',
                border: `1px solid ${email === u.email ? 'rgba(255,107,53,0.4)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
                width: '100%',
              }}
              className="demo-user-btn"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '14px' }}>{u.name}</span>
                <span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{u.email}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{u.country}</span>
              </div>
            </button>
          ))}
        </div>
        <div style={{
          marginTop: 'auto',
          background: 'rgba(255,107,53,0.06)',
          border: '1px solid rgba(255,107,53,0.15)',
          borderRadius: 'var(--radius)',
          padding: '14px',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          💡 All passwords: <code style={{ color: 'var(--accent)', background: 'rgba(255,107,53,0.1)', padding: '2px 6px', borderRadius: '4px' }}>password123</code>
        </div>
      </div>

      {/* Right — Login form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>
              Slooze <span style={{ color: 'var(--accent)' }}>Eats</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Role-based food ordering platform
            </p>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Sign in</h2>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 'var(--radius)',
                padding: '12px 16px',
                color: '#ef4444',
                fontSize: '14px',
                marginBottom: '20px',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email
                </label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@slooze.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Password
                </label>
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in →'}
              </button>
            </form>

            {/* Mobile quick-login */}
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', textAlign: 'center' }}>
                Quick login (demo)
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {DEMO_USERS.slice(0, 3).map((u) => (
                  <button
                    key={u.email}
                    onClick={() => quickLogin(u.email)}
                    className="btn btn-ghost btn-sm"
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) { .demo-panel { display: flex !important; } }
        .demo-user-btn:hover { background: var(--bg-card-hover) !important; border-color: var(--border-hover) !important; }
      `}</style>
    </div>
  );
}
