import React, { useState, useEffect, useRef } from 'react';
import profileImage from '../assets/profile.png';
import { get } from '../api/apiClient';

function useGlitchEffect(initialText) {
  const [text, setText] = useState(initialText);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  
  const trigger = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setText(initialText.split('').map((char, index) => {
        if (index < iteration || char === ' ') return initialText[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iteration >= initialText.length) {
        clearInterval(interval);
      }
      iteration += 1/3;
    }, 30);
  };

  return { text, trigger };
}

export default function Home() {
  const canvasRef = useRef(null);
  const glowRef = useRef(null);
  const imageFrameRef = useRef(null);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const word1 = useGlitchEffect("BUILD");
  const word2 = useGlitchEffect("THINGS.");
  const word3 = useGlitchEffect("BREAK");
  const word4 = useGlitchEffect("LIMITS.");

  // Dynamic Data
  const [projectCount, setProjectCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);
  const [stats, setStats] = useState({ semesters: 4 });
  const [about, setAbout] = useState(null);

  useEffect(() => {
    get('/projects').then(d => setProjectCount((d||[]).length));
    get('/skills').then(d => setSkillCount((d||[]).length));
    get('/stats').then(d => setStats(d || { semesters: 4 }));
    get('/about').then(d => setAbout(d?.[0]));
  }, []);

  const fullText = about?.tagline || "CS ENGINEERING STUDENT · JAVA · CLOUD · SPRING BOOT";

  // Matrix Canvas
  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let reqId;
    const initCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    initCanvas();
    window.addEventListener('resize', initCanvas);

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array(columns).fill(1);
    const speeds = Array(columns).fill(0).map(() => 0.5 + Math.random() * 1.5);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const y = drops[i] * fontSize;
        
        ctx.fillStyle = Math.random() > 0.95 ? '#FFFFFF' : '#00FF41';
        ctx.fillText(text, i * fontSize, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.5 + Math.random() * 1.5;
        }
        drops[i] += speeds[i];
      }
      reqId = requestAnimationFrame(draw);
    };
    
    reqId = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', initCanvas);
      cancelAnimationFrame(reqId);
    };
  }, [prefersReduced]);

  // Initial Glitch + Random repeating glitch
  useEffect(() => {
    const triggerAll = () => {
      setTimeout(() => word1.trigger(), 0);
      setTimeout(() => word2.trigger(), 200);
      setTimeout(() => word3.trigger(), 400);
      setTimeout(() => word4.trigger(), 600);
    };
    triggerAll();

    const randomGlitchInt = setInterval(() => {
      const r = Math.floor(Math.random() * 4);
      if (r === 0) word1.trigger();
      if (r === 1) word2.trigger();
      if (r === 2) word3.trigger();
      if (r === 3) word4.trigger();
    }, 8000);
    return () => clearInterval(randomGlitchInt);
  }, []);

  // Parallax + Glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (prefersReduced) return;
      
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
      }
      
      if (imageFrameRef.current) {
        const x = (window.innerWidth / 2 - e.clientX) / 30;
        const y = (window.innerHeight / 2 - e.clientY) / 30;
        imageFrameRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="home-page" style={{ position: 'relative' }}>
      <canvas 
        ref={canvasRef} 
        className="matrix-canvas" 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', opacity: 0.18 }} 
      />
      <div className="scanline" style={{ zIndex: 1 }} />
      <div className="ambient-glow" ref={glowRef} style={{ transition: 'top 0.5s ease-out, left 0.5s ease-out', zIndex: 1 }} />

      <section className="hero-grid" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-left">
          <div style={{ fontSize: '14px', color: 'var(--accent)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>[ 01 ]</div>
          <h1 className="hero-title">
            <span className="glitch-word">{word1.text}</span>
            <span className="glitch-word">{word2.text}</span>
            <br />
            <span className="glitch-word">{word3.text}</span>
            <span className="glitch-word">{word4.text}</span>
          </h1>
          <div style={{ fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-cream)' }}>
            {fullText}<span className="cursor-blink">_</span>
          </div>

          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-label">Projects</div>
              <div className="stat-val">{projectCount.toString().padStart(2,'0')}+</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Technologies</div>
              <div className="stat-val">{skillCount.toString().padStart(2,'0')}+</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Semesters</div>
              <div className="stat-val">{String(stats.semesters).padStart(2,'0')}</div>
            </div>
            <div className="stat-item" style={{ border: 'none' }}>
              <div className="stat-label">Coffee</div>
              <div className="stat-val">∞</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-image-frame" ref={imageFrameRef} style={{ transition: 'transform 0.1s linear' }}>
            <div className="frame-corners" />
            <img src={profileImage} alt="Rahul" className="hero-profile-img" style={{ filter: 'grayscale(100%) contrast(120%)' }} />
            <div className="img-scanline" />
          </div>
        </div>
      </section>
      
      {!scrolled && (
        <div className="scroll-indicator" style={{ zIndex: 2 }}>[ SCROLL TO EXPLORE ↓ ]</div>
      )}
    </div>
  );
}
