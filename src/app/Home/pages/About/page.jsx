// app/about/page.jsx
import * as React from 'react';
import { Container, Box } from '@mui/material';
import HeroSection from '../../components/About/HeroSection';
import StorySection from '../../components/About/StorySection';
import MissionVision from '../../components/About/MissionVision';
import ServicesSection from '../../components/About/ServicesSection';
import WhyChooseUs from '../../components/About/WhyChooseUs';
import ValuesSection from '../../components/About/ValuesSection';
import WhoWeServe from '../../components/About/WhoWeServe';
import StatsSection from '../../components/About/StatsSection';
import TimelineSection from '../../components/About/TimelineSection';
import TestimonialsSection from '../../components/About/TestimonialsSection';
import FAQSection from '../../components/About/FAQSection';
import CTASection from '../../components/About/CTASection';
import Navbar from '../../components/Navbar';

export const metadata = {
  title: 'About Us - Jeevan Dev',
  description: 'Making healthcare simple, accessible & digital for everyone.',
};

export default function AboutPage() {
  return (
    <>
    <Navbar />
    <Box sx={{ bgcolor: '#ffffff', overflowX: 'hidden' }}>
      <HeroSection />
      <StorySection />
      {/* <MissionVision /> */}
      <ServicesSection />
      <WhyChooseUs />
      <ValuesSection />
      <WhoWeServe />
      {/* <TimelineSection /> */}
      
      <CTASection />
    </Box>
    </>
  );
}