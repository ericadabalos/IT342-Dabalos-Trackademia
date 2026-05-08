import React from 'react';

export default function Toasts({ toasts, onRemove }) {
  return (
    <div style={{ position: 'fixed', right: 20, top: 20, zIndex: 4000, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{ minWidth: 260, background: '#0f1724', color: '#e2eaf8', border: '1px solid #1e2a45', padding: '10px 14px', borderRadius: 8, boxShadow: '0 6px 18px rgba(2,6,23,0.6)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{t.title || 'Notification'}</div>
          <div style={{ fontSize: 13, color: '#9fb0d6' }}>{t.message}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => onRemove(t.id)} style={{ background: 'transparent', border: 'none', color: '#7aa0d6', cursor: 'pointer' }}>Dismiss</button>
          </div>
        </div>
      ))}
    </div>
  );
}
