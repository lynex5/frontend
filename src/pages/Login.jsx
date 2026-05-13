import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
        window.location.reload();
      } else {
        setError('ACCESS DENIED_');
        setIsLoading(false);
      }
    } catch (err) {
      setError('CONNECTION FAILED_');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrap login-page">
      <div className="login-box">

        <div className="login-eyebrow">SYS://AUTH_PORTAL</div>

        <h1 className="login-title">
          SYSTEM_LOGIN<span className="cursor-blink">_</span>
        </h1>

        <div className="login-divider" />

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <input
            type="text"
            placeholder="USERNAME"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="login-field"
            autoComplete="off"
            spellCheck="false"
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-field"
            style={{ borderTop: 'none' }}
          />

          <div className="login-gap" />

          <button
            type="submit"
            disabled={isLoading}
            className="login-submit"
          >
            {isLoading
              ? <>AUTHENTICATING<span className="cursor-blink">_</span></>
              : 'LOGIN_'
            }
          </button>
        </form>

        {error && (
          <div className="login-error">{error}</div>
        )}

      </div>
    </div>
  );
}
