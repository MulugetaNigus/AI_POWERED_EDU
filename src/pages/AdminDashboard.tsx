import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedAdminSidebar from '../components/admin/EnhancedAdminSidebar';
import UserManagement from '../components/admin/UserManagement';
import CourseManagement from '../components/admin/CourseManagement';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import ContentModeration from '../components/admin/ContentModeration';
import { useNavigate } from 'react-router-dom';
import { 
  MoonIcon, 
  SunIcon, 
  SparklesIcon, 
  CogIcon 
} from '@heroicons/react/24/solid';

const pageVariants = {
  initial: { opacity: 0, x: '-100%' },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: '100%' }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Simulated admin check (replace with actual authentication logic)
  const isAdmin = true;

  useEffect(() => {
    // Theme application
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Click outside settings handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current && 
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'courses':
        return <CourseManagement />;
      case 'content':
        return <ContentModeration />;
      case 'dashboard':
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Animated Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 120, 
          damping: 20 
        }}
        className="z-40"
      >
        <EnhancedAdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
      </motion.div>
      
      {/* Main Content Area */}
      <motion.main 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: 'spring', 
          stiffness: 100, 
          delay: 0.2 
        }}
        className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6 relative"
      >
        {/* Header with Theme Toggle and Settings */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="container mx-auto px-6 py-4 mb-6 flex justify-between items-center"
        >
          {/* Page Title with Animated Gradient */}
          <motion.h1 
            className="text-4xl font-bold bg-clip-text text-transparent 
            bg-gradient-to-r from-blue-600 to-purple-600 
            dark:from-blue-400 dark:to-purple-400"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {activeSection === 'dashboard' ? 'Admin Dashboard' : 
             activeSection === 'users' ? 'User Management' : 
             activeSection === 'courses' ? 'Course Management' : 
             activeSection === 'content' ? 'Content Moderation' : 
             'Admin Panel'}
          </motion.h1>

          {/* Settings and Theme Toggle */}
          <div className="flex items-center space-x-4" ref={settingsRef}>
            {/* Theme Toggle */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme} 
              className="p-3 rounded-full bg-white/50 dark:bg-gray-700/50 
              backdrop-blur-md shadow-lg hover:bg-gray-200 
              dark:hover:bg-gray-600 transition-all"
            >
              {isDarkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-indigo-600" />
              )}
            </motion.button>

            {/* Settings Dropdown */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-3 rounded-full bg-white/50 dark:bg-gray-700/50 
              backdrop-blur-md shadow-lg hover:bg-gray-200 
              dark:hover:bg-gray-600 transition-all"
            >
              <CogIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </motion.button>

            {/* Animated Settings Dropdown */}
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute right-6 top-20 bg-white dark:bg-gray-800 
                  rounded-xl shadow-2xl border dark:border-gray-700 p-4 
                  w-64 z-50"
                >
                  <h3 className="text-lg font-semibold mb-4 
                  text-gray-800 dark:text-white flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-purple-600" />
                    Quick Settings
                  </h3>
                  {/* Add more settings here */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Notifications
                      </span>
                      <motion.div 
                        className="w-12 h-6 bg-gray-200 dark:bg-gray-700 
                        rounded-full p-1 flex items-center cursor-pointer"
                        whileTap={{ scale: 0.9 }}
                      >
                        <motion.div 
                          layout 
                          className="w-4 h-4 bg-white dark:bg-gray-500 
                          rounded-full shadow-md"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Animated Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="container mx-auto px-6"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

export default AdminDashboard;