import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  // Function to scroll to section only if we're on the homepage
  const scrollToSection = (id) => {
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">🪨 MineralMap</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/map">Explore Map</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        
        {/* Scroll to sections if on homepage */}
        <li><Link to="/" onClick={() => scrollToSection('about')}>About</Link></li>
        <li><Link to="/" onClick={() => scrollToSection('glossary')}>Glossary</Link></li>
        <li><Link to="/" onClick={() => scrollToSection('contact')}>Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
