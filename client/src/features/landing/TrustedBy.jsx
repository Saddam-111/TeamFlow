import React from 'react';

const trustedBy = [
  { name: 'ACME Corp', initial: 'A' },
  { name: 'TechGlobal', initial: 'T' },
  { name: 'InnovateCo', initial: 'I' },
  { name: 'DataDriven', initial: 'D' },
  { name: 'CloudFirst', initial: 'C' }
];

export function TrustedBy() {
  return (
    <section className="py-10 sm:py-12 border-y border-white/[0.06] bg-obsidian/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-white/30 font-mono text-xs uppercase tracking-widest mb-8">
          Trusted by teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
          {trustedBy.map((company, index) => (
            <div
              key={index}
              className="group cursor-pointer transition-colors duration-300"
            >
              <span className="text-2xl sm:text-3xl font-bold tracking-tighter text-white/30 group-hover:text-lime-accent transition-colors duration-300">
                {company.initial}
                <span className="text-white/20">{company.name.slice(1)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}