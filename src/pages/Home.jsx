import React, { useState, useEffect } from 'react';
import profileImage from '../assets/profile.png';

export default function Home() {
  const fullText = "CS ENGINEERING STUDENT · JAVA · CLOUD · SPRING BOOT";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.substring(0, i + 1));
        i++;
        if (i === fullText.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  const renderSkills = (text) => {
    return text.split('').map((char, index) => {
      if (char === '·') return <span key={index} className="dot">{char}</span>;
      return char;
    });
  };

  return (
    <div className="page-wrap crt-flicker">
      <div className="crt-overlay"></div>
      <div className="noise-overlay"></div>
      <section className="hero">
        <div className="hero-left">
          <span className="hero-index type-effect">[ 01 ]</span>
          
          <h1 className="hero-heading">
            <span className="reveal-line">
              <span className="reveal-word" style={{ animationDelay: '0.15s' }}>BUILD</span>{' '}
              <span className="reveal-word" style={{ animationDelay: '0.30s' }}>THINGS.</span>
            </span>
            <br />
            <span className="reveal-line">
              <span className="reveal-word" style={{ animationDelay: '0.45s' }}>BREAK</span>{' '}
              <span className="reveal-word" style={{ animationDelay: '0.60s' }}>LIMITS.</span>
            </span>
          </h1>

          <div className="hero-sub fade-slide-up-delayed">
            {renderSkills(typedText)}
            <span className="cursor-blink">_</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-container">
            <div className="hero-glow"></div>
            <img src={profileImage} alt="Rahul" className="hero-profile-img" />
          </div>
        </div>
      </section>
    </div>
  );
}
