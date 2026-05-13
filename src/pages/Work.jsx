import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../api/apiClient';

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const handleMouseDown = () => {
      if (pillRef.current) {
        pillRef.current.classList.add('is-pressed');
      }
    };

    const handleMouseUp = () => {
      if (pillRef.current) {
        pillRef.current.classList.remove('is-pressed');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      pillPos.current.x = lerp(pillPos.current.x, mousePos.current.x + 20, 0.12);
      pillPos.current.y = lerp(pillPos.current.y, mousePos.current.y + 10, 0.12);

      if (pillRef.current) {
        pillRef.current.style.transform = `translate(${pillPos.current.x}px, ${pillPos.current.y}px)`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseEnterRow = () => {
    if (pillRef.current) {
      pillRef.current.classList.add('is-active');
    }
  };

  const handleMouseLeaveRow = () => {
    if (pillRef.current) {
      pillRef.current.classList.remove('is-active');
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <div className="section-label">WORK</div>
        <div style={{ padding: '3rem 2.5rem', color: '#333', fontSize: '11px', letterSpacing: '0.2em' }}>
          LOADING<span className="cursor-blink">_</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <div className="section-label">WORK</div>

      <div className="projects-list">
        {projects.length === 0 ? (
          <div style={{ padding: '3rem 2.5rem', color: '#2a2a2a', fontSize: '11px', letterSpacing: '0.2em' }}>
            NO PROJECTS YET_
          </div>
        ) : (
          projects.map((p) => {
            return (
              <div
                key={p.id}
                className="project-row"
                onClick={() => navigate('/work/' + p.id)}
                onMouseEnter={handleMouseEnterRow}
                onMouseLeave={handleMouseLeaveRow}
              >
                <div className="project-code">{p.code || `PRJ-00${p.id}`}</div>
                <div className="project-name">{p.name}</div>
                <div className="project-desc">{p.description}</div>
                <div className="project-tags">{p.techStack}</div>
                <div className="project-year">{p.year}</div>
                <div className="project-arrow">→</div>
              </div>
            );
          })
        )}
      </div>

      <div className="cursor-pill" ref={pillRef}>
        VIEW PROJECT ↗
      </div>
    </div>
  );
}
