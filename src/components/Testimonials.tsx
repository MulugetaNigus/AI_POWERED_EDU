import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, MessageSquare } from 'lucide-react';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Abebe Kebede',
    role: 'Medical School Student',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'ExtreamX transformed my study habits. The AI-powered assistance helped me understand complex medical concepts that I was struggling with. I improved my scores by 28% in just two months!',
    rating: 5,
    university: 'Addis Ababa University'
  },
  {
    id: 2,
    name: 'Tigist Haile',
    role: 'Engineering Student',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: 'The personalized learning paths and practice exams were exactly what I needed. ExtreamX helped me identify my weak areas and focus my studies effectively. I\'m now confident about acing my entrance exam.',
    rating: 5,
    university: 'Bahir Dar University'
  },
  {
    id: 3,
    name: 'Dawit Mengistu',
    role: 'Computer Science Student',
    image: 'https://randomuser.me/api/portraits/men/62.jpg',
    quote: 'The community features are incredible! I connected with other students preparing for the same exam, and we formed a study group. The collaborative environment and AI tools make ExtreamX stand out from other platforms.',
    rating: 5,
    university: 'Jimma University'
  },
  {
    id: 4,
    name: 'Hiwot Tadesse',
    role: 'Law Student',
    image: 'https://randomuser.me/api/portraits/women/28.jpg',
    quote: 'As someone who struggled with traditional study methods, ExtreamX was a game-changer. The interactive content and AI explanations helped me grasp difficult legal concepts. I\'ve recommended it to all my classmates!',
    rating: 4,
    university: 'Mekelle University'
  }
];

// Success metrics
const successMetrics = [
  { label: 'Students Helped', value: '10,000+' },
  { label: 'Avg. Score Improvement', value: '32%' },
  { label: 'Universities Represented', value: '25+' },
  { label: 'Success Rate', value: '94%' }
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);

  // Pause autoplay when hovering
  const handleMouseEnter = () => setAutoplay(false);
  const handleMouseLeave = () => setAutoplay(true);

  // Navigation functions
  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800">
            <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Student Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">Students</span> Say
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Hear from students who have transformed their learning experience and achieved their academic goals with ExtreamX.
          </p>
        </div>
        
        {/* Testimonial carousel */}
        <div 
          className="max-w-5xl mx-auto mb-20 relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-10 relative overflow-hidden">
            {/* Quote decoration */}
            <div className="absolute top-0 right-0 text-blue-100 dark:text-blue-900 opacity-20">
              <Quote className="w-24 h-24" />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row items-center gap-8"
              >
                {/* Student image */}
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-20"></div>
                    <img 
                      src={testimonials[current].image} 
                      alt={testimonials[current].name}
                      className="w-32 h-32 object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-lg relative z-10"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{testimonials[current].name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{testimonials[current].role}</p>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">{testimonials[current].university}</p>
                    <div className="flex items-center justify-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < testimonials[current].rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Testimonial content */}
                <div className="md:w-2/3">
                  <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 italic leading-relaxed">
                    "{testimonials[current].quote}"
                  </blockquote>
                </div>
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:px-0">
              <button 
                onClick={prev}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              <button 
                onClick={next}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                    index === current 
                      ? 'bg-blue-600 dark:bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Success metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {successMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                {metric.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}