import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectsManager from '../components/dashboard/ProjectsManager';
import SkillsManager from '../components/dashboard/SkillsManager';
import AboutManager from '../components/dashboard/AboutManager';
import ContactManager from '../components/dashboard/ContactManager';
import ResumeManager from '../components/dashboard/ResumeManager';

const TABS = ['projects', 'skills', 'about', 'contact', 'resume'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      navigate('/login');
    }
  }, [navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'projects': return <ProjectsManager />;
      case 'skills':   return <SkillsManager />;
      case 'about':    return <AboutManager />;
      case 'contact':  return <ContactManager />;
      case 'resume':   return <ResumeManager />;
      default: return null;
    }
  };

  return (
    <div className="page-wrap">
      <div className="dash-wrap">

        <aside className="dash-sidebar">
          <div className="dash-sidebar-label">SYS://ADMIN</div>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`dash-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </aside>

        <div className="dash-content">
          <h1 className="dash-title">
            {activeTab.toUpperCase()}<span className="cursor-blink">_</span>
          </h1>
          {renderContent()}
        </div>

      </div>
    </div>
  );
}
