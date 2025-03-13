import React, { useState } from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Subjects from '../components/Subjects';
import Testimonials from '../components/Testimonials';
import CourseList from '../components/CourseList';
import FAQ from '../components/FAQ';
import MotivationalSection from '../components/MotivationalSection';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Togather from '../components/Togather';
import AIFeatures from '../components/AIFeatures';
import CTASection from '../components/CTASection';

export default function Home() {
  const creditVisibility: boolean = false;

  return (
    <main className="overflow-hidden">
      <Header creditVisibility={creditVisibility} />
      <Hero />
      <Features />
      <AIFeatures />
      <Subjects />
      <Togather />
      <CourseList />
      <Testimonials />
      <MotivationalSection />
      <CTASection />
      <FAQ />
      <hr className="border-t border-gray-100 dark:border-gray-800 mt-20" />
      <Footer />
    </main>
  );
}
