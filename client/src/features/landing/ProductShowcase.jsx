import React from 'react';
import { Link } from 'react-router-dom';

const showcases = [
  {
    title: 'Real-Time Chat',
    description: 'Communicate seamlessly with your team through channels and direct messages. See who\'s online, typing, and get instant notifications.',
    image: (
      <div className="bg-surface rounded-xl p-4">
        <div className="space-y-3">
          {[
            { user: 'Sarah', msg: 'Hey team! Check this out', time: '2m' },
            { user: 'Marcus', msg: 'Looks amazing!', time: '1m' },
            { user: 'You', msg: 'Working on the new design', time: 'now' }
          ].map((msg, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-acid-yellow/20 flex items-center justify-center text-acid-yellow text-xs font-bold">
                {msg.user[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">{msg.user}</span>
                  <span className="text-gray-600 text-xs">{msg.time}</span>
                </div>
                <p className="text-gray-400 text-sm">{msg.msg}</p>
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
          <div key={status} className="bg-surface rounded-lg p-3">
            <div className="text-xs font-bold text-gray-500 uppercase mb-2">{status}</div>
            <div className={`h-16 rounded ${i === 0 ? 'bg-surface-light' : i === 1 ? 'bg-acid-yellow/10' : 'bg-green-500/10'}`} />
          </div>
        ))}
      </div>
    )
  },
  {
    title: 'Document Collaboration',
    description: 'Create, edit, and share documents in real-time. Work together with your team and track changes as they happen.',
    image: (
      <div className="bg-surface rounded-xl p-4 space-y-2">
        <div className="h-3 w-1/3 bg-gray-600 rounded" />
        <div className="h-2 w-full bg-gray-700 rounded" />
        <div className="h-2 w-2/3 bg-gray-700 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="w-6 h-6 rounded-full bg-blue-500" />
          <div className="w-6 h-6 rounded-full bg-green-500 -ml-2" />
          <div className="w-6 h-6 rounded-full bg-acid-yellow -ml-2" />
        </div>
      </div>
    )
  }
];

export function ProductShowcase() {
  return (
    <section id="showcase" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-acid-yellow font-bold uppercase tracking-widest text-sm">Product</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            SEE IT IN ACTION
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Experience the power of TEAMFLOW with our intuitive interface.
          </p>
        </div>
        
        <div className="space-y-24">
          {showcases.map((item, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}>
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 text-lg mb-6">{item.description}</p>
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 text-acid-yellow font-bold hover:gap-4 transition-all"
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="bg-bg-black border border-surface-light rounded-2xl p-6 shadow-2xl hover:scale-[1.02] transition-transform">
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