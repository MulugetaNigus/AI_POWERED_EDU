import React, { useState } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    question: 'What is ExtreamX?',
    answer: 'ExtreamX is an online learning platform that provides personalized AI-powered tutoring for Ethiopian students.'
  },
  {
    question: 'How does the AI tutoring work?',
    answer: 'Our AI tutor adapts to your learning style and pace, providing personalized learning paths and resources.'
  },
  {
    question: 'What subjects are available?',
    answer: 'We offer a wide range of subjects including Mathematics, Chemistry, Physics, Biology, and English.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a free trial period for new users to explore our platform and features.'
  },
  {
    question: 'What subjects are available?',
    answer: 'We offer a wide range of subjects including Mathematics, Chemistry, Physics, Biology, and English.'
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a free trial period for new users to explore our platform and features.'
  },
];

export default function FAQ() {
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Your questions answered</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <motion.div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleFAQ(index)}
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                <span className="text-gray-600 dark:text-gray-300">{openIndex === index ? '-' : '+'}</span>
              </motion.div>
              {openIndex === index && (
                <motion.div
                  className="p-4 border-t border-gray-200 dark:border-gray-600"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
