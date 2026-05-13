import React, { useState, useEffect } from 'react';
import { get } from '../api/apiClient';

function About() {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    get('/about').then(data => { if(data && data.length > 0) setAbout(data[0]); }).catch(()=>{});
    get('/skills').then(data => setSkills(data || [])).catch(()=>{});
  }, []);

  const handleDownload = () => {
    window.open('https://backend-g3hl.onrender.com/api/resume/download', '_blank');
  };

  return (
    <div className="page-wrap">
      <section className="about-hero">
        <div className="about-statement">
          {about?.boldStatement || "I'm a CS student who builds things that work, then makes them better."}
        </div>
        <div className="about-bio">
          <p>
            {about?.shortBio || "Curious by default. Based at KL University, Vijayawada, I focus my time on algorithmic problem solving, cloud architecture, and diving deep into data systems.\n\nWhen I'm not writing Java or building Spring Boot APIs, I'm documenting my process through code tutorials and technical content creation."}
          </p>
          <button className="resume-btn" onClick={handleDownload}>DOWNLOAD RESUME ↗</button>
        </div>
      </section>

      <div className="skills-ticker-wrap">
        <div className="skills-ticker">
          {[...Array(2)].map((_, i) => (
            <div className="skills-ticker-inner" key={i}>
              {skills.length > 0 ? (
                skills.map((skill, index) => (
                  <React.Fragment key={index}>
                    <span className="ticker-item">{skill.name}</span>
                    <span className="ticker-sep">/</span>
                  </React.Fragment>
                ))
              ) : (
                <>
                  <span className="ticker-item">Java</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">Spring Boot</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">FastAPI</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">MySQL</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">AWS</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">CUDA</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">Docker</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">Kubernetes</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">React</span><span className="ticker-sep">/</span>
                  <span className="ticker-item">Git</span><span className="ticker-sep">/</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
