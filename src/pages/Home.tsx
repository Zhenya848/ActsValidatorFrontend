import React from 'react';
import HeroSection from '../widgets/components/landing/HeroSection';
import FeaturesSection from '../widgets/components/landing/FeaturesSection';
import StatsSection from '../widgets/components/landing/StatsSection';

export default function Home() {
  return (
    <div className='min-h-screen bg-white'>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
    </div>
  );
}