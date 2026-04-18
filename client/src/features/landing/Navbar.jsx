import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-bg-black/95 backdrop-blur-lg border-b border-surface-light' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="text-acid-yellow font-black text-lg sm:text-2xl tracking-tighter flex items-center gap-1 sm:gap-2">
            <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="currentColor">
              <path d="M4 8a4 4 0 014-4h16a4 4 0 010 8H8a4 4 0 01-4-4zM4 16a4 4 0 014-4h8a4 4 0 010 8H8a4 4 0 01-4-4zM4 24a4 4 0 014-4h12a4 4 0 010 8H8a4 4 0 01-4-4z"/>
            </svg>
            <span className="hidden xs:inline">TEAMFLOW</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-acid-yellow transition-colors font-medium">Features</a>
            <a href="#showcase" className="text-gray-300 hover:text-acid-yellow transition-colors font-medium">How it Works</a>
            <a href="#testimonials" className="text-gray-300 hover:text-acid-yellow transition-colors font-medium">Testimonials</a>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/auth/login"
              className="text-gray-300 font-bold uppercase text-xs sm:text-sm tracking-wider hover:text-acid-yellow transition-colors hidden sm:block"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="bg-acid-yellow text-bg-black font-bold uppercase text-xs sm:text-sm tracking-wider py-2 sm:py-2.5 px-3 sm:px-5 hover:bg-white transition-all duration-200 shadow-lg shadow-acid-yellow/20"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}