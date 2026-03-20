'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useCanCheckout } from '../../../lib/auth-context';

const PAYMENT_METHODS_QUERY = gql`query GetPMs { paymentMethods }`;
const CREATE_ORDER = gql`mutation CreateOrder($restaurantId: String!, $items: String!) { createOrder(restaurantId: $restaurantId, items: $items) }`;
const CHECKOUT = gql`mutation Checkout($orderId: String!, $paymentMethodId: String!) { checkoutOrder(orderId: $orderId, paymentMethodId: $paymentMethodId) }`;
const CREATE_SHARED_CART = gql`mutation CreateSharedCart($restaurantId: String!, $items: String!) { createSharedCart(restaurantId: $restaurantId, items: $items) }`;

export default function CheckoutPage() {
  const { user, cart, clearCart, cartTotal, cartRestaurantId } = useAuth();
  const canCheckout = useCanCheckout();
  const router = useRouter();
  const [selectedPM, setSelectedPM] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { data: pmData } = useQuery(PAYMENT_METHODS_QUERY);
  const [createOrder] = useMutation(CREATE_ORDER);
  const [checkoutOrder] = useMutation(CHECKOUT);
  const [createSharedCart] = useMutation(CREATE_SHARED_CART);

  if (!user) return null;

  if (!canCheckout) {
    return (
      <div className="empty-state fade-in">
        <div className="icon">🔒</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Access Restricted</h2>
        <p>Members cannot checkout orders. Contact your Manager or Admin.</p>
      </div>
    );
  }

  if (cart.length === 0 && !success) {
    return (
      <div className="empty-state fade-in">
        <div className="icon">🛒</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Cart is empty</h2>
        <p>Add items from a restaurant to checkout.</p>
        <Link href="/dashboard/restaurants" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
          Browse Restaurants →
        </Link>
      </div>
    );
  }

  const paymentMethods = pmData?.paymentMethods ? JSON.parse(pmData.paymentMethods) : [];
  const myPMs = paymentMethods.filter((pm: any) => pm.userId === user.id);


  const handleCheckout = async () => {
    if (!selectedPM) { setError('Please select a payment method'); return; }
    if (!cartRestaurantId) return;
    setLoading(true);
    setError('');
    try {
      const items = cart.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity }));
      const orderResult = await createOrder({
        variables: { restaurantId: cartRestaurantId, items: JSON.stringify(items) },
      });
      const order = JSON.parse(orderResult.data.createOrder);
      await checkoutOrder({ variables: { orderId: order.id, paymentMethodId: selectedPM } });
      clearCart();
      setSuccess(true);
    } catch (e: any) {
      setError(e.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handleShareCart = async () => {
    if (!cartRestaurantId) return;
    setLoading(true);
    setError('');
    try {
      const items = cart.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity }));
      const result = await createSharedCart({
        variables: { restaurantId: cartRestaurantId, items: JSON.stringify(items) },
      });
      const sharedCart = JSON.parse(result.data.createSharedCart);
      clearCart();
      router.push(`/dashboard/shared-cart/${sharedCart.id}`);
    } catch (e: any) {
      setError(e.message || 'Failed to share cart');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: 'var(--success)' }}>
          Order Confirmed!
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Your order has been placed successfully.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => router.push('/dashboard/orders')}>
            View Orders
          </button>
          <button className="btn btn-primary" onClick={() => router.push('/dashboard/restaurants')}>
            Order Again →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>🛒 Checkout</h1>
        <button className="btn btn-secondary" onClick={handleShareCart} disabled={loading}>
          🤝 Share Cart Session
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
        {/* Cart items */}
        <div>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cart.map((item) => (
                <div key={item.menuItemId} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {user.country === 'INDIA' ? `₹${item.price}` : `$${item.price.toFixed(2)}`} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {user.country === 'INDIA' ? `₹${(item.price * item.quantity).toFixed(0)}` : `$${(item.price * item.quantity).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700, fontSize: '18px' }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: '24px', color: 'var(--accent)' }}>
                {user.country === 'INDIA' ? `₹${cartTotal.toFixed(0)}` : `$${cartTotal.toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Payment + place order */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Payment Method</h2>
            {myPMs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                No payment methods available.{' '}
                {user.role === 'ADMIN' && <Link href="/dashboard/payments" style={{ color: 'var(--accent)' }}>Add one →</Link>}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myPMs.map((pm: any) => (
                  <label key={pm.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: 'var(--radius)',
                    border: `1px solid ${selectedPM === pm.id ? 'rgba(255,107,53,0.5)' : 'var(--border)'}`,
                    background: selectedPM === pm.id ? 'var(--accent-glow)' : 'var(--bg-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                    <input
                      type="radio"
                      name="pm"
                      value={pm.id}
                      checked={selectedPM === pm.id}
                      onChange={() => setSelectedPM(pm.id)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>
                        {pm.type} •••• {pm.last4}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{pm.name}</div>
                    </div>
                    {pm.isDefault && (
                      <span className="badge badge-admin" style={{ marginLeft: 'auto', fontSize: '10px', padding: '1px 6px' }}>Default</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius)',
              padding: '12px 16px',
              color: '#ef4444',
              fontSize: '14px',
            }}>
              {error}
            </div>
          )}

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={loading || myPMs.length === 0}
          >
            {loading ? 'Placing Order...' : `Place Order • ${user.country === 'INDIA' ? `₹${cartTotal.toFixed(0)}` : `$${cartTotal.toFixed(2)}`}`}
          </button>
        </div>
      </div>
    </div>
  );
}
