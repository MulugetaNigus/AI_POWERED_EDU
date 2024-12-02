import React from 'react';
import { Brain, BookOpen, BarChart, PlayCircle, ImageIcon } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Learning',
    description: 'Personalized learning paths adapted to your unique needs and pace'
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Content',
    description: 'Complete curriculum aligned with Ethiopian education standards'
  },
  {
    icon: BarChart,
    title: 'Progress Tracking',
    description: 'Real-time insights into your performance and improvement areas'
  },
  {
    icon: ImageIcon,
    title: 'Image Processing',
    description: 'With high-accuracy Image explanations for complex topics'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Why Choose ExtreamX?
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Empowering students with cutting-edge learning tools
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
            >
              <feature.icon className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}