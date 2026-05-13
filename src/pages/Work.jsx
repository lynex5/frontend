import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from '../api/apiClient';

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [hoveredProject, setHoveredProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    get('/projects')
      .then(data => { setProjects(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleMouseMove = (e) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
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
    <div className="page-wrap" onMouseMove={handleMouseMove}>
      <div className="section-label">WORK</div>

      <div className="projects-list">
        {projects.length === 0 ? (
          <div style={{ padding: '3rem 2.5rem', color: '#2a2a2a', fontSize: '11px', letterSpacing: '0.2em' }}>
            NO PROJECTS YET_
          </div>
        ) : (
          projects.map((p) => {
            const techText = (p.techStack || 'PROJECT')
              .replace(/,/g, ' →') + ' →';
            const repeated = (techText + '  ').repeat(8);

            return (
              <div
                key={p.id}
                className="project-row"
                onClick={() => navigate('/work/' + p.id)}
                onMouseEnter={() => setHoveredProject(p)}
                onMouseLeave={() => setHoveredProject(null)}
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

      {hoveredProject && (
        <div
          className="cursor-pill"
          style={{
            left: cursorPos.x + 'px',
            top: cursorPos.y + 'px',
          }}
        >
          <div className="cursor-marquee">
            {((hoveredProject.techStack || 'PROJECT').replace(/,/g, ' →') + ' → ').repeat(6)}
            &nbsp;&nbsp;
            {((hoveredProject.techStack || 'PROJECT').replace(/,/g, ' →') + ' → ').repeat(6)}
          </div>
        </div>
      )}
    </div>
  );
}
