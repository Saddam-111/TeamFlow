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
    <section className="py-12 border-y border-surface-light bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm font-semibold uppercase tracking-widest mb-8">
          Trusted by teams worldwide
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {trustedBy.map((company, index) => (
            <div
              key={index}
              className="text-gray-500 text-xl font-bold cursor-pointer transition-colors hover:text-acid-yellow"
            >
              {company.initial}
              <span className="text-gray-600">{company.name.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}