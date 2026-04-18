import React from 'react';

const steps = [
  {
    number: '01',
    title: 'Create Workspace',
    description: 'Sign up and create your team workspace in seconds. Choose a name and customize your branding.'
  },
  {
    number: '02',
    title: 'Invite Team',
    description: 'Invite team members via email or share a direct link. Set permissions and roles for each member.'
  },
  {
    number: '03',
    title: 'Start Collaborating',
    description: 'Begin real-time collaboration with chat, tasks, and documents. Experience seamless workflow.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-acid-yellow font-bold uppercase tracking-widest text-sm">How it Works</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-4 mb-6">
            GET STARTED IN MINUTES
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps to transform your team's collaboration.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-surface-light -translate-y-1/2 -z-10" />
          
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-surface border border-surface-light rounded-2xl p-8 text-center group hover:-translate-y-2 transition-transform"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-acid-yellow rounded-full flex items-center justify-center text-bg-black font-black text-xl">
                {step.number}
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}