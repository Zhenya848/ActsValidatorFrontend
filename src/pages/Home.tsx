import HeroSection from '../widgets/components/landing/HeroSection';
import FeaturesSection from '../widgets/components/landing/FeaturesSection';
import StatsSection from '../widgets/components/landing/StatsSection';
import { useLocation } from 'react-router-dom';
import WelcomeBanner from '../widgets/components/WelcomeBanner';

export default function Home() {
  const location = useLocation();
  const isBannerShowed: boolean = location.state?.isBannerShowedData ?? false;

  return (
    <div className='min-h-screen bg-white'>
      <WelcomeBanner visible={isBannerShowed} />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
    </div>
  );
}