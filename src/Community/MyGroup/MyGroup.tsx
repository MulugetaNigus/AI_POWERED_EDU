import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from '../../components/Header';
import { Eye, Trash, Users, MessageSquare, Settings, ChevronRight, Plus, Search, Calendar } from 'lucide-react';
import PopularGroups from '../PopularGroups';

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
    const { user } = useUser();
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const groups = [
        {
            id: '1',
            name: 'Mathematics Study Group',
            description: 'A group dedicated to helping each other with mathematics problems and concepts.',
            members: 156,
            topics: 45,
            lastActive: '2 hours ago',
            category: 'Mathematics'
        },
        {
            id: '2',
            name: 'Physics Discussion',
            description: 'Explore physics concepts and solve problems together.',
            members: 98,
            topics: 32,
            lastActive: '1 hour ago',
            category: 'Physics'
        },
        // Add more groups as needed
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="w-full h-20 flex items-center justify-center">
                <Header toggleTheme={toggleTheme} />
            </div>

            <main className="flex flex-1">
                <div className="w-3/4 p-8 ml-20">
                    {/* User Profile Section */}
                    <div className="flex items-center mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <img
                            src={user?.imageUrl}
                            alt="Profile"
                            className="w-16 h-16 rounded-full mr-4 ring-2 ring-blue-500 p-0.5"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.fullName}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{user?.emailAddresses[0].emailAddress}</p>
                        </div>
                    </div>

                    {/* Groups Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">My Groups</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your study groups and discussions</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                            transition-colors shadow-sm hover:shadow-md">
                            <Plus className="w-5 h-5" />
                            Create Group
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search your groups..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                                rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                    </div>

                    {/* Groups Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {groups.map((group) => (
                            <div key={group.id} 
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                                    transition-all duration-300 border border-gray-100 dark:border-gray-700">
                                <div className="p-6">
                                    {/* Group Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 
                                                flex items-center justify-center">
                                                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h4>
                                                <span className="text-sm text-blue-600 dark:text-blue-400">{group.category}</span>
                                            </div>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Group Description */}
                                    <p className="text-gray-600 dark:text-gray-300 mb-6">{group.description}</p>

                                    {/* Group Stats */}
                                    <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
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
                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">{group.lastActive}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-1/4 p-8 bg-gray-50 dark:bg-gray-900">
                    <PopularGroups />
                </div>
            </main>
        </div>
    );
};

export default MyGroup;