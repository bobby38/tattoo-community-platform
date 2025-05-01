import React from 'react';
import HeroSection from '@/components/sections/hero-section';
import FeaturedStyles from '@/components/sections/featured-styles';
import FeaturedTribes from '@/components/sections/featured-tribes';
import SocialFeed from '@/components/sections/social-feed';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <SocialFeed />
      <FeaturedStyles />
      <FeaturedTribes />
    </div>
  );
}
