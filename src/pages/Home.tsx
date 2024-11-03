import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Subjects from '../components/Subjects';
import Testimonials from '../components/Testimonials';
import CourseList from '../components/CourseList';
import FAQ from '../components/FAQ';
import MotivationalSection from '../components/MotivationalSection';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Features />
      <Subjects />
      <CourseList />
      <MotivationalSection />
      <FAQ />
      <Testimonials />
      <Footer />
    </main>
  );
}
