import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import Header from '../../components/Header';
import { Eye, Trash, Users, MessageSquare, Settings, ChevronRight, Plus, Search, Calendar, Check } from 'lucide-react';
import PopularGroups from '../PopularGroups';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { useGroupContext } from '../../contexts/GroupContext';

interface Group {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupMember: string;
    groupCreator: string;
    profilePicture: string;
    approval: boolean;
    members: string[];
}

interface GroupCardProps extends Group {
    isOwner: boolean;
}

interface UpdateGroupModalProps {
    group: Group | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (groupData: UpdateGroupData) => void;
}

interface UpdateGroupData {
    groupName: string;
    groupDescription: string;
    profilePicture: string;
}

const MyGroup: React.FC = () => {
    const { user } = useUser();
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [otherGroups, setOtherGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState('light');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
    const [groupID, setgroupID] = useState<string | undefined>();
    const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
    const [joiningInProgress, setJoiningInProgress] = useState<Set<string>>(new Set());
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://extreamx-backend.onrender.com/api/v1/getGroup');
            const allGroups = response.data;
            const userEmail = user?.emailAddresses[0]?.emailAddress;
            
            const myGroups = allGroups.filter((group: Group) =>
                group.groupCreator === userEmail
            );
            const otherGroups = allGroups.filter((group: Group) =>
                group.groupCreator !== userEmail
            );

            if (userEmail) {
                const joinedGroupIds = new Set(
                    allGroups
                        .filter(group => group.members?.includes(userEmail))
                        .map(group => group._id)
                );
                setJoinedGroups(joinedGroupIds);
            }

            setMyGroups(myGroups);
            setOtherGroups(otherGroups);
        } catch (err) {
            setError('Failed to fetch groups');
            console.error('Error fetching groups:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, [user]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    const handleDeleteGroup = async (groupId: string, groupName: string) => {
        if (window.confirm(`Are you sure you want to delete "${groupName}"? This action cannot be undone.`)) {
            try {
                const response = await axios.delete(`https://extreamx-backend.onrender.com/api/v1/delete-group/${groupId}`);
                
                if (response.status === 200) {
                    // Remove the deleted group from the list
                    setMyGroups(myGroups.filter(group => group._id !== groupId));
                    toast.success('Group deleted successfully!');
                }
            } catch (error) {
                console.error('Error deleting group:', error);
                toast.error('Failed to delete group. Please try again.');
            }
        }
    };

    const handleJoinGroup = async (groupId: string) => {
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        if (!userEmail) return;

        const joiningGroupIds = JSON.parse(localStorage.getItem('joiningGroups') || '[]');
        localStorage.setItem('joiningGroups', JSON.stringify([...joiningGroupIds, groupId]));

        try {
            const response = await axios.post('https://extreamx-backend.onrender.com/api/v1/add-member', {
                groupId: groupId,
                memberEmail: userEmail
            });

            if (response.status === 200) {
                const savedJoinedGroups = JSON.parse(localStorage.getItem('joinedGroups') || '[]');
                const newJoinedGroups = [...savedJoinedGroups, groupId];
                localStorage.setItem('joinedGroups', JSON.stringify(newJoinedGroups));
                
                toast.success('Successfully joined the group!');
                
                // Refresh the groups data
                fetchGroups();
            }
        } catch (error) {
            console.error('Error joining group:', error);
            toast.error('Failed to join the group. Please try again.');
        } finally {
            const joiningGroupIds = JSON.parse(localStorage.getItem('joiningGroups') || '[]');
            localStorage.setItem('joiningGroups', 
                JSON.stringify(joiningGroupIds.filter((id: string) => id !== groupId))
            );
        }
    };

    const handleUpdateGroup = async (groupData: UpdateGroupData) => {
        try {
            const response = await axios.put(`https://extreamx-backend.onrender.com/api/v1/edit-group/${selectedGroup?._id}`, groupData);
            
            if (response.status === 200) {
                // Update the groups list with the updated group
                const updatedGroups = myGroups.map(group => 
                    group._id === selectedGroup?._id ? { ...group, ...groupData } : group
                );
                setMyGroups(updatedGroups);
                
                toast.success('Group updated successfully!');
                setUpdateModalOpen(false);
            }
        } catch (error) {
            console.error('Error updating group:', error);
            toast.error('Failed to update group. Please try again.');
        }
    };

    const GroupCard: React.FC<GroupCardProps> = (props) => {
        const { _id, groupName, groupDescription, groupMember, groupCreator, profilePicture, approval, isOwner, members } = props;
        const [showMenu, setShowMenu] = useState(false);
        const { user } = useUser();

        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="p-6">
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={user?.imageUrl}
                                alt={groupName}
                                className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {groupName}
                                </h4>
                                <span className="text-sm text-blue-600 dark:text-blue-400">
                                    Created by: {groupCreator}
                                </span>
                            </div>
                        </div>
                        {isOwner && (
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
                                                    setSelectedGroup(props);
                                                    setUpdateModalOpen(true);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 
                                                    hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                Edit Group
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDeleteGroup(_id, groupName);
                                                    setShowMenu(false);
                                                }}
                                                className="w-full px-4 py-2 text-left text-sm text-red-600 
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
                        {groupDescription}
                    </p>

                    {/* Group Stats */}
                    <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Users className="w-5 h-5" />
                                <span>{members?.length || 0} members</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isOwner ? (
                                approval ? (
                                    <Link to="/chat" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
                                        <MessageSquare className="w-5 h-5 mr-2 inline-block" />
                                        Chat
                                    </Link>
                                ) : (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                                        Pending
                                    </span>
                                )
                            ) : (
                                joinedGroups.has(_id) ? (
                                    <Link 
                                        to="/chat" 
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md flex items-center"
                                    >
                                        <MessageSquare className="w-4 h-4 mr-1" />
                                        Chat
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => handleJoinGroup(_id)}
                                        disabled={joiningInProgress.has(_id)}
                                        className={`px-4 py-2 text-white text-sm rounded-full cursor-pointer transition easy-out duration-125 flex items-center
                                            bg-blue-500 hover:bg-blue-400
                                            ${joiningInProgress.has(_id) && 'opacity-75 cursor-not-allowed'}`}
                                    >
                                        {joiningInProgress.has(_id) ? (
                                            <span>Joining...</span>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-1" />
                                                Join Group
                                            </>
                                        )}
                                    </button>
                                ))}

                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const GroupCardSkeleton = () => (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-6 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                        <div className="space-y-2">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2 mb-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>
        </div>
    );

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
                            {...group}
                            isOwner={group.groupCreator === userEmail}
                        />
                    ))}
                </div>
            </>
        );
    };

    // Delete Confirmation Modal Component -  Professional Design
    const DeleteConfirmationModal = () => {
        if (!isDeleteModalOpen || !groupToDelete) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none bg-gray-500 bg-opacity-40 dark:bg-gray-800 dark:bg-opacity-60">
                <div className="relative w-auto max-w-md mx-auto my-6">
                    {/* Modal content */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg relative flex flex-col w-full outline-none focus:outline-none">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Confirm Delete
                            </h3>
                        </div>
                        {/* Modal Body */}
                        <div className="relative p-6 flex-auto">
                            <p className="my-4 text-gray-700 dark:text-gray-300 text-lg">
                                Are you sure you want to delete "<span className="font-semibold">{groupToDelete.groupName}</span>" group?
                                <br />
                                <span className="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone.</span>
                            </p>
                        </div>
                        {/* Modal Footer - Improved Button Styling */}
                        <div className="flex items-center justify-end p-6 rounded-b-xl">
                            <button
                                className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg ml-3 focus:outline-none focus:shadow-outline hover:bg-red-700 transition-colors duration-200"
                                type="button"
                                onClick={() => handleDeleteGroup(_id, groupName)}
                            >
                                Delete Group
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Update Group Modal Component
    const UpdateGroupModal: React.FC<UpdateGroupModalProps> = ({ group, isOpen, onClose, onUpdate }) => {
        const [formData, setFormData] = useState<UpdateGroupData>({
            groupName: group?.groupName || '',
            groupDescription: group?.groupDescription || '',
            profilePicture: group?.profilePicture || ''
        });

        useEffect(() => {
            if (group) {
                setFormData({
                    groupName: group.groupName,
                    groupDescription: group.groupDescription,
                    profilePicture: group.profilePicture
                });
            }
        }, [group]);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            onUpdate(formData);
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none bg-gray-500 bg-opacity-40 dark:bg-gray-800 dark:bg-opacity-60">
                <div className="relative w-full max-w-2xl mx-auto my-6 px-4">
                    <div className="relative flex flex-col w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                        <div className="flex items-start justify-between p-5 border-b border-gray-200 dark:border-gray-700 rounded-t">
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Update Group
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none text-2xl font-semibold"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Group Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.groupName}
                                        onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                            dark:bg-gray-700 dark:text-white shadow-sm p-3 text-base"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.groupDescription}
                                        onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                            dark:bg-gray-700 dark:text-white shadow-sm p-3 text-base"
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Profile Picture URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.profilePicture}
                                        onChange={(e) => setFormData({ ...formData, profilePicture: e.target.value })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                                            dark:bg-gray-700 dark:text-white shadow-sm p-3 text-base"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 text-base font-medium text-gray-700 bg-gray-100 
                                        hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 text-base font-medium text-white bg-blue-600 
                                        hover:bg-blue-700 rounded-md"
                                >
                                    Update Group
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">My Groups</h2>
                        <div className="grid gap-4">
                            {loading ? (
                                [...Array(2)].map((_, index) => (
                                    <GroupCardSkeleton key={index} />
                                ))
                            ) : (
                                myGroups.map(group => (
                                    <GroupCard
                                        key={group._id}
                                        {...group}
                                        isOwner={true}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Other Groups Section */}
                    <div>
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">Other Groups</h2>
                        <div className="grid gap-4">
                            {loading ? (
                                [...Array(3)].map((_, index) => (
                                    <GroupCardSkeleton key={index} />
                                ))
                            ) : (
                                otherGroups.map(group => (
                                    <GroupCard
                                        key={group._id}
                                        {...group}
                                        isOwner={false}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-1/3 p-8 bg-gray-50 dark:bg-gray-900">
                    <PopularGroups />
                </div>
                <DeleteConfirmationModal />
                <UpdateGroupModal
                    group={selectedGroup}
                    isOpen={updateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    onUpdate={handleUpdateGroup}
                />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={theme === 'light' ? 'light' : 'dark'}
                />
            </main>
        </div>
    );
};

export default MyGroup;