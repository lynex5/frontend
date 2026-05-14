import React, { useState, useEffect } from 'react';
import { get } from '../api/apiClient';

function useGlitch(text) {
  const [glitchText, setGlitchText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

  const triggerGlitch = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setGlitchText(text.split('').map((char, index) => {
        if (index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iteration >= text.length) {
        clearInterval(interval);
        setGlitchText(text);
      }
      iteration += 1/3;
    }, 30);
  };

  return { glitchText, triggerGlitch };
}

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);

  const titleGlitch = useGlitch("LET'S BUILD");
  const subGlitch = useGlitch("THE FUTURE.");

  useEffect(() => {
    titleGlitch.triggerGlitch();
    setTimeout(() => subGlitch.triggerGlitch(), 400);
  }, []);

  const formatUrl = (url) => {
    if (!url) return "#";
    if (!url.startsWith("http://") && !url.startsWith("https://")) return `https://${url}`;
    return url;
  };

  useEffect(() => {
    get('/contact').then(data => {
      if(data && data.length > 0) setContact(data[0]);
    }).catch(()=>{});
  }, []);

  const handleCopy = () => {
    const contactEmail = contact?.email || "rahul@kluniversity.edu.in";
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSending(true);
    setProgress(0);
    
    try {
      await fetch('https://discord.com/api/webhooks/1504460925313482772/-NeA2XsEWhS4zB-1PtSs7i9AuanWzr9NDHbyTFqKb0iNm6VgxXHWkIJsVnhNUYSVbf9M', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: "🚀 **New Contact Form Submission!**",
          embeds: [{
            color: 3447003,
            fields: [
              { name: "Name", value: name, inline: true },
              { name: "Email", value: email, inline: true },
              { name: "Message", value: message }
            ],
            timestamp: new Date().toISOString()
          }]
        })
      });
    } catch (error) {
      console.error("Failed to send message to Discord", error);
    }

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setSending(false);
          setSent(true);
          setTimeout(() => {
            setSent(false);
            setName('');
            setEmail('');
            setMessage('');
            setProgress(0);
          }, 4000);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const renderProgressBar = () => {
    const totalBlocks = 20;
    const filledBlocks = Math.floor((progress / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    return `[${'█'.repeat(filledBlocks)}${'-'.repeat(emptyBlocks)}] ${progress}%`;
  };

  return (
    <div className="page-wrap contact-page">
      <div className="dot-grid-bg"></div>
      
      <div className="contact-left">
        <div style={{ fontSize: '14px', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '3rem' }}>[ ROOT/CONTACT ]</div>
        
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(60px, 8vw, 100px)', lineHeight: '0.9', marginBottom: '2rem' }}>
          <div onMouseEnter={titleGlitch.triggerGlitch}>{titleGlitch.glitchText}</div>
          <div onMouseEnter={subGlitch.triggerGlitch} style={{ color: 'var(--accent)' }}>{subGlitch.glitchText}</div>
        </h1>
        
        <div style={{ fontSize: '12px', color: 'var(--text-cream)', marginBottom: '3rem', maxWidth: '400px', lineHeight: '1.6' }}>
          Available for internships, freelance opportunities, or just talking about algorithms and system design.
        </div>
        
        <form className="contact-form" onSubmit={handleTerminalSubmit}>
          <div className="term-input-row">
            <span className="term-prompt">visitor@rahul-os:~$ set NAME</span>
            <input 
              type="text" 
              className="term-input" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              disabled={sending || sent}
              required
              placeholder="_"
            />
          </div>
          <div className="term-input-row">
            <span className="term-prompt">visitor@rahul-os:~$ set EMAIL</span>
            <input 
              type="email" 
              className="term-input" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              disabled={sending || sent}
              required
              placeholder="_"
            />
          </div>
          <div className="term-input-row">
            <span className="term-prompt">visitor@rahul-os:~$ set MESSAGE</span>
            <input 
              className="term-input" 
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              disabled={sending || sent}
              required
              placeholder="_"
            />
          </div>
          
          <div style={{ fontSize: '10px', color: '#666', textAlign: 'right' }}>
            {message.length} / 500
          </div>
          
          {sending && (
            <div style={{ color: 'var(--accent)', marginTop: '1rem', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              TRANSMITTING: {renderProgressBar()}
            </div>
          )}
          
          {sent && (
            <div style={{ color: 'var(--accent)', marginTop: '1rem', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              &gt; TRANSMISSION SUCCESSFUL. AWAITING RESPONSE...
            </div>
          )}

          {!sending && !sent && (
            <button type="submit" className="term-submit" style={{ marginTop: '1rem' }}>
              ./send_message.sh
            </button>
          )}
        </form>
      </div>

      <div className="contact-right" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="contact-socials">
          <button 
            className="social-btn"
            onClick={handleCopy}
          >
            {copied ? "COPIED ✓" : "COPY_EMAIL"}
          </button>
          
          <a href={formatUrl(contact?.linkedinUrl)} target="_blank" rel="noreferrer" className="social-btn" style={{pointerEvents: contact?.linkedinUrl ? 'auto' : 'none', opacity: contact?.linkedinUrl ? 1 : 0.5}}>
            LINKEDIN_PROFILE
          </a>
          
          <a href={formatUrl(contact?.githubUrl)} target="_blank" rel="noreferrer" className="social-btn" style={{pointerEvents: contact?.githubUrl ? 'auto' : 'none', opacity: contact?.githubUrl ? 1 : 0.5}}>
            GITHUB_REPOSITORIES
          </a>
          
          <a href={formatUrl(contact?.youtubeUrl)} target="_blank" rel="noreferrer" className="social-btn" style={{pointerEvents: contact?.youtubeUrl ? 'auto' : 'none', opacity: contact?.youtubeUrl ? 1 : 0.5}}>
            YOUTUBE_CHANNEL
          </a>
        </div>
      </div>
    </div>
  );
}
