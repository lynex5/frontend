import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../api/apiClient';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        if (data) {
          setProject(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="page-wrap"><section className="project-detail">
      <div style={{ fontFamily: 'var(--font-mono)', color: '#555', fontSize: '11px', letterSpacing: '0.2em' }}>LOADING PROJECT<span className="cursor-blink">_</span></div>
    </section></div>;
  }

  if (error || !project) {
    return <div className="page-wrap"><section className="not-found">
      <button className="back-btn" onClick={() => navigate('/work')}>← BACK TO WORK</button>
      <div className="not-found-code">ERROR 404</div>
      <h1>PROJECT NOT FOUND</h1>
      <p>The project you are looking for does not exist.</p>
    </section></div>;
  }

  const techStackList = project.techStack ? project.techStack.split(',').map(s => s.trim()) : [];

  return (
    <div className="page-wrap">
      <section className="project-detail">
        <button className="back-btn" onClick={() => navigate('/work')}>
          ← BACK TO WORK
        </button>

        <div className="detail-code">
          {project.code || `PRJ-00${project.id}`}
        </div>
        <h1 className="detail-title">
          {project.name}
        </h1>

        <div className="detail-divider" />

        <div style={{ marginBottom: '2rem' }}>
          <div className="detail-section-label">[ DESCRIPTION ]</div>
          <p className="detail-desc">
            {project.description}
          </p>
        </div>

        <div className="detail-divider" />

        <div style={{ marginBottom: '2rem' }}>
          <div className="detail-section-label">[ TECH STACK ]</div>
          <div>
            {techStackList.map((tech, i) => (
              <span key={i} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-divider" />

        <div style={{ marginBottom: '2rem' }}>
          <div className="detail-section-label">[ YEAR ]</div>
          <div className="detail-year-val">{project.year}</div>
        </div>

        {(project.githubLink || project.liveLink) && (
          <>
            <div className="detail-divider" />
            <div>
              <div className="detail-section-label">[ LINKS ]</div>
              <div>
                {project.githubLink && (
                  <a href={formatUrl(project.githubLink)} target="_blank" rel="noreferrer" className="link-btn">GITHUB ↗</a>
                )}
                {project.liveLink && (
                  <a href={formatUrl(project.liveLink)} target="_blank" rel="noreferrer" className="link-btn">LIVE SITE ↗</a>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default ProjectDetail;
