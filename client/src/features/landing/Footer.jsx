import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Docs', 'Help', 'Community', 'API'],
};

export function Footer() {
  return (
    <footer className="py-10 sm:py-16 bg-black border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 mb-4 lg:mb-0">
            <Link to="/" className="text-yellow-500 font-black text-xl sm:text-2xl flex items-center gap-2 mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 32 32" fill="currentColor">
                <path d="M4 8a4 4 0 014-4h16a4 4 0 010 8H8a4 4 0 01-4-4zM4 16a4 4 0 014-4h8a4 4 0 010 8H8a4 4 0 01-4-4zM4 24a4 4 0 014-4h12a4 4 0 010 8H8a4 4 0 01-4-4z"/>
              </svg>
              TEAMFLOW
            </Link>
            <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 max-w-xs">
              The all-in-one collaboration platform for modern teams.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {['twitter', 'github', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-gray-500 hover:text-yellow-500 transition-colors"
                  aria-label={social}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" fill="currentColor" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold text-sm sm:text-base mb-3 sm:mb-4">{category}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button type="button" className="text-gray-500 hover:text-yellow-500 transition-colors text-xs sm:text-sm text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-gray-500 text-xs sm:text-sm order-2 sm:order-1">
            © 2026 TEAMFLOW. All rights reserved.
          </p>
          <div className="flex items-center gap-4 sm:gap-6 order-1 sm:order-2">
            <button type="button" className="text-gray-500 hover:text-yellow-500 transition-colors text-xs sm:text-sm">Privacy</button>
            <button type="button" className="text-gray-500 hover:text-yellow-500 transition-colors text-xs sm:text-sm">Terms</button>
            <button type="button" className="text-gray-500 hover:text-yellow-500 transition-colors text-xs sm:text-sm">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
}