import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Calculator, TestTube, Book, Globe, HeartPulse, Atom } from 'lucide-react';

const subjects = [
  { icon: Calculator, name: 'Mathematics', color: 'blue' },
  { icon: TestTube, name: 'Chemistry', color: 'green' },
  { icon: Atom, name: 'Physics', color: 'purple' },
  { icon: HeartPulse, name: 'Biology', color: 'red' },
  { icon: Globe, name: 'Geography', color: 'yellow' },
  { icon: Book, name: 'English', color: 'pink' }
];

export default function Subjects() {
  const controls = useAnimation();

  useEffect(() => {
    const startAnimation = async () => {
      await controls.start({
        x: ['0%', '-100%'],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear"
          }
        }
      });
    };

    startAnimation();
  }, [controls]);

  return (
    <section id="subjects" className="py-20 bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Explore Our Subjects
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Comprehensive coverage of Grade 12 curriculum
          </p>
        </div>

        <div className="relative">
          <motion.div 
            className="flex space-x-6"
            animate={controls}
            style={{ width: "200%" }}
          >
            <div className="flex space-x-6 min-w-full">
              {[...subjects, ...subjects].map((subject, index) => (
                <div
                  key={index}
                  className="flex-none w-64 p-6 bg-white dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <subject.icon className={`h-12 w-12 text-${subject.color}-600 dark:text-${subject.color}-400 mb-4`} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subject.name}</h3>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}