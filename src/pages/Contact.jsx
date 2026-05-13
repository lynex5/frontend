import React, { useState, useEffect } from 'react';
import { get } from '../api/apiClient';

function Contact() {
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(null);

  const formatUrl = (url) => {
    if (!url) return "#";
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

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
            <a href={formatUrl(contact?.linkedinUrl)} target="_blank" rel="noreferrer" className="contact-btn" style={{pointerEvents: contact?.linkedinUrl ? 'auto' : 'none', opacity: contact?.linkedinUrl ? 1 : 0.5}}>
              LinkedIn <span className="contact-btn-arrow">↗</span>
            </a>
            <a href={formatUrl(contact?.githubUrl)} target="_blank" rel="noreferrer" className="contact-btn" style={{pointerEvents: contact?.githubUrl ? 'auto' : 'none', opacity: contact?.githubUrl ? 1 : 0.5}}>
              GitHub <span className="contact-btn-arrow">↗</span>
            </a>
            <a href={formatUrl(contact?.youtubeUrl)} target="_blank" rel="noreferrer" className="contact-btn" style={{pointerEvents: contact?.youtubeUrl ? 'auto' : 'none', opacity: contact?.youtubeUrl ? 1 : 0.5}}>
              YouTube <span className="contact-btn-arrow">↗</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
