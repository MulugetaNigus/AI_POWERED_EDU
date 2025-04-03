import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
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

  // Handler for Get Started button
  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  // Handler for Watch Demo button
  const handleWatchDemo = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-yellow-100/30 dark:bg-yellow-900/10 rounded-full blur-3xl" />
        
        {/* Animated particles */}
        <motion.div 
          className="absolute top-20 left-1/4 w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded-full"
          animate={{ 
            y: [0, -30, 0],
            opacity: [0.2, 1, 0.2]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 right-1/3 w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.2, 1, 0.2]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div 
          className="absolute bottom-40 right-1/4 w-4 h-4 bg-purple-400 dark:bg-purple-500 rounded-full"
          animate={{ 
            y: [0, -25, 0],
            opacity: [0.2, 1, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
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
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="font-['Poppins'] text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Ace</span> National
              Entrance Exam With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400">Confidence!</span>
            </h1>
            
            <div className="h-16 mt-4">
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
                className="text-blue-600 dark:text-blue-400 text-3xl font-medium"
              />
            </div>

            <p className="text-xl font-normal text-gray-600 dark:text-gray-300 mt-6 max-w-2xl">
              Are you a student in Ethiopia looking for a better way to prepare for your national entrance exam? With{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">ExtreamX</span>, crush your national exam 
              confidently.
            </p>

            <div className="mt-6 mb-8 flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Personalized Learning</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">AI-Powered Assistance</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Comprehensive Content</span>
              </div>
            </div>

            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              variants={itemVariants}
            >
              <motion.button
                onClick={handleGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl 
                  hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700
                  transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-600/30"
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
                onClick={handleWatchDemo}
                className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl
                  hover:border-blue-600 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 
                  transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-3xl blur-xl transform -rotate-6"></div>
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
                className="w-full max-w-2xl mx-auto drop-shadow-2xl rounded-2xl"
              />
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-yellow-400/20 dark:bg-yellow-400/10 rounded-full blur-md"></div>
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-blue-400/20 dark:bg-blue-400/10 rounded-full blur-md"></div>
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