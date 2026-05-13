import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <section style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: 'none' }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: '#555', fontSize: '11px', letterSpacing: '4px', marginBottom: '2rem' }}>SYS://ERROR_404</div>
      <h1 style={{ fontSize: 'clamp(60px, 8vw, 80px)', marginBottom: '2rem', textAlign: 'center' }}>PAGE NOT FOUND_</h1>
      
      <div style={{ height: '1px', background: '#222', width: '300px', marginBottom: '2rem' }} />
      
      <p style={{ color: '#888', marginBottom: '3rem', fontFamily: 'var(--font-mono)' }}>The page you're looking for doesn't exist.</p>
      
      <button 
        className="btn accent"
        onClick={() => navigate('/')}
      >
        ← RETURN HOME
      </button>
    </section>
  );
}

export default NotFound;
