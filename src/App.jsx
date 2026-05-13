import React, { useEffect, useState } from 'react';
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

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const tokenRaw = localStorage.getItem('token');
  const token = tokenRaw && tokenRaw !== 'undefined' && tokenRaw !== 'null' ? tokenRaw : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav>
      <Link to="/" className="nav-brand">RAHUL</Link>
      <div className="nav-links">
        <Link to="/work" className={location.pathname.startsWith('/work') ? 'active' : ''}>Work</Link>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        {!token && <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>}
        {token && <Link to="/dashboard" className={`nav-dashboard ${location.pathname === '/dashboard' ? 'active' : ''}`}>DASHBOARD</Link>}
        {token && <button onClick={handleLogout}>LOGOUT</button>}
      </div>
    </nav>
  );
}

function App() {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('.project-row') ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('clickable') ||
        target.closest('.drop-zone')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <ToastProvider>
    <div id="cursor" className={isHovering ? 'hover-active' : ''} style={{ left: `${cursorPos.x}px`, top: `${cursorPos.y}px` }} />
    <Router>
      <Navigation />
      <main>
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
      </main>
      <footer>
        <span>RAHUL © 2026</span>
        <span>KL University · Vijayawada</span>
      </footer>
    </Router>
    </ToastProvider>
  );
}

export default App;
