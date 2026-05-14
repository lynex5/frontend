import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastProvider } from "./context/ToastContext";
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

function useGlitch(text) {
  const [glitchText, setGlitchText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

  const triggerGlitch = () => {
    let iteration = 0;
    const maxIterations = 8;
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
    }, 40);
  };

  return { glitchText, triggerGlitch };
}

function GlitchLink({ to, children, className, onClick }) {
  const { glitchText, triggerGlitch } = useGlitch(children);
  return (
    <Link to={to} className={className} onMouseEnter={triggerGlitch} onClick={onClick}>
      {glitchText}
    </Link>
  );
}

function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState('');
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      // Line 1
      setLines(["RAHUL.OS v2.0 — INITIALIZING..."]);
      await new Promise(r => setTimeout(r, 600));
      
      // Line 2 (Progress bar)
      setLines(prev => [...prev, "LOADING MODULES: ["]);
      for(let i=1; i<=10; i++) {
        await new Promise(r => setTimeout(r, 40));
        setProgress('█'.repeat(i));
      }
      setLines(prev => {
        const newLines = [...prev];
        newLines[1] = "LOADING MODULES: [██████████] 100%";
        return newLines;
      });
      await new Promise(r => setTimeout(r, 400));
      
      // Line 3
      setLines(prev => [...prev, "ESTABLISHING SECURE CONNECTION..."]);
      await new Promise(r => setTimeout(r, 600));
      
      // Line 4
      setLines(prev => [...prev, "WELCOME, VISITOR_"]);
      
      await new Promise(r => setTimeout(r, 800));
      setFadingOut(true);
      await new Promise(r => setTimeout(r, 500));
      onComplete();
    };
    sequence();
  }, [onComplete]);

  return (
    <div className={`boot-sequence-overlay ${fadingOut ? 'fade-out' : ''}`}>
      {lines.map((line, idx) => {
        if (idx === 1 && line === "LOADING MODULES: [") {
          return <div key={idx} className="boot-line">{line}{progress}</div>;
        }
        return <div key={idx} className="boot-line">{line}</div>;
      })}
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const tokenRaw = localStorage.getItem('token');
  const token = tokenRaw && tokenRaw !== 'undefined' && tokenRaw !== 'null' ? tokenRaw : null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sysTime, setSysTime] = useState('');

  useEffect(() => {
    const int = setInterval(() => {
      const d = new Date();
      setSysTime(d.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(int);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav>
        <GlitchLink to="/" className="nav-brand nav-item">RAHUL</GlitchLink>
        
        <button className="mobile-hamburger" onClick={() => setMobileMenuOpen(true)}>[ ≡ ]</button>
        
        <div className="nav-links">
          <GlitchLink to="/work" className={`nav-item ${location.pathname.startsWith('/work') ? 'active' : ''}`}>Work</GlitchLink>
          <GlitchLink to="/about" className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}>About</GlitchLink>
          <GlitchLink to="/contact" className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</GlitchLink>
          {!token && <GlitchLink to="/login" className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}>Login</GlitchLink>}
          {token && <GlitchLink to="/dashboard" className={`nav-item nav-dashboard ${location.pathname === '/dashboard' ? 'active' : ''}`}>DASHBOARD</GlitchLink>}
          {token && <button className="nav-item sys-logout" onClick={handleLogout}>LOGOUT</button>}
          <div className="nav-clock">SYS_TIME: <span className="sys-time-val">{sysTime}</span></div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-menu-fullscreen">
          <button className="mobile-close" onClick={closeMenu}>[ ✕ ]</button>
          <div className="mobile-menu-links">
            <GlitchLink to="/" onClick={closeMenu}>&gt; HOME</GlitchLink>
            <GlitchLink to="/work" onClick={closeMenu}>&gt; WORK</GlitchLink>
            <GlitchLink to="/about" onClick={closeMenu}>&gt; ABOUT</GlitchLink>
            <GlitchLink to="/contact" onClick={closeMenu}>&gt; CONTACT</GlitchLink>
            {!token && <GlitchLink to="/login" onClick={closeMenu}>&gt; LOGIN</GlitchLink>}
            {token && <GlitchLink to="/dashboard" onClick={closeMenu}>&gt; DASHBOARD</GlitchLink>}
            {token && <button className="sys-logout" onClick={() => { handleLogout(); closeMenu(); }}>&gt; LOGOUT</button>}
          </div>
        </div>
      )}
    </>
  );
}

