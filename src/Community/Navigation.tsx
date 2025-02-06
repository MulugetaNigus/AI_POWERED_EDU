// components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FileText, 
    Users, 
    PlusCircle, 
    BookOpen,
    MessageCircle,
    Video
} from 'lucide-react';

interface NavigationProps {
    postCreationModal: boolean;
    setpostCreationModal: (value: boolean) => void;
    loading?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ postCreationModal, setpostCreationModal, loading = false }) => {
    const navItems = [
        { 
            icon: FileText, 
            label: 'My Posts', 
            path: '/community/myPost',
            highlight: false 
        },
        { 
            icon: BookOpen, 
            label: 'Resources', 
            path: '/resources',
            highlight: false 
        },
        { 
            icon: MessageCircle, 
            label: 'Chat', 
            path: '/search-groups/chat',
            highlight: false 
        },
        // { 
        //     icon: Video, 
        //     label: 'Live Sessions', 
        //     path: '/live-sessions',
        //     highlight: false 
        // }
    ];

    const NavigationSkeleton = () => (
        <div className="p-4">
            <ul className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <li key={i} className="animate-pulse">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </li>
                ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            </div>
        </div>
    );

    return (
        <nav className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {loading ? (
                <NavigationSkeleton />
            ) : (
                <>
                    <div className="p-4">
                        <ul className="space-y-2">
                            {navItems.map((item, index) => (
                                <motion.li
                                    key={index}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Link
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                            ${item.highlight 
                                                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setpostCreationModal(!postCreationModal)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Create Group
                        </motion.button>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navigation;