'use client';

import Link from 'next/link';
import { useQuery, gql } from '@apollo/client';
import { useAuth, useCanCheckout, useCanManagePayments } from '../../lib/auth-context';

const AVAILABLE_SHARED_CARTS = gql`
  query AvailableSharedCarts {
    availableSharedCarts
  }
`;

export default function DashboardHome() {
  const { user, cart } = useAuth();
  const canCheckout = useCanCheckout();
  const canManagePayments = useCanManagePayments();

  const { data: sharedCartsData } = useQuery(AVAILABLE_SHARED_CARTS);
  const sharedCarts = sharedCartsData?.availableSharedCarts ? JSON.parse(sharedCartsData.availableSharedCarts) : [];

  if (!user) return null;

  const cards = [
    {
      icon: '🏪',
      title: 'Restaurants',
      description: user.role === 'ADMIN'
        ? 'Browse all restaurants across India & America'
        : `Browse restaurants in ${user.country === 'INDIA' ? 'India 🇮🇳' : 'America 🇺🇸'}`,
      href: '/dashboard/restaurants',
      color: '#ff6b35',
      available: true,
    },
    {
      icon: '📋',
      title: 'My Orders',
      description: user.role === 'ADMIN' ? 'View all orders' : 'View your order history',
      href: '/dashboard/orders',
      color: '#a855f7',
      available: true,
    },
    {
      icon: '🛒',
      title: 'Checkout',
      description: canCheckout ? 'Review cart and place order' : 'Members cannot checkout orders',
      href: canCheckout ? '/dashboard/checkout' : '#',
      color: '#22c55e',
      available: canCheckout,
    },
    {
      icon: '💳',
      title: 'Payments',
      description: canManagePayments ? 'Manage all payment methods' : 'Only admins can manage payments',
      href: canManagePayments ? '/dashboard/payments' : '#',
      color: '#3b82f6',
      available: canManagePayments,
    },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
          Welcome back, <span style={{ color: 'var(--accent)' }}>{user.name}</span> 👋
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
          <span className={`badge badge-${user.country.toLowerCase()}`}>
            {user.country === 'INDIA' ? '🇮🇳 India' : '🇺🇸 America'}
          </span>
          {user.role === 'ADMIN' && (
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              · Full access across all regions
            </span>
          )}
        </div>
      </div>

      {/* Active cart banner */}
      {canCheckout && cart.length > 0 && (
        <div style={{
          background: 'var(--accent-glow)',
          border: '1px solid rgba(255,107,53,0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              🛒 You have {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>
              Total: {user.country === 'INDIA' 
                ? `₹${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(0)}` 
                : `$${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}`}
            </div>
          </div>
          <Link href="/dashboard/checkout" className="btn btn-primary">
            Proceed to Checkout →
          </Link>
        </div>
      )}

      {/* RBAC Access Matrix */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)' }}>
          Your Access Level
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {[
            { label: 'View Restaurants', allowed: true },
            { label: 'Create Orders', allowed: true },
            { label: 'Checkout & Pay', allowed: canCheckout },
            { label: 'Cancel Orders', allowed: canCheckout },
            { label: 'Manage Payments', allowed: canManagePayments },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: item.allowed ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
              borderRadius: '8px',
              border: `1px solid ${item.allowed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
            }}>
              <span style={{ fontSize: '16px' }}>{item.allowed ? '✅' : '🔒'}</span>
              <span style={{ fontSize: '13px', fontWeight: 500, color: item.allowed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Carts */}
      {sharedCarts.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤝 Active Shared Carts ({user.country === 'INDIA' ? 'India' : 'America'})
            <span className="badge badge-admin" style={{ fontSize: '11px', padding: '2px 8px' }}>{sharedCarts.length} Session{sharedCarts.length !== 1 ? 's' : ''}</span>
          </h2>
          <div className="grid-auto grid-auto-3">
            {sharedCarts.map((cart: any) => (
              <Link key={cart.id} href={`/dashboard/shared-cart/${cart.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '20px', border: '1px solid rgba(255,107,53,0.3)', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{cart.restaurant.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{new Date(cart.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', marginLeft: '4px' }}>
                      {cart.participants.map((p: any) => (
                        <div key={p.userId} style={{
                          width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold',
                          border: '2px solid var(--bg-primary)', marginLeft: '-8px'
                        }}>
                          {p.user.name.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '4px' }}>
                      {cart.participants.length} participant{cart.participants.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button className="btn btn-secondary" style={{ width: '100%', padding: '8px 0', fontSize: '13px' }}>
                    View & Join Cart →
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action cards */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h2>
      <div className="grid-auto grid-auto-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            style={{
              display: 'block',
              textDecoration: 'none',
              opacity: card.available ? 1 : 0.4,
              cursor: card.available ? 'pointer' : 'not-allowed',
              pointerEvents: card.available ? 'auto' : 'none',
            }}
          >
            <div className="card" style={{
              padding: '24px',
              borderColor: card.available ? 'var(--border)' : 'transparent',
              transition: 'all 0.2s',
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{card.icon}</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px', color: card.available ? card.color : 'var(--text-muted)' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {card.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
