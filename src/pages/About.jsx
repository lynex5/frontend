import React, { useState, useEffect, useRef } from 'react';
import { get, BASE_URL } from '../api/apiClient';

export default function About() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [siteStats, setSiteStats] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [typedBio, setTypedBio] = useState('');
  const [uptime, setUptime] = useState(0);

  const bioRef = useRef(null);
  const tiltRef = useRef(null);
  const [bioTyping, setBioTyping] = useState(false);

  useEffect(() => {
    get('/about').then(data => { if(data && data.length > 0) setAbout(data[0]); }).catch(()=>{});
    get('/skills').then(data => setSkills(data || [])).catch(()=>{});
    get('/stats').then(data => setSiteStats(data)).catch(()=>{});
    get('/timeline').then(data => setTimeline(data || [])).catch(()=>{});
  }, []);

  // System Uptime
  useEffect(() => {
    const int = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(int);
  }, []);

  // Typewriter effect triggered by scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !bioTyping) {
        setBioTyping(true);
      }
    }, { threshold: 0.3 });
    
    if (bioRef.current) observer.observe(bioRef.current);
    return () => observer.disconnect();
  }, [bioTyping]);

  useEffect(() => {
    if (!bioTyping) return;
    const fullBio = about?.shortBio || "Curious by default. Based at KL University, Vijayawada, I focus my time on algorithmic problem solving, cloud architecture, and diving deep into data systems.\n\nWhen I'm not writing Java or building Spring Boot APIs, I'm documenting my process through code tutorials and technical content creation.";
    
    let i = 0;
    const interval = setInterval(() => {
      setTypedBio(fullBio.substring(0, i + 1));
      i++;
      if (i > fullBio.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [bioTyping, about]);

  // 3D Tilt Effect
  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      el.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg)`;
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Timeline Scroll Animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [timeline]);

  const handleDownload = () => {
    window.location.href = `${BASE_URL}/resume/download`;
  };

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="page-wrap about-page">
      <section className="about-hero">
        <div className="tilt-card" ref={tiltRef}>
          <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', marginBottom: '1.5rem', color: 'var(--accent)', letterSpacing: '0.05em' }}>
            {about?.boldStatement || "I'm a CS student who builds things that work, then makes them better."}
          </div>
          
          <div className="about-bio" ref={bioRef} style={{ fontSize: '13px', lineHeight: '1.8', color: 'var(--text-cream)', whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
            {typedBio}<span className="cursor-blink" style={{color: 'var(--accent)'}}>_</span>
          </div>

          <div className="system-status-widget" style={{ marginBottom: '2rem' }}>
            <div>┌─ SYSTEM STATUS ─────────────────────────────┐</div>
            <div>│  NODE        {siteStats?.nodeName || '—'}</div>
            <div>│  STATUS      <span style={{color: 'var(--accent)'}}>● ONLINE</span></div>
            <div>│  BUILD       {siteStats?.buildDate || '—'}</div>
            <div>│  STACK       {siteStats?.techSummary || '—'}</div>
            <div>│  UPTIME      {formatUptime(uptime)}</div>
            <div>│  LAST COMMIT "{siteStats?.lastCommit || '—'}"</div>
            <div>└──────────────────────────────────────────────┘</div>
          </div>
          
          <button className="dash-btn" onClick={handleDownload} style={{ width: 'fit-content', padding: '12px 24px' }}>
            DOWNLOAD RESUME ↗
          </button>
        </div>
      </section>

      <div className="skills-ticker-wrap">
        <div className="skills-ticker">
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span className="ticker-item" key={index}>
                    {skill.name}
                    <div className="skill-tooltip">
                      [{'█'.repeat(Math.floor(skill.proficiency/10))}{'░'.repeat(10-Math.floor(skill.proficiency/10))}] {skill.proficiency}%
                    </div>
                  </span>
                ))
              ) : (
                ['Java', 'Spring Boot', 'FastAPI', 'MySQL', 'AWS', 'Docker', 'Kubernetes', 'React'].map((skill, index) => (
                  <span className="ticker-item" key={index}>
                    {skill}
                    <div className="skill-tooltip">
                      [████████░░] 80%
                    </div>
                  </span>
                ))
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <section className="timeline-section">
        <div style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '3rem' }}>[ SYSTEM TIMELINE ]</div>
        <div className="timeline-container" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '5px', top: 0, bottom: 0, width: '2px', background: 'var(--border)' }}></div>
          
          {timeline.length > 0 ? timeline.map((item, index) => (
            <div key={index} className="timeline-item" style={{ transitionDelay: `${index * 0.15}s` }}>
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <div style={{ fontSize: '10px', color: 'var(--accent)', marginBottom: '8px' }}>{item.year}</div>
                <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--white)' }}>{item.event}</h3>
              </div>
            </div>
          )) : (
            <div className="timeline-item in-view">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-display)', color: 'var(--white)' }}>Timeline coming soon...</h3>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
