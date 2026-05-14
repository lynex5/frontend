import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../api/apiClient';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle, handshaking, success, error
  const [handshakeLines, setHandshakeLines] = useState([]);
  
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let reqId;
    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    initCanvas();
    window.addEventListener('resize', initCanvas);

    const alphabet = '01';
    const fontSize = 14;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const y = drops[i] * fontSize;
        
        ctx.fillStyle = status === 'error' ? '#FF3333' : '#00FF41';
        ctx.fillText(text, i * fontSize, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      reqId = requestAnimationFrame(draw);
    };
    
    reqId = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', initCanvas);
      cancelAnimationFrame(reqId);
    };
  }, [status]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setStatus('handshaking');
    setError('');
    setHandshakeLines(['> INITIATING SECURE HANDSHAKE...']);
    
    // Fake handshake sequence
    await new Promise(r => setTimeout(r, 400));
    setHandshakeLines(prev => [...prev, '> RESOLVING HOST... OK']);
    await new Promise(r => setTimeout(r, 400));
    setHandshakeLines(prev => [...prev, '> VERIFYING CREDENTIALS...']);
    await new Promise(r => setTimeout(r, 600));

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setHandshakeLines(prev => [...prev, '> ACCESS GRANTED.']);
        setStatus('success');
        setTimeout(() => {
          navigate('/dashboard');
          window.location.reload();
        }, 1000);
      } else {
        setHandshakeLines(prev => [...prev, '> ACCESS DENIED.']);
        setStatus('error');
        setError('ACCESS DENIED_');
        setTimeout(() => setStatus('idle'), 500); // Remove shake class after anim
      }
    } catch {
      setHandshakeLines(prev => [...prev, '> CONNECTION FAILED.']);
      setStatus('error');
      setError('CONNECTION FAILED_');
      setTimeout(() => setStatus('idle'), 500);
    }
  };

  return (
    <div className="page-wrap login-page" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', width: '100%' }}>
      <canvas ref={canvasRef} className="login-matrix" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', opacity: 0.08 }} />
      
      <div className={`login-box ${status === 'error' ? 'shake' : ''} ${status === 'success' ? 'success' : ''}`} style={{ position: 'relative', zIndex: 2, maxWidth: '460px', width: '90%' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: '#CCC', marginBottom: '1rem' }}>SYS://AUTH_PORTAL</div>
        
        <h1 className="login-title">
          SYSTEM_LOGIN<span className="cursor-blink">_</span>
        </h1>

        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '2rem' }} />

        {status === 'handshaking' || status === 'success' ? (
          <div style={{ minHeight: '150px', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)', textAlign: 'center', alignItems: 'center' }}>
            {handshakeLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            {status === 'handshaking' && <div className="cursor-blink">_</div>}
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <input
              type="text"
              placeholder="USERNAME"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="dash-input"
              style={{ borderBottom: 'none', background: 'transparent', padding: '16px' }}
              autoComplete="off"
              spellCheck="false"
            />
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="dash-input"
              style={{ background: 'transparent', padding: '16px' }}
            />

            <button
              type="submit"
              className="dash-btn"
              style={{ padding: '16px', fontSize: '18px', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', marginTop: '1.5rem' }}
            >
              LOGIN_
            </button>
          </form>
        )}

        {error && status !== 'handshaking' && (
          <div style={{ color: 'var(--red)', fontSize: '10px', marginTop: '1rem', letterSpacing: '0.2em' }}>{error}</div>
        )}
      </div>
    </div>
  );
}
