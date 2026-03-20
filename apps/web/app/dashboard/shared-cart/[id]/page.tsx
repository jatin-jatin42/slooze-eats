'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth, useCanCheckout } from '../../../../lib/auth-context';

const JOIN_SHARED_CART = gql`
  mutation JoinSharedCart($cartId: String!) {
    joinSharedCart(cartId: $cartId)
  }
`;

const CHECKOUT_SHARED = gql`
  mutation CheckoutSharedCart($cartId: String!, $paymentMethodId: String!) {
    checkoutSharedCart(cartId: $cartId, paymentMethodId: $paymentMethodId)
  }
`;

const PAYMENT_METHODS_QUERY = gql`query GetPMs { paymentMethods }`;

export default function SharedCartPage() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const canCheckout = useCanCheckout();
  const router = useRouter();

  const [cartData, setCartData] = useState<any>(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [errorCart, setErrorCart] = useState('');

  const [selectedPM, setSelectedPM] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const { data: pmData } = useQuery(PAYMENT_METHODS_QUERY);
  const [joinSharedCart] = useMutation(JOIN_SHARED_CART);
  const [checkoutSharedCart] = useMutation(CHECKOUT_SHARED);

  useEffect(() => {
    if (!id || !user) return;
    
    // Join the cart
    joinSharedCart({ variables: { cartId: id } })
      .then((res) => {
        setCartData(JSON.parse(res.data.joinSharedCart));
        setLoadingCart(false);
      })
      .catch((err) => {
        setErrorCart(err.message || 'Failed to join shared cart');
        setLoadingCart(false);
      });
  }, [id, user, joinSharedCart]);

  if (!user) return null;

  if (loadingCart) {
    return <div className="fade-in" style={{ padding: '40px' }}>Loading shared session...</div>;
  }

  if (errorCart) {
    return (
      <div className="fade-in empty-state">
        <div className="icon">🛑</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Access Denied</h2>
        <p>{errorCart}</p>
        <Link href="/dashboard/restaurants" className="btn btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
          Back to Restaurants
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', color: 'var(--success)' }}>
          Shared Order Confirmed!
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          You have successfully completed the checkout for this shared cart.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={() => router.push('/dashboard/orders')}>
            View Orders
          </button>
        </div>
      </div>
    );
  }

  const paymentMethods = pmData?.paymentMethods ? JSON.parse(pmData.paymentMethods) : [];
  const myPMs = paymentMethods.filter((pm: any) => pm.userId === user.id);

  const cartTotal = cartData?.items.reduce((sum: number, i: any) => sum + i.quantity * i.menuItem.price, 0) || 0;

  const handleCheckout = async () => {
    if (!selectedPM) { setCheckoutError('Please select a payment method'); return; }
    setLoadingCheckout(true);
    setCheckoutError('');
    try {
      await checkoutSharedCart({ variables: { cartId: id, paymentMethodId: selectedPM } });
      setSuccess(true);
    } catch (e: any) {
      setCheckoutError(e.message || 'Checkout failed');
    } finally {
      setLoadingCheckout(false);
    }
  };

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Invite link copied to clipboard!');
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>🤝 Shared Cart</h1>
        <button className="btn btn-secondary" onClick={copyLink}>
          🔗 Copy Invite Link
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Items and Participants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Order Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cartData?.items.map((item: any) => (
                <div key={item.menuItemId} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.menuItem.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {user.country === 'INDIA' ? `₹${item.menuItem.price}` : `$${item.menuItem.price.toFixed(2)}`} × {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>
                    {user.country === 'INDIA' ? `₹${(item.menuItem.price * item.quantity).toFixed(0)}` : `$${(item.menuItem.price * item.quantity).toFixed(2)}`}
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

          <div className="card" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Participants ({cartData?.participants.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cartData?.participants.map((p: any) => (
                <div key={p.userId} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'var(--accent)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                  }}>
                    {p.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {p.user.name} {p.userId === user.id && <span style={{ color: 'var(--text-secondary)' }}>(You)</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Checkout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {canCheckout ? (
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
                    </label>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔒</div>
              <p>You do not have permission to checkout this cart. Administrator or Manager required.</p>
            </div>
          )}

          {checkoutError && (
            <div style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius)',
              padding: '12px 16px',
              color: '#ef4444',
              fontSize: '14px',
            }}>
              {checkoutError}
            </div>
          )}

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%' }}
            onClick={handleCheckout}
            disabled={loadingCheckout || myPMs.length === 0 || !canCheckout}
          >
            {loadingCheckout ? 'Placing Order...' : `Pay for Shared Cart • ${user.country === 'INDIA' ? `₹${cartTotal.toFixed(0)}` : `$${cartTotal.toFixed(2)}`}`}
          </button>
        </div>
      </div>
    </div>
  );
}
