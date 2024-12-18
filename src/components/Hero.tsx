import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Modal from './Modal';
import img from '../Assets/HeroOne1.png'

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
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            className="flex-1 text-center md:text-left"
            variants={itemVariants}
          >
            <h1 className="font-['Poppins'] text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              <TypeAnimation
                sequence={[
                  'Excel in Your Studies',
                  2000,
                  'Know Unknownes With AI',
                  2000,
                  'Ace Your Exams',
                  2000,
                  'Supported By AI Experts',
                  2000,
                  'Learn Faster, Learn Smarter',
                  2000,
                  'Unlock Your Potential',
                  2000,
                  'Master Any Subject',
                  2000,
                  'Get Personalized Feedback',
                  2000,
                  'Boost Your Grades with AI',
                  2000,
                  'Smart Study Solutions',
                  2000,
                  '24/7 Study Support',
                  2000,
                  'Grasp Complex Concepts',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-blue-600 dark:text-blue-400"
              />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="block mt-10 text-xl md:text-2xl text-gray-600 dark:text-gray-300"
              >
                <span className='text-3xl'>🔥</span> AI-Powered Learning
              </motion.span>
            </h1>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="group px-8 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center">
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
                onClick={() => setIsModalOpen(true)} // Open modal on click
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 relative"
            variants={itemVariants}
          >
            <motion.div
              className="relative z-10"
              animate={{
                y: [0, 0, 0],
                rotate: [0, 0, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {/* <ThreeDAnimation /> */}
              <img
                // src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                src={img}
                alt="Students_learning_png"
                // className="rounded-xl"
                width={600}
                // height={550}
              />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200 dark:bg-blue-900 rounded-full opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-400 dark:bg-purple-900 rounded-full opacity-50"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Modal for video demo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl="https://www.youtube.com/embed/YX_r5fptTZw?si=tfT4n9ol9oN49BH7" // Replace with your video URL
      />
    </div>
  );
}
