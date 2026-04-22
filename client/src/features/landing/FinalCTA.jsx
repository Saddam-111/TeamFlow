import React from 'react';
import { Link } from 'react-router-dom';

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-lime-accent/5 via-bg-black to-bg-black" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-accent/10 rounded-full blur-[120px] glow-sphere" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-5 sm:mb-6">
            READY TO TRANSFORM
            <br />
            <span className="text-lime-accent">YOUR WORKFLOW?</span>
          </h2>
          <p className="text-white/50 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of teams already using TEAMFLOW to collaborate smarter. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/auth/register"
              className="group relative overflow-hidden bg-lime-accent text-black font-bold uppercase tracking-wider py-4 px-10 hover:shadow-glow transition-all duration-300"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            </Link>
            <Link
              to="/auth/login"
              className="glass text-white font-bold uppercase tracking-wider py-4 px-10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}