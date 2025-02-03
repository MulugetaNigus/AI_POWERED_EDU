import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import Header from '../../components/Header';
import { Eye, Trash, Users, MessageSquare, Settings, ChevronRight, Plus, Search, Calendar } from 'lucide-react';
import PopularGroups from '../PopularGroups';
import axios from 'axios';

interface Group {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupMember: string;
    groupCreator: string;
    profilePicture: string;
    approval: boolean;
}

interface GroupCardProps extends Group {
    isOwner: boolean;
}

const MyGroup: React.FC = () => {
    const { user } = useUser();
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [otherGroups, setOtherGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:8888/api/v1/getGroup');
                const allGroups = response.data;

                // Separate groups based on creator
                const userEmail = user?.emailAddresses[0]?.emailAddress;
                const myGroups = allGroups.filter((group: Group) =>
                    group.groupCreator === userEmail
                );
                const otherGroups = allGroups.filter((group: Group) =>
                    group.groupCreator !== userEmail
                );

                setMyGroups(myGroups);
                setOtherGroups(otherGroups);
                console.log("mine", myGroups)
                console.log("mine", otherGroups)
            } catch (err) {
                setError('Failed to fetch groups');
                console.error('Error fetching groups:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const GroupCard = ({ group, isOwner }: { group: Group; isOwner: boolean }) => {
        const [showMenu, setShowMenu] = useState(false);

        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="p-6">
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={group.profilePicture}
                                alt={group.groupName}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {group.groupName}
                                </h4>
                                <span className="text-sm text-blue-600 dark:text-blue-400">
                                    Created by: {group.groupCreator}
                                </span>
                            </div>
                        </div>
                        {isOwner && group.approval && (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                </button>
                                
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                                        border border-gray-100 dark:border-gray-700 z-10">
                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    // Add edit functionality
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 
                                                    hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Edit Group
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Add delete functionality
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 
                                                    hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Delete Group
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Group Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {group.groupDescription}
                    </p>

                    {/* Group Stats */}
                    <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Users className="w-5 h-5" />
                                <span>{group.groupMember} members</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {group.approval ? (
                                <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                                    Approved
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                                    Pending
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const GroupGrid = ({ groups, title }: { groups: Group[], title: string }) => {
        const { user } = useUser();
        const userEmail = user?.emailAddresses[0]?.emailAddress;

        return (
            <>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {title === "My Groups" ? "Groups you've created" : "Other available groups"}
                        </p>
                    </div>
                    {/* {title === "My Groups" && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                            transition-colors shadow-sm hover:shadow-md disabled">
                            <Plus className="w-5 h-5" />
                            Create Group
                        </button>
                    )} */}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {groups.map((group) => (
                        <GroupCard 
                            key={group._id} 
                            group={group} 
                            isOwner={group.groupCreator === userEmail}
                        />
                    ))}
                </div>
            </>
        );
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
    }

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

                    {/* Search Bar */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search groups..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                                rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                    </div>

                    {/* My Groups Section */}
                    <GroupGrid groups={myGroups} title="My Groups" />

                    {/* Other Groups Section */}
                    <GroupGrid groups={otherGroups} title="Other Groups" />
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