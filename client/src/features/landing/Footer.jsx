import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Docs', 'Help', 'Community', 'API'],
};

export function Footer() {
  return (
    <footer className="py-12 sm:py-16 border-t border-white/[0.06] bg-obsidian/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-14">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 mb-4 lg:mb-0">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 group">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-lime-accent flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-black" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M4 8a4 4 0 014-4h16a4 4 0 010 8H8a4 4 0 01-4-4zM4 16a4 4 0 014-4h8a4 4 0 010 8H8a4 4 0 01-4-4zM4 24a4 4 0 014-4h12a4 4 0 010 8H8a4 4 0 01-4-4z"/>
                </svg>
              </div>
              <span className="font-bold text-xl sm:text-2xl tracking-tighter text-white group-hover:text-lime-accent transition-colors">
                TEAMFLOW
              </span>
            </Link>
            <p className="text-white/40 text-sm sm:text-base mb-4 sm:mb-6 max-w-xs leading-relaxed">
              The all-in-one collaboration platform for modern teams.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {['twitter', 'github', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 glass rounded-lg flex items-center justify-center text-white/40 hover:text-lime-accent hover:border-lime-accent/30 transition-all duration-300"
                  aria-label={social}
                >
                  {social === 'twitter' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  )}
                  {social === 'github' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                    </svg>
                  )}
                  {social === 'linkedin' && (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold text-sm sm:text-base mb-3 sm:mb-4">{category}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button type="button" className="text-white/40 hover:text-lime-accent transition-colors text-xs sm:text-sm text-left font-mono uppercase tracking-wider">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-center">
          <p className="text-white/30 text-xs sm:text-sm font-mono uppercase tracking-wider order-2 sm:order-1">
            © 2026 TEAMFLOW. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}