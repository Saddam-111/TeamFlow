import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#showcase', label: 'How it Works' },
    { href: '#testimonials', label: 'Testimonials' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-obsidian/80 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-lime-accent flex items-center justify-center">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" viewBox="0 0 32 32" fill="currentColor">
                <path d="M4 8a4 4 0 014-4h16a4 4 0 010 8H8a4 4 0 01-4-4zM4 16a4 4 0 014-4h8a4 4 0 010 8H8a4 4 0 01-4-4zM4 24a4 4 0 014-4h12a4 4 0 010 8H8a4 4 0 01-4-4z"/>
              </svg>
            </div>
            <span className="font-bold text-xl sm:text-2xl tracking-tighter text-white font-sans group-hover:text-lime-accent transition-colors">
              TEAMFLOW
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="font-medium text-sm uppercase tracking-wider text-white/60 hover:text-lime-accent transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/auth/login"
              className="text-white/60 hover:text-white font-bold uppercase text-xs sm:text-sm tracking-wider transition-all duration-200 hidden sm:block"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="relative overflow-hidden bg-lime-accent text-black font-bold uppercase text-xs sm:text-sm tracking-wider py-2.5 sm:py-3 px-4 sm:px-6 hover:shadow-glow transition-all duration-300"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Link>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/60 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-white/[0.06]">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-white/80 hover:text-lime-accent font-medium uppercase tracking-wider text-sm py-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-white/80 hover:text-lime-accent font-medium uppercase tracking-wider text-sm py-2"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}