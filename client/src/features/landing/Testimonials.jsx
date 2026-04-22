import React from 'react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Lead at TechCorp',
    avatar: 'SC',
    content: 'TEAMFLOW transformed how our remote team collaborates. The real-time features are incredible.',
    rating: 5
  },
  {
    name: 'Marcus Johnson',
    role: 'CEO at StartupX',
    avatar: 'MJ',
    content: 'Best collaboration tool we have used. The task board alone increased our productivity by 40%.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Design Director at Agency',
    avatar: 'ER',
    content: 'The document collaboration is seamless. Our design team can now work together in real-time.',
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-obsidian/30 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <span className="inline-block text-lime-accent font-mono text-xs uppercase tracking-widest mb-4">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mt-2 mb-4 sm:mb-6">
            LOVED BY TEAMS
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            See what our customers have to say about TEAMFLOW.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-5 sm:p-6 hover:border-lime-accent/30 transition-all duration-500"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-lime-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/70 mb-5 italic leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-lime-accent/20 flex items-center justify-center text-lime-accent font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-bold text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-white/30 text-xs sm:text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}