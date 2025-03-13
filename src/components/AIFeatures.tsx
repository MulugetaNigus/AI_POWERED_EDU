import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, Bot, MessageSquare, Image, BarChart3, Lightbulb } from 'lucide-react';

export default function AIFeatures() {
  const features = [
    {
      icon: Brain,
      title: 'Smart Learning Paths',
      description: 'Our AI analyzes your strengths and weaknesses to create personalized learning paths that adapt as you progress.',
      color: 'bg-blue-500/10 dark:bg-blue-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      icon: MessageSquare,
      title: 'AI Tutor Assistance',
      description: 'Get instant help with complex concepts through our AI tutor that explains topics in simple, understandable terms.',
      color: 'bg-purple-500/10 dark:bg-purple-500/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      icon: Image,
      title: 'Visual Problem Solving',
      description: 'Upload images of complex problems and our AI will provide step-by-step solutions and explanations.',
      color: 'bg-green-500/10 dark:bg-green-500/20',
      iconColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Advanced analytics track your progress and identify areas for improvement with actionable insights.',
      color: 'bg-yellow-500/10 dark:bg-yellow-500/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered Learning</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Revolutionize Your Learning with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">AI Technology</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our cutting-edge AI tools are designed to make learning more efficient, personalized, and engaging for Ethiopian students.
          </p>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - AI visualization */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Main image */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl">
                <img 
                  src="https://img.freepik.com/free-vector/artificial-intelligence-concept-illustration_114360-7000.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f" 
                  alt="AI-powered learning visualization" 
                  className="rounded-xl"
                />
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Lightbulb className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
              </motion.div>
              
              {/* Pulse effect */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/20 dark:bg-blue-500/10 animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 dark:bg-purple-500/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
                  <div className="h-64 w-64 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 blur-3xl"></div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right side - Features */}
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`p-6 rounded-xl border ${feature.borderColor} ${feature.color} backdrop-blur-sm hover:shadow-lg transition-all duration-300`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`p-3 rounded-xl ${feature.color} inline-block mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
            
            <motion.div
              className="md:col-span-2 p-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-bold">Ready to experience AI-powered learning?</h3>
              </div>
              <p className="mb-4">Join thousands of students who are already benefiting from our advanced AI tools.</p>
              <motion.button
                className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Try AI Assistant Now
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 