'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth, useCanCheckout } from '../../../lib/auth-context';
import Link from 'next/link';

const ORDERS_QUERY = gql`query GetOrders { orders }`;
const CANCEL_ORDER = gql`mutation Cancel($orderId: String!) { cancelOrder(orderId: $orderId) }`;

export default function OrdersPage() {
  const { user } = useAuth();
  const canCheckout = useCanCheckout();
  const { data, loading, refetch } = useQuery(ORDERS_QUERY);
  const [cancelOrder] = useMutation(CANCEL_ORDER);

  if (!user) return null;

  const orders = data?.orders ? JSON.parse(data.orders) : [];

  const handleCancel = async (orderId: string) => {
    if (!confirm('Cancel this order?')) return;
    try {
      await cancelOrder({ variables: { orderId } });
      refetch();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const statusStyle = (status: string) => {
    if (status === 'CONFIRMED') return 'badge status-confirmed';
    if (status === 'CANCELLED') return 'badge status-cancelled';
    return 'badge status-pending';
  };

  const isCurrency = (amount: number) => amount < 100;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          📋 {user.role === 'ADMIN' ? 'All Orders' : 'My Orders'}
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {loading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>No orders yet. Go to restaurants to place your first order!</p>
          <Link href="/dashboard/restaurants" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
            Browse Restaurants →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map((order: any) => (
            <div key={order.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '16px' }}>
                      {order.restaurant?.name || 'Unknown Restaurant'}
                    </span>
                    <span className={statusStyle(order.status)}>{order.status}</span>
                    {user.role === 'ADMIN' && order.user && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        by {order.user.name}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      🗓️ {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      🍽️ {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </span>
                    {order.paymentMethod && (
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        💳 {order.paymentMethod.type} •••• {order.paymentMethod.last4}
                      </span>
                    )}
                  </div>
                  {/* Items preview */}
                  <div style={{ marginTop: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {order.items?.slice(0, 4).map((item: any) => (
                      <span key={item.id} style={{
                        fontSize: '12px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        color: 'var(--text-secondary)',
                      }}>
                        {item.quantity}× {item.menuItem?.name}
                      </span>
                    ))}
                    {(order.items?.length || 0) > 4 && (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>+{order.items.length - 4} more</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {isCurrency(order.totalAmount)
                        ? `$${order.totalAmount.toFixed(2)}`
                        : `₹${order.totalAmount.toFixed(0)}`}
                    </div>
                  </div>
                  {canCheckout && order.status === 'PENDING' && (
                    <button
                      style={{
                        background: 'transparent',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius)',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'al 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => handleCancel(order.id)}
                    >
                      ❌ Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
