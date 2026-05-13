import React, { useState, useEffect } from 'react';
import { get } from '../api/apiClient';

function Contact() {
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    get('/contact').then(data => {
      if(data && data.length > 0) setContact(data[0]);
    }).catch(()=>{});
  }, []);

  const handleCopy = () => {
    const email = contact?.email || "rahul@kluniversity.edu.in";
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-wrap">
      <section className="contact-wrap">
        <div className="contact-inner">
          <div className="contact-left">
            <div className="contact-eyebrow">GET IN TOUCH</div>
            <h2 className="contact-heading">Let's build<br/>the future.</h2>
            <div className="contact-sub">Available for internships and freelance opportunities.</div>
          </div>
          <div className="contact-right">
            <button 
              className={`contact-btn email-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? "COPIED ✓" : "COPY EMAIL"}
              <span className="contact-btn-arrow">→</span>
            </button>
            <a href={contact?.linkedinUrl || "#"} className="contact-btn" style={{pointerEvents: contact?.linkedinUrl ? 'auto' : 'none', opacity: contact?.linkedinUrl ? 1 : 0.5}}>
              LinkedIn <span className="contact-btn-arrow">↗</span>
            </a>
            <a href={contact?.githubUrl || "#"} className="contact-btn" style={{pointerEvents: contact?.githubUrl ? 'auto' : 'none', opacity: contact?.githubUrl ? 1 : 0.5}}>
              GitHub <span className="contact-btn-arrow">↗</span>
            </a>
            <a href={contact?.youtubeUrl || "#"} className="contact-btn" style={{pointerEvents: contact?.youtubeUrl ? 'auto' : 'none', opacity: contact?.youtubeUrl ? 1 : 0.5}}>
              YouTube <span className="contact-btn-arrow">↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
