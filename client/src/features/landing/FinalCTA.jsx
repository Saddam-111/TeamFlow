import React from 'react';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-acid-yellow/10 via-bg-black to-bg-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-acid-yellow/20 rounded-full blur-[150px]" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            READY TO TRANSFORM
            <br />
            <span className="text-acid-yellow">YOUR WORKFLOW?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of teams already using TEAMFLOW to collaborate smarter. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth/register"
              className="group bg-acid-yellow text-bg-black font-bold uppercase tracking-wider py-4 px-10 hover:bg-white hover:scale-105 transition-all duration-200 shadow-xl shadow-acid-yellow/30 relative overflow-hidden"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Link>
            <Link
              to="/auth/login"
              className="border-2 border-surface-light text-white font-bold uppercase tracking-wider py-4 px-10 hover:border-acid-yellow hover:text-acid-yellow transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}