function PageTransitionWrapper({ children }) {
  const location = useLocation();
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReduced) return children;

  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}

function App() {
  const [booting, setBooting] = useState(() => !sessionStorage.getItem('booted'));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sudoOpen, setSudoOpen] = useState(false);
  const [uptime, setUptime] = useState(0);
  
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const reqRef = useRef();

  const handleBootComplete = () => {
    sessionStorage.setItem('booted', 'true');
    setBooting(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) {
        setScrollProgress((scrollY / docH) * 100);
      }
      setShowBackToTop(scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let typed = '';
    const handleKeyDown = (e) => {
      if (!e || !e.key) return;
      if (e.key === 'Escape') setSudoOpen(false);
      typed += e.key.toUpperCase();
      if (typed.length > 4) typed = typed.slice(-4);
      if (typed === 'SUDO') {
        setSudoOpen(true);
        typed = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const int = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    const handleMouseMove = (e) => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      if (prefersReduced && cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Hover states
      const target = e.target;
      const isHoverable = target.closest('a') || target.closest('button') || target.closest('.project-row') || target.closest('.terminal-card');
      if (cursorRingRef.current) {
        if (isHoverable) {
          cursorRingRef.current.classList.add('hovered');
        } else {
          cursorRingRef.current.classList.remove('hovered');
        }
      }
    };

    const handleMouseDown = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.background = '#FFFFFF';
        setTimeout(() => {
          if (cursorDotRef.current) cursorDotRef.current.style.background = 'var(--accent)';
        }, 100);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    let mouseX = -100;
    let mouseY = -100;
    const trackMouse = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', trackMouse);

    if (!prefersReduced) {
      const animateRing = () => {
        const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
        ringPos.current.x = lerp(ringPos.current.x, mouseX, 0.08);
        ringPos.current.y = lerp(ringPos.current.y, mouseY, 0.08);
        
        if (cursorRingRef.current) {
          cursorRingRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
        }
        reqRef.current = requestAnimationFrame(animateRing);
      };
      reqRef.current = requestAnimationFrame(animateRing);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', trackMouse);
      window.removeEventListener('mousedown', handleMouseDown);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  const formatUptime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}h ${m}m ${s}s`;
  };

  if (booting) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <ToastProvider>
      <div className="scroll-progress-global" style={{ width: `${scrollProgress}%` }}></div>
      
      <div id="cursor-dot" ref={cursorDotRef}></div>
      <div id="cursor-ring" ref={cursorRingRef}></div>

      {sudoOpen && (
        <div className="sudo-modal-overlay">
          <div className="sudo-modal">
            <div>&gt; sudo: permission denied.</div>
            <div>&gt; hint: try asking nicely.</div>
            <button className="dash-btn" onClick={() => setSudoOpen(false)} style={{ marginTop: '1rem' }}>[ DISMISS ]</button>
          </div>
        </div>
      )}

      {showBackToTop && (
        <button className="back-to-top-btn" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          [ ▲ TOP ]
        </button>
      )}

      <Router>
        <Navigation />
        <main>
          <Routes>
            <Route path="/*" element={
              <PageTransitionWrapper>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/work" element={<Work />} />
                  <Route path="/work/:id" element={<ProjectDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransitionWrapper>
            } />
          </Routes>
        </main>
        <footer className="os-footer">
          <div className="footer-left">UPTIME: {formatUptime(uptime)}</div>
          <div className="footer-center"><span className="status-dot"></span>ALL SYSTEMS OPERATIONAL</div>
          <div className="footer-right">
            <span>RAHUL © 2026</span>
            <span className="footer-sep">·</span>
            <span>KL University · Vijayawada</span>
          </div>
        </footer>
      </Router>
    </ToastProvider>
  );
}

export default App;
