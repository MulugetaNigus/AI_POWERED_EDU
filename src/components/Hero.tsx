import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Modal from './Modal';
import img from '../Assets/Heronew.png';

export default function Hero() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="container mx-auto px-4 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <motion.div
            className="flex-1 text-center md:text-left"
            variants={itemVariants}
          >
            <h1 className="font-['Poppins'] text-5xl md:text-5xl lg:text-6xl font-normal text-gray-900 dark:text-white leading-tight">
              <p className="mb-4">
                <span className="text-yellow-500 font-bold">Ace</span> National
                Entrance Exam With <br />
                <span className="text-yellow-500 font-bold">Confidence!</span>
              </p>
              <TypeAnimation
                sequence={[
                  'Excel in Your Studies',
                  2000,
                  'Know Unknowns With AI',
                  2000,
                  'Ace Your Exams',
                  2000,
                  'Learn Faster, Learn Smarter',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-blue-600 dark:text-blue-400 text-4xl"
              />
            </h1>

            <p className="text-xl font-normal text-gray-600 dark:text-gray-300 mt-6 max-w-2xl">
              Are you a student in Ethiopia looking for a better way to prepare for your national entrance exam? With{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">ExtreamX</span>, crush your national exam 
              confidently using personalized study materials, organized exam resources, and interactive learning tools.
            </p>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="group px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 
                  transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center font-semibold">
                  Get Started Free
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </span>
              </motion.button>

              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl
                  hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 
                  transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            className="flex-1 relative"
            variants={itemVariants}
          >
            <motion.div
              className="relative z-10"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img
                src={img}
                alt="Students learning"
                className="w-full max-w-2xl mx-auto drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl="https://www.youtube.com/embed/YX_r5fptTZw?si=tfT4n9ol9oN49BH7"
      />
    </div>
  );
}
