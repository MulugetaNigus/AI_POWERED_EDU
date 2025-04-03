import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  TestTube,
  Atom,
  Globe,
  Music,
  Palette,
  Code,
  Brain,
  HeartPulse,
  History,
  Languages,
} from 'lucide-react';

const grades = [
  { id: 6, name: 'Grade 6', color: 'blue' },
  { id: 8, name: 'Grade 8', color: 'green' },
  { id: 12, name: 'Grade 12', color: 'purple' },
];

`
const grades = [
  {
    level: 6,
    courses: [
      { name: 'Grade 6 Mathematics', icon: '📐' },
      { name: 'Grade 6 English', icon: '📚' },
      { name: 'Grade 6 Social Studies', icon: '🌍' },
      { name: 'Grade 6 Civics and Ethics', icon: '🔬' },
    ]
  },
  {
    level: 8,
    courses: [
      { name: 'Grade 8 Mathematics', icon: '📊' },
      { name: 'Grade 8 Chemistry', icon: '⚗️' },
      { name: 'Grade 8 Physics', icon: '📖' },
      { name: 'Grade 8 Civics', icon: '🏛️' },
      { name: 'Grade 8 Social Studies', icon: '💻' },
      { name: 'Grade 8 Biology', icon: '🌱' },
      { name: 'Grade 8 English', icon: '📖' }
    ]
  },
  {
    level: 12,
    courses: [
      { name: 'Grade 12 Mathematics', icon: '🔢' },
      { name: 'Grade 12 Chemistry', icon: '🧪' },
      { name: 'Grade 12 Physics', icon: '⚡' },
      { name: 'Grade 12 Biology', icon: '🧬' },
      { name: 'Grade 12 Geography', icon: '🗺️' },
      { name: 'Grade 12 Agriculture', icon: '📝' },
      { name: 'Grade 12 Economics', icon: '📝' },
      { name: 'Grade 12 History', icon: '📝' },
      { name: 'Grade 12 IT', icon: '📝' },
    ]
  }
];
`

const coursesByGrade: Record<number, { icon: any; name: string; desc: string; path: string; }[]> = {
  6: [
    {
      icon: Calculator,
      name: 'Grade 6 Mathematics',
      desc: 'Foundation of numbers and operations',
      path: '/courses/grade-6/mathematics'
    },
    {
      icon: Languages,
      name: 'Grade 6 English',
      desc: 'Essential communication skills',
      path: '/courses/grade-6/english'
    },
    { 
      icon: Globe, 
      name: 'Grade 6 Social Studies', 
      desc: 'Understanding our world',
      path: '/courses/grade-6/social-studies'
    },
    {
      icon: Brain,
      name: 'Grade 6 Civics and Ethics',
      desc: 'Introduction to Civics and Ethics',
      path: '/courses/grade-6/civics'
    },
  ],
  8: [
    {
      icon: Calculator,
      name: 'Grade 8 Mathematics',
      desc: 'Advanced calculations and algebra',
      path: '/courses/grade-8/mathematics'
    },
    { 
      icon: TestTube, 
      name: 'Grade 8 Chemistry', 
      desc: 'Matter and reactions',
      path: '/courses/grade-8/chemistry'
    },
    { 
      icon: Languages, 
      name: 'Grade 8 Physics', 
      desc: 'Laws of nature and mechanics',
      path: '/courses/grade-8/physics'
    },
    { 
      icon: History, 
      name: 'Grade 8 Civics', 
      desc: 'Introduction to Civics and Ethics',
      path: '/courses/grade-8/civics'
    },
    {
      icon: Code,
      name: 'Grade 8 Social Studies',
      desc: 'Life sciences and systems',
      path: '/courses/grade-8/social-studies'
    },
    { 
      icon: Brain, 
      name: 'Grade 8 Biology', 
      desc: 'Earth and human geography',
      path: '/courses/grade-8/biology'
    },
    { 
      icon: Brain, 
      name: 'Grade 8 English', 
      desc: 'Learn about grammers and more in english',
      path: '/courses/grade-8/english'
    },
  ],
  12: [
    {
      icon: Calculator,
      name: 'Advanced Mathematics',
      desc: 'Calculus and statistics',
      path: '/courses/grade-12/mathematics'
    },
    { 
      icon: TestTube, 
      name: 'Chemistry', 
      desc: 'Advanced chemical concepts',
      path: '/courses/grade-12/chemistry'
    },
    { 
      icon: Atom, 
      name: 'Physics', 
      desc: 'Laws of nature and mechanics',
      path: '/courses/grade-12/physics'
    },
    { 
      icon: HeartPulse, 
      name: 'Biology', 
      desc: 'Life sciences and systems',
      path: '/courses/grade-12/biology'
    },
    { 
      icon: Globe, 
      name: 'Geography', 
      desc: 'Earth and human geography',
      path: '/courses/grade-12/geography'
    },
    { 
      icon: Globe, 
      name: 'Grade 12 Agriculture', 
      desc: 'Earth and human geography',
      path: '/courses/grade-12/agriculture'
    },
    { 
      icon: Globe, 
      name: 'Grade 12 Economics', 
      desc: 'Bettur unserstaing',
      path: '/courses/grade-12/economics'
    },
    { 
      icon: Globe, 
      name: 'Grade 12 History', 
      desc: 'Explore our history',
      path: '/courses/grade-12/history'
    },
    {
      icon: Languages,
      name: 'Grade 12 IT',
      desc: 'Academic computer and turbine',
      path: '/courses/grade-12/it'
    },
  ],
};

export default function CourseList() {
  const [selectedGrade, setSelectedGrade] = useState(12);
  const navigate = useNavigate();

  // Handler for navigating to a specific course
  const handleLearnMore = (coursePath: string) => {
    navigate(coursePath);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Explore Courses by Grade
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Comprehensive curriculum tailored for each grade level
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Grade Selection */}
          <div className="md:w-1/4 space-y-4">
            {grades.map((grade) => (
              <motion.button
                key={grade.id}
                onClick={() => setSelectedGrade(grade.id)}
                className={`w-full p-6 rounded-xl text-left transition-all ${selectedGrade === grade.id
                    ? `bg-blue-50 text-gray-700 shadow-lg scale-105`
                    : 'bg-white dark:bg-gray-700 hover:shadow-md'
                  }`}
                whileHover={{ scale: selectedGrade === grade.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-bold">{grade.name}</h3>
                <p
                  className={`mt-2 ${selectedGrade === grade.id
                      ? 'text-gray-700'
                      : 'text-gray-600 dark:text-gray-300'
                    }`}
                >
                  Click to explore courses
                </p>
              </motion.button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="md:w-3/4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGrade}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {coursesByGrade[selectedGrade]?.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, rotate: 1 }}
                    className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <course.icon className="h-12 w-12 text-blue-500 dark:text-blue-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {course.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {course.desc}
                    </p>
                    <button 
                      onClick={() => handleLearnMore(course.path)}
                      className="mt-4 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Learn more →
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
