import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsManager from '../components/dashboard/ProjectsManager';
import SkillsManager from '../components/dashboard/SkillsManager';
import AboutManager from '../components/dashboard/AboutManager';
import ContactManager from '../components/dashboard/ContactManager';
import ResumeManager from '../components/dashboard/ResumeManager';
import SiteStatsManager from '../components/dashboard/SiteStatsManager';
import TimelineManager from '../components/dashboard/TimelineManager';

const TABS = ['projects', 'skills', 'about', 'contact', 'resume', 'stats', 'timeline'];

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
