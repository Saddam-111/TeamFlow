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
    <section id="testimonials" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-acid-yellow font-bold uppercase tracking-widest text-sm">Testimonials</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            LOVED BY TEAMS
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See what our customers have to say about TEAMFLOW.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-bg-black border border-surface-light rounded-2xl p-6 hover:border-acid-yellow/50 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-acid-yellow/20 flex items-center justify-center text-acid-yellow font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-bold">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}