import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { TrustedBy } from './TrustedBy';
import { Features } from './Features';
import { ProductShowcase } from './ProductShowcase';
import { HowItWorks } from './HowItWorks';
import { Testimonials } from './Testimonials';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-black">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <ProductShowcase />
      <HowItWorks />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}