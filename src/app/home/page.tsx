import React from 'react';
import Hero from '@/components/Hero';
import Productivity from '@/components/Productivity';
import Reliability from '@/components/Reliability';
import Security from '@/components/Security';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#3A367F]">
      <main>
        <Hero />
        <Productivity />
        <Reliability />
        <Security />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

