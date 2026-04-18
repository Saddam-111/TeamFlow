import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 sm:pt-20 overflow-hidden">
      {/* Background - subtle */}
      <div className="absolute inset-0 bg-bg-black z-0" />
      <div className="absolute top-0 left-0 w-full h-full opacity-30" 
        style={{ background: 'radial-gradient(ellipse at top left, #DFE104 0%, transparent 50%)' }} 
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Beta Badge */}
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1.5 mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-yellow-500 font-semibold text-xs sm:text-sm uppercase tracking-widest">
                Now in Beta
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-7xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              <span className="text-white block">COLLABORATE</span>
              <span className="text-acid-yellow block">WITHOUT LIMITS</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8">
              The all-in-one platform for modern teams. Chat, tasks, documents — unified in one powerful workspace.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                to="/auth/register"
                className="bg-acid-yellow text-black font-bold uppercase tracking-wider py-3 px-6 sm:py-4 sm:px-8 hover:bg-white transition text-sm sm:text-base"
              >
                Get Started Free
              </Link>
              <Link
                to="/auth/login"
                className="border-2 border-zinc-700 text-white font-bold uppercase tracking-wider py-3 px-6 sm:py-4 sm:px-8 hover:border-yellow-500 hover:text-yellow-500 transition text-sm sm:text-base"
              >
                Watch Demo
              </Link>
            </div>
            
            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 justify-center lg:justify-start mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-800">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-yellow-400">10K+</div>
                <div className="text-gray-500 text-xs sm:text-sm">Active Teams</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-yellow-400">50K+</div>
                <div className="text-gray-500 text-xs sm:text-sm">Messages Daily</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-yellow-400">99.9%</div>
                <div className="text-gray-500 text-xs sm:text-sm">Uptime</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Dashboard Preview - hidden on mobile */}
          <div className="relative hidden lg:block order-1 lg:order-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="ml-4 flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded">
                  <span className="text-yellow-500 text-xs">teamflow</span>
                </div>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-zinc-950 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-500">
                    <span className="font-bold text-sm">TEAMFLOW</span>
                  </div>
                  <div className="space-y-1">
                    {['#general', '#design', '#dev'].map((channel, i) => (
                      <div key={i} className={`text-xs px-2 py-1.5 rounded ${i === 0 ? 'bg-zinc-800 text-white' : 'text-gray-500'}`}>
                        {channel}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 space-y-3">
                  <div className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20" />
                      <div className="flex-1">
                        <div className="h-2 w-16 bg-zinc-700 rounded mb-1" />
                        <div className="h-2 w-10 bg-zinc-700 rounded" />
                      </div>
                    </div>
                    <div className="h-2 w-full bg-zinc-700 rounded mb-1" />
                    <div className="h-2 w-2/3 bg-zinc-700 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="w-5 h-8 border-2 border-zinc-700 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}