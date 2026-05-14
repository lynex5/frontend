import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../api/apiClient';

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const pillRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const pillPos = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  useEffect(() => {
    get('/projects')
      .then(data => { setProjects(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.terminal-card').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [projects, filter, loading]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      pillPos.current.x = lerp(pillPos.current.x, mousePos.current.x + 20, 0.15);
      pillPos.current.y = lerp(pillPos.current.y, mousePos.current.y + 10, 0.15);

      if (pillRef.current) {
        pillRef.current.style.transform = `translate(${pillPos.current.x}px, ${pillPos.current.y}px) scale(${pillRef.current.classList.contains('visible') ? 1 : 0})`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseEnterRow = () => {
    if (pillRef.current) pillRef.current.classList.add('visible');
  };

  const handleMouseLeaveRow = () => {
    if (pillRef.current) pillRef.current.classList.remove('visible');
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'ALL') return true;
    if (!p.techStack) return false;
    return p.techStack.toUpperCase().includes(filter);
  });

  if (loading) {
    return (
      <div className="page-wrap work-page">
        <div style={{ color: 'var(--accent)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          LOADING_PROJECTS...<span className="cursor-blink">_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap work-page">
      <div style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '3rem' }}>[ ROOT/WORK ]</div>

      <div className="filter-bar">
        {['ALL', 'JAVA', 'CLOUD', 'REACT', 'SPRING BOOT'].map(f => (
          <button 
            key={f} 
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="terminal-grid">
        {filteredProjects.length === 0 ? (
          <div style={{ padding: '3rem 2rem', color: '#666', fontSize: '12px' }}>
            &gt; ERROR: NO_PROJECTS_FOUND_FOR_FILTER
          </div>
        ) : (
          filteredProjects.map((p, idx) => (
            <div
              key={p.id}
              className="terminal-card"
              style={{ transitionDelay: `${(idx % 4) * 0.1}s` }}
              onClick={() => navigate('/work/' + p.id)}
              onMouseEnter={handleMouseEnterRow}
              onMouseLeave={handleMouseLeaveRow}
            >
              <div className="terminal-top">
                <div className="term-dot" style={{ background: '#FF5F56' }}></div>
                <div className="term-dot" style={{ background: '#FFBD2E' }}></div>
                <div className="term-dot" style={{ background: '#27C93F' }}></div>
                <div className="term-path">
                  ~/projects/{p.code || `prj_00${p.id}`}
                </div>
              </div>
              <div className="terminal-body">
                <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--white)', marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--accent)' }}>&gt;</span> {p.name}
                </div>
                <div style={{ marginBottom: '2rem' }}>{p.description}</div>
                <div style={{ color: 'var(--accent)', fontSize: '10px', textTransform: 'uppercase' }}>
                  [ {p.techStack} ]
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cursor-pill" ref={pillRef}>
        VIEW PROJECT ↗
      </div>
    </div>
  );
}
