import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Navigation from '../Navigation';
import { Search, Users, MessageSquare, Calendar, MessageCircle, Clock, ArrowRight } from 'lucide-react';

const SearchGroups: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [postCreationModal, setpostCreationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Dummy data for Other Groups
  const otherGroups = [
    {
      id: 1,
      name: 'Chemistry Study Circle',
      members: 89,
      topics: 34,
      lastActive: '1 hour ago',
      description: 'Deep dive into chemical reactions and molecular structures'
    },
    {
      id: 2,
      name: 'Biology Research Group',
      members: 124,
      topics: 56,
      lastActive: '30 mins ago',
      description: 'Explore the fascinating world of life sciences'
    },
    {
      id: 3,
      name: 'Computer Science Hub',
      members: 245,
      topics: 78,
      lastActive: '5 mins ago',
      description: 'Programming, algorithms, and software development discussions'
    }
  ];

  // Simulate search loading
  useEffect(() => {
    if (searchTerm) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Filter groups based on search term
  const filteredGroups = otherGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = () => {
    navigate('/search-groups/chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Main Content with proper spacing from header */}
      <div className="flex pt-20"> {/* Added pt-20 to create space below fixed header */}
        {/* Left Navigation */}
        <div className="w-1/4 p-8 sticky top-24 h-[calc(100vh-6rem)]"> {/* Adjusted top spacing */}
          <Navigation
            postCreationModal={postCreationModal}
            setpostCreationModal={setpostCreationModal}
          />
        </div>

        {/* Main Content */}
        <div className="w-2/4 p-8">
          {/* Enhanced Search Section */}
          <div className="sticky top-24 z-10 bg-gradient-to-b from-gray-50 to-transparent dark:from-gray-800 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search groups..."
                className="w-full pl-12 pr-24 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 
                  dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                  focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300"
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 
                  bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
            {/* Search Loading Indicator */}
            {isSearching && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute mt-2 text-sm text-gray-500 dark:text-gray-400"
              >
                Searching...
              </motion.div>
            )}
          </div>

          {/* My Groups Section */}
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Groups</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">2 groups</span>
            </div>

            <div className="space-y-4">
              {/* Approved Group */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, shadow: 'lg' }}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                  transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mathematics Group</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 
                    rounded-full text-sm font-medium">
                    Approved
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">156 members</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Chat</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleChatClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg 
                      hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </motion.button>
                </div>
              </motion.div>

              {/* Pending Group */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2, shadow: 'lg' }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                  transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Physics Group</h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 
                    rounded-full text-sm font-medium">
                    Pending
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Awaiting approval</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Other Groups Section */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Other Groups</h2>
              <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 
                dark:hover:text-blue-300 font-medium text-sm transition-colors">
                View All
              </button>
            </div>
            
            <div className="grid gap-4">
              <AnimatePresence>
                {filteredGroups.map((group) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ y: -2, shadow: 'lg' }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                      transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{group.lastActive}</span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{group.description}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span className="text-sm">{group.members} members</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">{group.topics} topics</span>
                          </div>
                        </div>
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 
                          dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                          Join Group
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {searchTerm && filteredGroups.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No groups found matching "{searchTerm}"
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/4 p-8 sticky top-24 h-[calc(100vh-6rem)]">
          {/* Keep your existing right panel content */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default SearchGroups;