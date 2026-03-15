'use client';

import { useQuery, gql } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../../lib/auth-context';
import Image from 'next/image';

const RESTAURANT_QUERY = gql`
  query GetRestaurant($id: String!) {
    restaurant(id: $id)
  }
`;

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, addToCart, cart } = useAuth();
  const { data, loading } = useQuery(RESTAURANT_QUERY, { variables: { id } });

  if (!user) return null;

  const restaurant = data?.restaurant ? JSON.parse(data.restaurant) : null;

  const categories = restaurant?.menuItems
    ? [...new Set(restaurant.menuItems.map((m: any) => m.category))] as string[]
    : [];

  const handleAdd = (item: any) => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      restaurantId: restaurant.id,
    });
  };

  const cartItemQty = (menuItemId: string) =>
    cart.find((i) => i.menuItemId === menuItemId)?.quantity || 0;

  const isCurrency = (price: number) => price < 100;

  return (
    <div className="fade-in">
      {loading ? (
        <div>
          <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }} />
          <div className="grid-auto grid-auto-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: '180px', borderRadius: 'var(--radius-lg)' }} />
            ))}
          </div>
        </div>
      ) : restaurant ? (
        <>
          {/* Restaurant header */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '32px' }}>
            <div style={{ position: 'relative', height: '180px' }}>
              {restaurant.image ? (
                <Image src={restaurant.image} alt={restaurant.name} fill style={{ objectFit: 'cover' }} sizes="100vw" />
              ) : (
                <div style={{ background: 'var(--bg-secondary)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px' }}>
                  🏪
                </div>
              )}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
              }} />
              <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'white', marginBottom: '6px' }}>
                  {restaurant.name}
                </h1>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{restaurant.cuisine}</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {restaurant.rating}</span>
                  <span className={`badge badge-${restaurant.country.toLowerCase()}`} style={{ fontSize: '11px' }}>
                    {restaurant.country === 'INDIA' ? '🇮🇳' : '🇺🇸'} {restaurant.country}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cart panel */}
          {cart.length > 0 && cart[0].restaurantId === restaurant.id && (
            <div style={{
              background: 'var(--accent-glow)',
              border: '1px solid rgba(255,107,53,0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 20px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                🛒 {cart.reduce((s, i) => s + i.quantity, 0)} items in cart
              </span>
              <Link href="/dashboard/checkout" className="btn btn-primary btn-sm">
                Go to Checkout →
              </Link>
            </div>
          )}

          {/* Menu by category */}
          {categories.map((cat) => {
            const items = restaurant.menuItems.filter((m: any) => m.category === cat);
            return (
              <section key={cat} style={{ marginBottom: '36px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  {cat}
                </h2>
                <div className="grid-auto grid-auto-3">
                  {items.map((item: any) => {
                    const qty = cartItemQty(item.id);
                    return (
                      <div key={item.id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {item.image && (
                          <div style={{ position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                            <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="300px" />
                          </div>
                        )}
                        <div>
                          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{item.name}</h3>
                          {item.description && (
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                              {item.description}
                            </p>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--accent)' }}>
                              {isCurrency(item.price) ? `$${item.price.toFixed(2)}` : `₹${item.price}`}
                            </span>
                            {qty > 0 ? (
                              <span style={{ fontSize: '13px', color: 'var(--success)', fontWeight: 600 }}>
                                ✓ {qty} in cart
                              </span>
                            ) : (
                              <button className="btn btn-primary btn-sm" onClick={() => handleAdd(item)}>
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </>
      ) : (
        <div className="empty-state">
          <div className="icon">🔒</div>
          <p>Restaurant not found or not accessible in your region.</p>
        </div>
      )}
    </div>
  );
}
