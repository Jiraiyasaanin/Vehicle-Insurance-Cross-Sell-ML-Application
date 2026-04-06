import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Predictor from './pages/Predictor';
import './index.css';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <nav className="navbar" style={{ alignItems: 'center' }}>
        <div style={{ flex: 1 }}></div>
        
        <div style={{ display: 'flex', gap: 20 }}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Project Home
          </NavLink>
          <NavLink to="/analyses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Model Analyses
          </NavLink>
          <NavLink to="/predict" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Predictor Setup
          </NavLink>
        </div>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={toggleTheme} 
            style={{ 
              background: 'var(--bg-card)', border: '1px solid var(--border)', cursor: 'pointer', 
              fontSize: '1.5rem', padding: '8px 12px', borderRadius: '12px', color: 'var(--text-main)',
              transition: 'all 0.3s'
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyses" element={<Dashboard />} />
        <Route path="/predict" element={<Predictor />} />
      </Routes>
    </Router>
  );
}

export default App;
