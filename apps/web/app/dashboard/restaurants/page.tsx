'use client';

import { useQuery, gql } from '@apollo/client';
import Link from 'next/link';
import { useAuth } from '../../../lib/auth-context';
import Image from 'next/image';

const RESTAURANTS_QUERY = gql`
  query GetRestaurants {
    restaurants
  }
`;

export default function RestaurantsPage() {
  const { user } = useAuth();
  const { data, loading } = useQuery(RESTAURANTS_QUERY);

  if (!user) return null;

  const restaurants = data?.restaurants ? JSON.parse(data.restaurants) : [];

  const indiaRest = restaurants.filter((r: any) => r.country === 'INDIA');
  const americaRest = restaurants.filter((r: any) => r.country === 'AMERICA');

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
          🏪 Restaurants
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user.role === 'ADMIN'
            ? `Showing all ${restaurants.length} restaurants across India & America`
            : `Showing restaurants in ${user.country === 'INDIA' ? 'India 🇮🇳' : 'America 🇺🇸'}`}
        </p>
      </div>

      {loading ? (
        <div className="grid-auto grid-auto-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ height: '260px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* India restaurants */}
          {indiaRest.length > 0 && (
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🇮🇳 India
                <span className="badge badge-india">{indiaRest.length} restaurants</span>
              </h2>
              <div className="grid-auto grid-auto-3">
                {indiaRest.map((r: any) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </section>
          )}

          {/* America restaurants */}
          {americaRest.length > 0 && (
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🇺🇸 America
                <span className="badge badge-america">{americaRest.length} restaurants</span>
              </h2>
              <div className="grid-auto grid-auto-3">
                {americaRest.map((r: any) => (
                  <RestaurantCard key={r.id} restaurant={r} />
                ))}
              </div>
            </section>
          )}

          {restaurants.length === 0 && (
            <div className="empty-state">
              <div className="icon">🍽️</div>
              <p>No restaurants available in your region.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: any }) {
  const menuCount = restaurant.menuItems?.length || 0;

  return (
    <Link href={`/dashboard/restaurants/${restaurant.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
        {/* Image */}
        <div style={{ position: 'relative', height: '160px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
          {restaurant.image ? (
            <Image
              src={restaurant.image}
              alt={restaurant.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '48px' }}>
              🏪
            </div>
          )}
          {/* Rating overlay */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '20px',
            padding: '4px 10px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#fbbf24',
            backdropFilter: 'blur(8px)',
          }}>
            ★ {restaurant.rating}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '4px', color: 'var(--text-primary)' }}>
            {restaurant.name}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{restaurant.cuisine}</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{menuCount} items</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
