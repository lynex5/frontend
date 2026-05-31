import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { playError } from '../utils/sound';

function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  const errorCode = location.state?.code || '404';
  const errorMsg = location.state?.message || 'PAGE NOT FOUND_';
  const detail = location.state?.detail || "The page you're looking for doesn't exist.";

  useEffect(() => {
    playError();
  }, []);

  return (
    <section style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderBottom: 'none' }}>
      <div style={{ fontFamily: 'var(--font-mono)', color: '#555', fontSize: '11px', letterSpacing: '4px', marginBottom: '2rem' }}>SYS://ERROR_{errorCode}</div>
      <h1 style={{ fontSize: 'clamp(60px, 8vw, 80px)', marginBottom: '2rem', textAlign: 'center' }}>{errorMsg}</h1>
      
      <div style={{ height: '1px', background: '#222', width: '300px', marginBottom: '2rem' }} />
      
      <p style={{ color: '#888', marginBottom: '3rem', fontFamily: 'var(--font-mono)' }}>{detail}</p>
      
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
