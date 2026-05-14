import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../api/apiClient';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [typedDesc, setTypedDesc] = useState('');

  const formatUrl = (url) => {
    if (!url) return "#";
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  useEffect(() => {
    get(`/projects/${id}`)
      .then(data => {
        if (data) setProject(data);
        else setError(true);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!project) return;
    const desc = project.description || "";
    let i = 0;
    const interval = setInterval(() => {
      setTypedDesc(desc.substring(0, i + 1));
      i++;
      if (i > desc.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [project]);

  if (loading) {
    return (
      <div className="page-wrap detail-page">
        <div style={{ color: 'var(--accent)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
          FETCHING_PROJECT_DATA...<span className="cursor-blink">_</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="page-wrap detail-page">
        <div className="detail-window">
          <div className="detail-top">
            <div style={{ display: 'flex', gap: '6px' }}>
              <div className="term-dot" style={{ background: '#FF5F56' }}></div>
              <div className="term-dot" style={{ background: '#FFBD2E' }}></div>
              <div className="term-dot" style={{ background: '#27C93F' }}></div>
            </div>
            <div className="detail-close" onClick={() => navigate('/work')}>[ CLOSE ]</div>
          </div>
          <div className="detail-content" style={{ color: 'var(--red)' }}>
            &gt; ERROR 404: PROJECT NOT FOUND
          </div>
        </div>
      </div>
    );
  }

  const techStackList = project.techStack ? project.techStack.split(',').map(s => s.trim()) : [];

  return (
    <div className="page-wrap detail-page">
      <div className="detail-window page-transition">
        <div className="detail-top">
          <div style={{ display: 'flex', gap: '6px' }}>
            <div className="term-dot" style={{ background: '#FF5F56' }}></div>
            <div className="term-dot" style={{ background: '#FFBD2E' }}></div>
            <div className="term-dot" style={{ background: '#27C93F' }}></div>
          </div>
          <div style={{ fontSize: '10px', color: '#666', fontFamily: 'var(--font-mono)' }}>~/projects/{project.code || `prj_00${project.id}`}</div>
          <div className="detail-close" onClick={() => navigate('/work')} style={{ cursor: 'pointer' }}>[ CLOSE ]</div>
        </div>
        
        <div className="detail-content">
          <div style={{ fontSize: '48px', fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--accent)' }}>&gt;</span> {project.name}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-cream)', marginBottom: '2rem', letterSpacing: '0.1em' }}>
            YEAR: {project.year}
          </div>
          
          <div style={{ fontSize: '14px', lineHeight: '1.8', color: 'var(--text-cream)', minHeight: '100px' }}>
            {typedDesc}<span className="cursor-blink" style={{ color: 'var(--accent)' }}>_</span>
          </div>
          
          <div className="detail-tech-tags">
            {techStackList.map((tech, i) => (
              <div key={i} className="tech-tag">{tech}</div>
            ))}
          </div>
          
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            {project.githubLink && (
              <a href={formatUrl(project.githubLink)} target="_blank" rel="noreferrer" className="detail-link-btn">
                [ GITHUB_REPO ]
              </a>
            )}
            {project.liveLink && (
              <a href={formatUrl(project.liveLink)} target="_blank" rel="noreferrer" className="detail-link-btn">
                [ LIVE_DEPLOYMENT ]
              </a>
            )}
            {!project.githubLink && !project.liveLink && (
              <div style={{ fontSize: '10px', color: '#666' }}>NO EXTERNAL LINKS AVAILABLE</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
