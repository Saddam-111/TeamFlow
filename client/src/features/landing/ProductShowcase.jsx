import React from 'react';
import { Link } from 'react-router-dom';

const showcases = [
  {
    title: 'Real-Time Chat',
    description: 'Communicate seamlessly with your team through channels and direct messages. See who\'s online, typing, and get instant notifications.',
    image: (
      <div className="glass rounded-xl p-4">
        <div className="space-y-3">
          {[
            { user: 'Sarah', msg: 'Hey team! Check this out', time: '2m' },
            { user: 'Marcus', msg: 'Looks amazing!', time: '1m' },
            { user: 'You', msg: 'Working on the new design', time: 'now' }
          ].map((msg, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-lime-accent/20 flex items-center justify-center text-lime-accent text-xs font-bold">
                {msg.user[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{msg.user}</span>
                  <span className="text-white/30 text-xs font-mono">{msg.time}</span>
                </div>
                <p className="text-white/50 text-sm">{msg.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    title: 'Task Management',
    description: 'Organize and track your projects with a powerful Kanban board. Drag and drop tasks, assign team members, and set priorities.',
    image: (
      <div className="grid grid-cols-3 gap-2">
        {['To Do', 'In Progress', 'Done'].map((status, i) => (
          <div key={status} className="glass rounded-lg p-3">
            <div className="text-xs font-mono uppercase text-white/40 mb-2">{status}</div>
            <div className={`h-16 rounded ${
              i === 0 ? 'bg-white/[0.06]' : i === 1 ? 'bg-lime-accent/10' : 'bg-emerald-glow/10'
            }`} />
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'Document Collaboration',
    description: 'Create, edit, and share documents in real-time. Work together with your team and track changes as they happen.',
    image: (
      <div className="glass rounded-xl p-4 space-y-2">
        <div className="h-3 w-1/3 bg-white/10 rounded" />
        <div className="h-2 w-full bg-white/[0.06] rounded" />
        <div className="h-2 w-2/3 bg-white/[0.06] rounded" />
        <div className="flex gap-2 pt-2">
          <div className="w-6 h-6 rounded-full bg-blue-500/50" />
          <div className="w-6 h-6 rounded-full bg-emerald-glow/50 -ml-2" />
          <div className="w-6 h-6 rounded-full bg-lime-accent -ml-2" />
        </div>
      </div>
    )
  }
];

export function ProductShowcase() {
  return (
    <section id="showcase" className="py-20 sm:py-24 bg-obsidian/30 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <span className="inline-block text-lime-accent font-mono text-xs uppercase tracking-widest mb-4">Product</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mt-2 mb-4 sm:mb-6">
            SEE IT IN ACTION
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience the power of TEAMFLOW with our intuitive interface.
          </p>
        </div>
        
        <div className="space-y-20 sm:space-y-24">
          {showcases.map((item, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-8 sm:gap-12 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-white/50 text-base sm:text-lg mb-6 leading-relaxed">{item.description}</p>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 text-lime-accent font-bold hover:gap-4 transition-all duration-300"
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="glass rounded-2xl p-5 sm:p-6 hover:border-lime-accent/20 transition-all duration-500">
                  {item.image}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}