import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight, Beaker, Calculator, Globe, Dna, Atom, BookText, Microscope, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const subjects = [
  {
    name: 'Mathematics',
    icon: Calculator,
    color: 'bg-blue-500/10 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    topics: ['Algebra', 'Calculus', 'Geometry', 'Trigonometry'],
    image: 'https://img.freepik.com/free-vector/hand-drawn-mathematics-background_23-2148157511.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
    path: '/subjects/mathematics'
  },
  {
    name: 'Physics',
    icon: Atom,
    color: 'bg-purple-500/10 dark:bg-purple-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderColor: 'border-purple-200 dark:border-purple-800',
    topics: ['Mechanics', 'Electricity', 'Thermodynamics', 'Optics'],
    image: 'https://img.freepik.com/free-vector/hand-drawn-physics-background_23-2148163123.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
    path: '/subjects/physics'
  },
  {
    name: 'Chemistry',
    icon: Beaker,
    color: 'bg-green-500/10 dark:bg-green-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
    topics: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'Analytical Chemistry'],
    image: 'https://img.freepik.com/free-vector/hand-drawn-chemistry-background_23-2148164901.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
    path: '/subjects/chemistry'
  },
  {
    name: 'Biology',
    icon: Dna,
    color: 'bg-yellow-500/10 dark:bg-yellow-500/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Physiology'],
    image: 'https://img.freepik.com/free-vector/hand-drawn-biology-background_23-2148168504.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
    path: '/subjects/biology'
  },
  {
    name: 'Geography',
    icon: Globe,
    color: 'bg-teal-500/10 dark:bg-teal-500/20',
    iconColor: 'text-teal-600 dark:text-teal-400',
    borderColor: 'border-teal-200 dark:border-teal-800',
    topics: ['Physical Geography', 'Human Geography', 'Cartography', 'Environmental Geography'],
    image: 'https://img.freepik.com/free-vector/hand-drawn-geography-background_23-2148175048.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
    path: '/subjects/geography'
  },
  {
    name: 'English',
    icon: BookText,
    color: 'bg-red-500/10 dark:bg-red-500/20',
    iconColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
    topics: ['Grammar', 'Literature', 'Composition', 'Comprehension'],
    image: 'https://img.freepik.com/free-vector/hand-drawn-literature-background_23-2148165923.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
    path: '/subjects/english'
  },
  {
    name: 'Civics',
    icon: PenTool,
    color: 'bg-orange-500/10 dark:bg-orange-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
    borderColor: 'border-orange-200 dark:border-orange-800',
    topics: ['Government', 'Citizenship', 'Ethics', 'Law'],
    image: 'https://img.freepik.com/free-vector/hand-drawn-history-background_23-2148173012.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
    path: '/subjects/civics'
  },
  {
    name: 'Biology Lab',
    icon: Microscope,
    color: 'bg-pink-500/10 dark:bg-pink-500/20',
    iconColor: 'text-pink-600 dark:text-pink-400',
    borderColor: 'border-pink-200 dark:border-pink-800',
    topics: ['Microscopy', 'Dissection', 'Cell Culture', 'DNA Analysis'],
    image: 'https://img.freepik.com/free-vector/hand-drawn-science-education-background_23-2148499325.jpg?w=1380&t=st=1701234567~exp=1701235167~hmac=5f7b8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f',
    path: '/subjects/biology-lab'
  }
];

export default function Subjects() {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Handler for exploring a specific subject
  const handleExploreSubject = (subjectPath: string) => {
    navigate(subjectPath);
  };

  // Handler for viewing all subjects
  const handleViewAllSubjects = () => {
    navigate('#');
  };

  return (
    <section id="subjects" className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800">
            <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Comprehensive Curriculum</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400">Subject Offerings</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Master all subjects required for the Ethiopian National Entrance Exam with our comprehensive learning materials.
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              className={`group relative overflow-hidden rounded-2xl border ${subject.borderColor} hover:shadow-xl transition-all duration-300`}
              variants={itemVariants}
            >
              {/* Background image with overlay */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 dark:to-black/80 z-10"></div>
                <img 
                  src={subject.image} 
                  alt={subject.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              {/* Content */}
              <div className="relative z-20 p-6 h-full flex flex-col">
                <div className={`p-3 rounded-xl ${subject.color} inline-block mb-auto`}>
                  <subject.icon className={`h-6 w-6 ${subject.iconColor}`} />
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {subject.name}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    {subject.topics.map((topic, i) => (
                      <p key={i} className="text-sm text-gray-200 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/70 mr-2"></span>
                        {topic}
                      </p>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => handleExploreSubject(subject.path)}
                    className="flex items-center text-white text-sm font-medium group-hover:text-blue-300 transition-colors duration-200"
                  >
                    Explore Subject
                    <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <motion.button
            onClick={handleViewAllSubjects}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 dark:from-green-500 dark:to-blue-500 dark:hover:from-green-600 dark:hover:to-blue-600 text-white rounded-lg font-medium shadow-lg shadow-green-500/20 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All Subjects
          </motion.button>
        </div>
      </div>
    </section>
  );
}