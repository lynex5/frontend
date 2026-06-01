import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsManager from '../components/dashboard/ProjectsManager';
import SkillsManager from '../components/dashboard/SkillsManager';
import AboutManager from '../components/dashboard/AboutManager';
import ContactManager from '../components/dashboard/ContactManager';
import ResumeManager from '../components/dashboard/ResumeManager';
import SiteStatsManager from '../components/dashboard/SiteStatsManager';
import TimelineManager from '../components/dashboard/TimelineManager';

const TABS = ['projects', 'skills', 'about', 'contact', 'resume', 'stats', 'timeline', 'gfg'];

import { BASE_URL } from '../api/apiClient';

function GfgPanel() {
  const [cookieValue, setCookieValue] = useState('');
  const [status, setStatus] = useState(null);
  const [updatedAt, setUpdatedAt] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/admin/gfg-cookies/status`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('not ok');
        return res.json();
      })
      .then(data => {
        if (data && data.status === 'ACTIVE') {
          setStatus('ACTIVE');
          setUpdatedAt(data.updatedAt);
        } else {
          setStatus('NOT_SET');
        }
      })
      .catch(() => setStatus('NOT_SET'));
  }, []);

  const handleUpdate = () => {
    fetch(`${BASE_URL}/admin/gfg-cookies`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ fullCookieString: cookieValue })
    })
      .then(res => {
        if (!res.ok) throw new Error('not ok');
        return res.json();
      })
      .then(data => {
        if (data && data.status === 'updated') {
          setMessage('> COOKIES UPDATED ✅');
          setStatus('ACTIVE');
          setUpdatedAt(data.updatedAt);
          setCookieValue('');
        } else {
          setMessage('> UPDATE FAILED ❌');
        }
      })
      .catch(() => setMessage('> UPDATE FAILED ❌'));
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ background: '#00FF41', color: '#0a0a0a', padding: '0.5rem 1rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
        GFG COOKIES
      </div>
      <div style={{ padding: '1rem', border: '1px solid var(--border)', background: '#0a0a0a', marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          {status === 'ACTIVE' ? (
            <span style={{ color: '#00FF41', fontSize: '0.9rem' }}>{`> COOKIES ACTIVE — last updated: ${updatedAt}`}</span>
          ) : (
            <span style={{ color: '#ff4444', fontSize: '0.9rem' }}>{`> NO COOKIES SET`}</span>
          )}
        </div>
        
        <label style={{ display: 'block', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>FULL COOKIE STRING</label>
        <textarea 
          placeholder="paste entire cookie string here"
          value={cookieValue}
          onChange={e => setCookieValue(e.target.value)}
          rows={10}
          style={{
            width: '100%',
            background: '#0d0d0d',
            border: '1px solid #00FF4144',
            color: '#00FF41',
            fontFamily: '"JetBrains Mono", monospace',
            padding: '0.75rem',
            marginBottom: '1rem',
            outline: 'none',
            resize: 'vertical'
          }}
          onFocus={e => e.target.style.border = '1px solid #00FF41'}
          onBlur={e => e.target.style.border = '1px solid #00FF4144'}
        />

        <button 
          onClick={handleUpdate}
          style={{
            width: '100%',
            background: '#00FF41',
            color: '#0a0a0a',
            fontWeight: 'bold',
            padding: '0.75rem',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}
        >
          [ UPDATE COOKIES ]
        </button>

        {message && (
          <div style={{ marginTop: '1rem', color: message.includes('✅') ? '#00FF41' : '#ff4444' }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [typedTitle, setTypedTitle] = useState('');
  const [sysTime, setSysTime] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const int = setInterval(() => {
      const d = new Date();
      setSysTime(d.toISOString().replace('T', ' ').substring(0, 19));
    }, 1000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    setTypedTitle('');
    let i = 0;
    const interval = setInterval(() => {
      setTypedTitle(activeTab.toUpperCase().substring(0, i + 1));
      i++;
      if (i >= activeTab.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsManager />;
      case 'skills':   return <SkillsManager />;
      case 'about':    return <AboutManager />;
      case 'contact':  return <ContactManager />;
      case 'resume':   return <ResumeManager />;
      case 'stats':    return <SiteStatsManager />;
      case 'timeline': return <TimelineManager />;
      case 'gfg':      return <GfgPanel />;
      default: return null;
    }
  };

  return (
    <div className="page-wrap">
      <div className="dash-wrap">
        
        <aside className="dash-sidebar">
          <div className="dash-sidebar-label">
            SYS://ADMIN_ROOT
          </div>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`dash-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              ./{tab}.sh
            </button>
          ))}
          
          <div className="dash-session">
            <div>SESSION_ACTIVE</div>
            <div style={{ color: '#CCC', marginTop: '0.5rem' }}>{sysTime}</div>
            <div style={{ color: '#666', marginTop: '0.5rem' }}>IP: 127.0.0.1</div>
            <div style={{ color: '#666', marginTop: '0.5rem' }}>USR: ROOT</div>
          </div>
        </aside>

        <div className="dash-content">
          <div className="dash-scanline-overlay"></div>
          
          <div className="dash-breadcrumb">
            [ ROOT / DASHBOARD / {activeTab.toUpperCase()} ]
          </div>
          
          <h1 className="dash-title">
            <span style={{ color: 'var(--accent)', marginRight: '1rem' }}>&gt;</span>
            {typedTitle}<span className="cursor-blink">_</span>
          </h1>
          
          <div style={{ position: 'relative', zIndex: 10, background: '#0C0C0C', border: '1px solid var(--border)' }}>
            <div className="terminal-top" style={{ background: '#111', borderBottom: '1px solid var(--border)' }}>
              <div className="term-dot" style={{ background: '#FF5F56' }}></div>
              <div className="term-dot" style={{ background: '#FFBD2E' }}></div>
              <div className="term-dot" style={{ background: '#27C93F' }}></div>
              <div className="term-path">~/dashboard/{activeTab}</div>
            </div>
            
            <div style={{ padding: '2rem' }}>
              {renderContent()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
