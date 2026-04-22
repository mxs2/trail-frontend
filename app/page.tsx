import LandingNavbar from '../components/landing/LandingNavbar';
import LandingHero from '../components/landing/LandingHero';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingStats from '../components/landing/LandingStats';
import LandingFooter from '../components/landing/LandingFooter';

export default function HomePage() {
  return (
    <>
      <LandingNavbar />
      <LandingHero />
      <LandingFeatures />
      <LandingStats />
      <LandingFooter />
    </>
  );
}
