import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from '../../components/Header';
import { Eye, Trash, GanttChartSquareIcon, BookmarkCheck, CircleDashed, Loader2, Users, MessageSquare, Settings, ChevronRight, Plus, Search } from 'lucide-react';
import img1 from '../Assets/p4.png';
import PopularGroups from '../PopularGroups';
import { motion, AnimatePresence } from 'framer-motion';

interface MyGroupProps {
    groupName: string;
    groupDescription: string;
    groupPicture: string;
    members: {
        username: string;
        profilePicture: string;
        posts: {
            title: string;
            content: string;
            status: 'pending' | 'approved';
        }[];
    }[];
}

const MyGroup: React.FC<MyGroupProps> = ({ groupName, groupDescription, groupPicture, members }) => {
    // Get the current user
    const { user } = useUser();

    // State to track the theme
    const [theme, setTheme] = useState('light');

    // Function to toggle the theme
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    // Placeholder functions for delete and view more actions
    const handleDelete = (memberIndex: number, postIndex: number) => {
        console.log(`Delete post at index ${postIndex} for member ${memberIndex}`);
        // Add your delete logic here
    };

    const handleViewMore = (memberIndex: number, postIndex: number) => {
        console.log(`View more for post at index ${postIndex} for member ${memberIndex}`);
        // Add your view more logic here
    };

    const groups: Group[] = [
        {
            id: '1',
            name: 'Mathematics Study Group',
            description: 'A group dedicated to helping each other with mathematics problems and concepts.',
            members: 156,
            topics: 45,
            lastActive: '2 hours ago'
        },
        // Add more dummy groups as needed
    ];

    return (
        <div className={`flex flex-col min-h-screen dark:bg-gray-700 text-gray-800 dark:text-white`}>
            {/* Header Placeholder */}
            <div className="w-full h-20 flex items-center justify-center">
                <Header toggleTheme={toggleTheme} />
            </div>

            <main className="flex flex-1">
                {/* Left side content */}
                <div className="w-3/4 p-8 bg-white dark:bg-gray-700">
                    <div className="flex items-center mb-4">
                        <img
                            src={user?.imageUrl}
                            alt="Group"
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{user?.emailAddresses[0].emailAddress}</p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">My Groups</h3>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Groups</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage your study groups and discussions</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4"
                        >
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <Plus className="w-5 h-5" />
                                Create Group
                            </button>
                        </motion.div>
                    </div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative mb-8"
                    >
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your groups..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl
                                focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                    </motion.div>

                    {/* Groups Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {groups.map((group) => (
                                <motion.div
                                    key={group.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                                        border border-gray-100 dark:border-gray-700 overflow-hidden group"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{group.name}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{group.description}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between mt-6 pt-4 border-t dark:border-gray-700">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                    <Users className="w-5 h-5" />
                                                    <span>{group.members} members</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                    <MessageSquare className="w-5 h-5" />
                                                    <span>{group.topics} topics</span>
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline">
                                                <span>View Group</span>
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Right side content */}
                <div className="w-1/4 p-8 bg-gray-50 dark:bg-gray-900">
                    {/* <h3 className="text-2xl font-semibold mb-4">Approved Posts</h3> */}
                    <PopularGroups />
                </div>
            </main>
        </div>
    );
};

export default MyGroup;