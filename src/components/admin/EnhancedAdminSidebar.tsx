import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  Squares2X2Icon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

interface EnhancedAdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarVariants = {
  collapsed: { 
    width: 80, 
    transition: { 
      duration: 0.3, 
      ease: 'easeInOut' 
    }
  },
  expanded: { 
    width: 280, 
    transition: { 
      duration: 0.3, 
      ease: 'easeInOut' 
    }
  }
};

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: ChartBarIcon,
    gradient: 'from-blue-500 to-purple-600'
  },
  { 
    id: 'users', 
    label: 'User Management', 
    icon: UsersIcon,
    gradient: 'from-green-400 to-teal-500'
  },
  { 
    id: 'courses', 
    label: 'Course Management', 
    icon: DocumentTextIcon,
    gradient: 'from-yellow-500 to-orange-600'
  },
  { 
    id: 'content', 
    label: 'Content Moderation', 
    icon: ShieldCheckIcon,
    gradient: 'from-red-500 to-pink-600'
  }
];

const EnhancedAdminSidebar: React.FC<EnhancedAdminSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.aside
      initial="expanded"
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className={`
        h-screen bg-white dark:bg-gray-900 
        shadow-2xl border-r dark:border-gray-800 
        flex flex-col relative overflow-hidden
      `}
    >
      {/* Collapse/Expand Toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className={`
          absolute top-4 right-4 z-50 
          bg-white dark:bg-gray-800 
          shadow-md rounded-full p-2
          ${isExpanded ? 'translate-x-0' : 'translate-x-full'}
          transition-transform duration-300
        `}
      >
        {isExpanded ? (
          <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </motion.button>

      {/* Logo Area */}
      <div className="p-5 flex items-center justify-start border-b dark:border-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3"
        >
          <Squares2X2Icon className="h-8 w-8 text-blue-600" />
          {isExpanded && (
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold text-gray-800 dark:text-white"
            >
              Admin
            </motion.h2>
          )}
        </motion.div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full flex items-center p-3 
                ${activeSection === item.id 
                  ? `bg-gradient-to-r ${item.gradient} text-white` 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                transition-all duration-300 ease-in-out
                ${isExpanded ? 'px-6' : 'justify-center'}
              `}
            >
              <item.icon 
                className={`
                  h-6 w-6 
                  ${activeSection === item.id 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-400'}
                `} 
              />
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 border-t dark:border-gray-800 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Admin Dashboard
          </p>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default EnhancedAdminSidebar;
