import React from 'react';

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Real-Time Chat',
    description: 'Instant messaging with team members through channels and direct messages. See typing indicators and read receipts.'
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16v-3a2 2 0 012-2h2a2 2 0 012 2v3" />
      </svg>
    ),
    title: 'Task Management',
    description: 'Organize, assign, and track tasks with an intuitive Kanban board. Drag-and-drop interface for seamless workflow.'
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Document Collaboration',
    description: 'Create and edit documents together with real-time collaboration. Track changes and collaborate seamlessly.'
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: 'Smart Notifications',
    description: 'Stay informed with intelligent notifications about important updates. Customize your alert preferences.'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-24 bg-bg-black relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <span className="inline-block text-lime-accent font-mono text-xs uppercase tracking-widest mb-4">Features</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mt-2 mb-4 sm:mb-6">
            EVERYTHING YOU NEED
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Powerful features designed to transform how your team collaborates and gets things done.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-hover rounded-2xl p-6 sm:p-8 hover:border-lime-accent/30 hover:shadow-glow-sm transition-all duration-500"
            >
              <div className="w-14 h-14 bg-lime-accent/10 rounded-xl flex items-center justify-center text-lime-accent mb-5 sm:mb-6 group-hover:bg-lime-accent group-hover:text-black transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 uppercase tracking-wider">
                {feature.title}
              </h3>
              <p className="text-white/50 leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}