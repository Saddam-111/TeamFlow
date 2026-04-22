import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 sm:pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-bg-black" />
      
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-lime-accent/10 rounded-full blur-[150px] glow-sphere animate-float" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-emerald-glow/10 rounded-full blur-[120px] glow-sphere animate-float" style={{animationDelay: '2s'}} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 sm:mb-8">
              <span className="w-2 h-2 bg-lime-accent rounded-full animate-pulse" />
              <span className="text-white/80 font-mono text-xs uppercase tracking-widest">
                Now in Beta
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white mb-4 sm:mb-6 leading-[0.95]">
              <span className="block">COLLABORATE</span>
              <span className="text-lime-accent">WITHOUT LIMITS</span>
            </h1>
            
            <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
              The all-in-one platform for modern teams. Chat, tasks, documents — unified in one powerful workspace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                to="/auth/register"
                className="group relative overflow-hidden bg-lime-accent text-black font-bold uppercase tracking-wider py-4 px-8 sm:px-10 hover:shadow-glow transition-all duration-300"
              >
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              </Link>
              <Link
                to="/auth/login"
                className="glass text-white font-bold uppercase tracking-wider py-4 px-8 sm:px-10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200"
              >
                Watch Demo
              </Link>
            </div>
            
            <div className="flex gap-6 sm:gap-10 justify-center lg:justify-start mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/[0.06]">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold tracking-tighter text-lime-accent">10K+</div>
                <div className="text-white/40 font-mono text-xs uppercase tracking-wider mt-1">Active Teams</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold tracking-tighter text-lime-accent">50K+</div>
                <div className="text-white/40 font-mono text-xs uppercase tracking-wider mt-1">Messages Daily</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold tracking-tighter text-lime-accent">99.9%</div>
                <div className="text-white/40 font-mono text-xs uppercase tracking-wider mt-1">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className="relative hidden lg:block order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-lime-accent/5 blur-3xl rounded-full transform scale-90" />
              
              <div className="glass rounded-xl overflow-hidden relative z-10">
                <div className="bg-obsidian-light/60 border-b border-white/[0.06] px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="ml-4 flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded">
                    <span className="text-lime-accent font-mono text-xs">teamflow</span>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div className="col-span-1 bg-obsidian/50 border border-white/[0.06] rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-lime-accent">TEAMFLOW</span>
                    </div>
                    <div className="space-y-1">
                      {[
                        { name: '#general', active: true },
                        { name: '#design', active: false },
                        { name: '#dev', active: false }
                      ].map((channel, i) => (
                        <div 
                          key={i} 
                          className={`text-xs px-2 py-1.5 rounded transition-colors font-mono ${
                            channel.active 
                              ? 'bg-lime-accent/10 text-lime-accent border-l border-lime-accent/30' 
                              : 'text-white/40 hover:text-white/60'
                          }`}
                        >
                          {channel.name}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 space-y-3">
                    <div className="bg-obsidian/50 border border-white/[0.06] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-lime-accent/20 flex items-center justify-center">
                          <span className="text-lime-accent text-xs font-bold">S</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-20 bg-white/10 rounded" />
                          <div className="h-2 w-12 bg-white/10 rounded mt-1" />
                        </div>
                      </div>
                      <div className="h-2 w-full bg-white/[0.06] rounded mb-1" />
                      <div className="h-2 w-2/3 bg-white/[0.06] rounded" />
                    </div>
                    <div className="bg-lime-accent/5 border border-lime-accent/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-lime-accent flex items-center justify-center">
                          <span className="text-black text-xs font-bold">Y</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 w-16 bg-lime-accent/30 rounded" />
                        </div>
                      </div>
                      <div className="h-2 w-full bg-lime-accent/20 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-lime-accent/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}