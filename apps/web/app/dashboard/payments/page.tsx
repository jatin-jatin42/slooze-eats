'use client';

import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { useAuth, useCanManagePayments } from '../../../lib/auth-context';

const PM_QUERY = gql`query GetPayments { paymentMethods }`;
const ADD_PM = gql`mutation AddPM($userId: String!, $type: String!, $last4: String!, $name: String!) {
  addPaymentMethod(userId: $userId, type: $type, last4: $last4, name: $name)
}`;
const DELETE_PM = gql`mutation DeletePM($id: String!) { deletePaymentMethod(id: $id) }`;

const USERS_FOR_PM = [
  { id: 'nickfury', name: 'Nick Fury' },
];

export default function PaymentsPage() {
  const { user } = useAuth();
  const canManage = useCanManagePayments();
  const { data, loading, refetch } = useQuery(PM_QUERY);
  const [addPM] = useMutation(ADD_PM);
  const [deletePM] = useMutation(DELETE_PM);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: '', type: 'VISA', last4: '', name: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) return null;

  if (!canManage) {
    return (
      <div className="empty-state fade-in">
        <div className="icon">🔒</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Admin Only</h2>
        <p>Only Admins can manage payment methods.</p>
      </div>
    );
  }

  const paymentMethods = data?.paymentMethods ? JSON.parse(data.paymentMethods) : [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await addPM({ variables: form });
      setForm({ userId: '', type: 'VISA', last4: '', name: '' });
      setShowForm(false);
      refetch();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payment method?')) return;
    await deletePM({ variables: { id } });
    refetch();
  };

  const cardIcon = (type: string) => {
    if (type === 'VISA') return '💳';
    if (type === 'MASTERCARD') return '🔴';
    return '🟡';
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '6px' }}>💳 Payment Methods</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage payment methods for all users</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Payment Method'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px' }}>Add New Payment Method</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User Email</label>
              <input
                className="input"
                type="text"
                placeholder="User ID"
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Card Type</label>
              <select
                className="input"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="VISA">VISA</option>
                <option value="MASTERCARD">MASTERCARD</option>
                <option value="AMEX">AMEX</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last 4 Digits</label>
              <input
                className="input"
                type="text"
                placeholder="4242"
                value={form.last4}
                onChange={(e) => setForm({ ...form, last4: e.target.value.slice(0, 4) })}
                maxLength={4}
                pattern="[0-9]{4}"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cardholder Name</label>
              <input
                className="input"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            {error && (
              <div style={{ gridColumn: '1/-1', color: '#ef4444', fontSize: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius)', padding: '10px 14px' }}>
                {error}
              </div>
            )}
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Payment Method'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment methods list */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-lg)' }} />
          ))}
        </div>
      ) : paymentMethods.length === 0 ? (
        <div className="empty-state">
          <div className="icon">💳</div>
          <p>No payment methods found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {paymentMethods.map((pm: any) => (
            <div key={pm.id} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '28px' }}>{cardIcon(pm.type)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>
                  {pm.type} •••• {pm.last4}
                  {pm.isDefault && (
                    <span className="badge badge-admin" style={{ marginLeft: '8px', fontSize: '10px', padding: '1px 6px', verticalAlign: 'middle' }}>Default</span>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                  <span>{pm.name}</span>
                  {pm.user && <span>· {pm.user.name}</span>}
                </div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(pm.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
