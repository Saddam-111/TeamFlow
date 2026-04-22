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
    <section className="py-20 sm:py-24 bg-bg-black relative">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime-accent/5 rounded-full blur-[100px] glow-sphere" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <span className="inline-block text-lime-accent font-mono text-xs uppercase tracking-widest mb-4">How it Works</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mt-2 mb-4 sm:mb-6">
            GET STARTED IN MINUTES
          </h2>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Three simple steps to transform your team's collaboration.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8 relative">
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent -translate-y-1/2 -z-10" />
          
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative glass rounded-2xl p-6 sm:p-8 text-center group hover:-translate-y-2 transition-all duration-500 hover:border-lime-accent/20"
            >
              <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-lime-accent rounded-full flex items-center justify-center text-black font-bold text-xl shadow-glow">
                {step.number}
              </div>
              <div className="mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/50 text-sm sm:text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}