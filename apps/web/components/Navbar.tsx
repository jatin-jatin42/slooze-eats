'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, useCanCheckout, useCanManagePayments } from '../lib/auth-context';

export default function Navbar() {
  const { user, logout, cart } = useAuth();
  const canCheckout = useCanCheckout();
  const canManagePayments = useCanManagePayments();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Home', always: true },
    { href: '/dashboard/restaurants', label: 'Restaurants', always: true },
    { href: '/dashboard/orders', label: 'My Orders', always: true },
    { href: '/dashboard/payments', label: 'Payments', always: canManagePayments },
  ].filter((l) => l.always);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 15, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        height: '64px',
        gap: '32px',
      }}>
        {/* Brand */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontSize: '24px' }}>🍽️</span>
          <span style={{ fontSize: '18px', fontFamily: 'Outfit, sans-serif', fontWeight: 800, color: 'var(--text-primary)' }}>
            Slooze<span style={{ color: 'var(--accent)' }}>Eats</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: isActive(link.href) ? 600 : 400,
                color: isActive(link.href) ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive(link.href) ? 'rgba(255,255,255,0.06)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cart */}
          {canCheckout && cart.length > 0 && (
            <Link href="/dashboard/checkout" style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--accent-glow)',
              border: '1px solid rgba(255,107,53,0.3)',
              borderRadius: '20px',
              padding: '6px 14px',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
            }}>
              🛒 Cart
              <span style={{
                background: 'var(--accent)',
                color: 'white',
                borderRadius: '999px',
                padding: '0 6px',
                fontSize: '11px',
                fontWeight: 700,
                minWidth: '18px',
                textAlign: 'center',
              }}>{cart.length}</span>
            </Link>
          )}

          {/* User info */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.name}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span className={`badge badge-${user.role.toLowerCase()}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                    {user.role}
                  </span>
                  <span className={`badge badge-${user.country.toLowerCase()}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                    {user.country === 'INDIA' ? '🇮🇳' : '🇺🇸'} {user.country}
                  </span>
                </div>
              </div>
              
              <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
              
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                style={{ padding: '4px 8px', fontSize: '13px' }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
