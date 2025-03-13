import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  const benefits = [
    'Personalized AI learning assistant',
    'Access to comprehensive study materials',
    'Practice tests and exam simulations',
    'Progress tracking and analytics',
    'Community support and study groups',
    'Mobile access for learning on the go'
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-3xl overflow-hidden shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative p-8 md:p-16">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left content */}
              <div className="lg:w-1/2 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-white/20 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 text-yellow-300 mr-2" />
                    <span className="text-sm font-medium text-white">Limited Time Offer</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Start Your Journey to Academic Excellence Today
                  </h2>
                  
                  <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0">
                    Join thousands of Ethiopian students who have transformed their learning experience and achieved their academic goals with ExtreamX.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 text-left">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-300 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-white">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <motion.button
                      onClick={() => navigate('/signup')}
                      className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.button>
                    
                    <motion.button
                      onClick={() => navigate('/pricing')}
                      className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Pricing
                    </motion.button>
                  </div>
                </motion.div>
              </div>
              
              {/* Right content - Image */}
              <motion.div
                className="lg:w-1/2"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl rotate-2 transform hover:rotate-0 transition-transform duration-300">
                    <img 
                      src="https://img.freepik.com/free-vector/students-watching-webinar-computer-studying-online_74855-15522.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f" 
                      alt="Students learning online" 
                      className="rounded-xl"
                    />
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    className="absolute -top-6 -right-6 bg-white rounded-lg p-3 shadow-lg"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-6 -left-6 bg-white rounded-lg px-3 py-1 shadow-lg"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <span className="text-sm font-medium text-blue-600">Join 10,000+ students</span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 