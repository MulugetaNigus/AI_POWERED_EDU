// CommunityPage.tsx
import React, { useState, useEffect } from 'react';
import UserProfile from './UserProfile';
import Navigation from './Navigation';
import PostCreation from './PostCreation';
import Feed from './Feed';
import PopularGroups from './PopularGroups';
import Header from '../components/Header';
import CreateGroupForm from './CreateGroupForm';
import { motion } from 'framer-motion';
import { Bell, MessageCircle, Users } from 'lucide-react';

const CommunityPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'feed' | 'groups' | 'chat'>('feed');
    const [postCreationModal, setpostCreationModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="w-full pb-24">
                <Header />
            </div>

            {/* Main Content Area */}
            <motion.div
                className="container mx-auto px-0 flex flex-col md:flex-row gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Left Sidebar */}
                <motion.div
                    className="md:w-1/4"
                    variants={itemVariants}
                >
                    <div className="sticky top-24">
                        <UserProfile loading={loading} />
                        <Navigation
                            postCreationModal={postCreationModal}
                            setpostCreationModal={setpostCreationModal}
                            loading={loading}
                        />
                    </div>
                </motion.div>

                {/* Center Content */}
                <motion.div
                    className="md:w-1/2"
                    variants={itemVariants}
                >
                    {/* Simple Tab Navigation */}
                    {/* <div className="mb-6 flex rounded-lg bg-white dark:bg-gray-800 p-1">
                        {[
                            { id: 'feed', icon: Bell, label: 'Feed' },
                            { id: 'groups', icon: Users, label: 'Groups' },
                            { id: 'chat', icon: MessageCircle, label: 'Chat' }
                        ].map((tab) => (
                            t<button
                                tkey={tab.id}
                                onClick={() => setActiveTab(tab.id as 'feed' | 'groups' | 'chat')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                    activeTab === tab.id 
                                        ? 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-blue-400' 
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div> */}

                    {postCreationModal ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <CreateGroupForm />
                        </motion.div>
                    ) : (
                        <>
                            <PostCreation />
                            <Feed />
                        </>
                    )}
                </motion.div>

                {/* Right Sidebar */}
                <motion.div
                    className="md:w-1/4"
                    variants={itemVariants}
                >
                    <div clasName="sticky top-24">
                        <PopularGroups />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CommunityPage;