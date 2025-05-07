import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Group, MoreVertical, Image, Paperclip, File, Music, Video, X, Send, Search } from 'lucide-react';
import ReportModal from '../../components/ReportModal';

interface Message {
    id: number;
    content: string; 
    senderEmail: string;
    senderProfilePic: string;
    timestamp: string;
    userID: string;
    createdAt: string;
    fileType?: 'none' | 'image' | 'audio' | 'video' | 'file';
    fileUrl?: string;
    fileName?: string; 
}

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

const Chat: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [loadingInitialMessages, setLoadingInitialMessages] = useState(true);
    const { user } = useUser();
    const theme = 'light';
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [isSubmittingReport, setIsSubmittingReport] = useState(false);
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'none' | 'image' | 'audio' | 'video' | 'file'>('none');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8888/api/v1/getGroup');
                const allGroups = response.data;
                const userEmail = user?.emailAddresses[0]?.emailAddress;

                const filteredGroups = allGroups.filter((group: Group) => {
                    const isApproved = group.approval === true;
                    const isMember = userEmail ? group.members?.includes(userEmail) : false;
                    const isCreator = group.groupCreator === userEmail;

                    return isApproved && (isMember || isCreator);
                });

                setGroups(filteredGroups);
                
                if (filteredGroups.length > 0) {
                    setSelectedGroup(filteredGroups[0]);
                    handleGroupChange(filteredGroups[0]);
                }
            } catch (error) {
                console.error("Error fetching groups:", error);
                toast.error("Failed to fetch groups", {
                    theme: theme === 'light' ? 'light' : 'dark'
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchGroups();
        }
    }, [user]);

    const handleSendMessage = async () => {
        if ((newMessage.trim() || selectedFile) && !isUploading) {
            const userEmail = user?.emailAddresses[0]?.emailAddress;
            const groupId = selectedGroup?.groupName;

            if (!userEmail) {
                toast.error("User email not found. Please sign in.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme === 'light' ? 'light' : 'dark',
                });
                return;
            }

            try {
                setIsUploading(true);
                let fileUrl = '';
                let messageFileType = 'none';
                let originalFileName = '';
                
                if (selectedFile) {
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    originalFileName = selectedFile.name; 
                    
                    const uploadResponse = await axios.post('http://localhost:8888/api/v1/upload-file', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    
                    if (uploadResponse.status === 200) {
                        fileUrl = uploadResponse.data.fileUrl;
                        messageFileType = uploadResponse.data.fileType;
                    } else {
                        throw new Error('File upload failed');
                    }
                }

                const messageContent = newMessage.trim() || (selectedFile ? selectedFile.name : 'Shared a file');
                const response = await axios.post('http://localhost:8888/api/v1/sendChat', {
                    content: messageContent,
                    userID: userEmail,
                    groupID: groupId,
                    fileType: messageFileType,
                    fileUrl: fileUrl,
                    fileName: originalFileName // Send original filename to server
                });

                if (response.status === 200) {
                    const localMessage = {
                        ...response.data,
                        fileType: messageFileType,
                        fileUrl: fileUrl,
                        fileName: originalFileName,
                        content: messageContent,
                        userID: userEmail,
                        createdAt: new Date().toISOString()
                    };
                    
                    setMessages(prevMessages => [...prevMessages, localMessage]);
                    setNewMessage('');
                    setSelectedFile(null);
                    setFilePreview(null);
                    setFileType('none');
                } else {
                    toast.error("Failed to send message. Please try again.", {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: theme === 'light' ? 'light' : 'dark',
                    });
                }
            } catch (error) {
                console.error("Error sending message:", error);
                toast.error("Failed to send message. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme === 'light' ? 'light' : 'dark',
                });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        setSelectedFile(file);
        
        if (file.type.startsWith('image/')) {
            setFileType('image');
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type.startsWith('audio/')) {
            setFileType('audio');
            setFilePreview(null);
        } else if (file.type.startsWith('video/')) {
            setFileType('video');
            setFilePreview(null);
        } else {
            setFileType('file');
            setFilePreview(null);
        }
    };
    
    const clearSelectedFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setFileType('none');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleGroupChange = async (group: Group) => {
        setSelectedGroup(group);
        setLoadingMessages(true);
        setMessages([]); 
        try {
            const response = await axios.get(`http://localhost:8888/api/v1/getGroupID?groupID=${group.groupName}`);
            if (response.status === 200) {
                const fetchedMessages = response.data;
                setMessages(fetchedMessages);
            } else {
                toast.error(`Failed to fetch messages for ${group.groupName}. Please try again.`, {
                    theme: theme === 'light' ? 'light' : 'dark'
                });
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error(`Failed to fetch messages for ${group.groupName}. Please try again.`, {
                theme: theme === 'light' ? 'light' : 'dark'
            });
        } finally {
            setLoadingMessages(false);
            setLoadingInitialMessages(false);
        }
    };

    const handleLeaveGroup = async (groupId: string, groupName: string, groupCreator: string) => {
        const userEmail = user?.emailAddresses[0]?.emailAddress;

        if (groupCreator === userEmail) {
            toast.info("You cannot leave a group you created. You can delete it instead.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme === 'light' ? 'light' : 'dark',
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:8888/api/v1/remove-member', {
                groupID: groupId,
                email: userEmail
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setGroups(prevGroups => prevGroups.filter(g => g._id !== groupId));
                
                if (selectedGroup?._id === groupId) {
                    const remainingGroups = groups.filter(g => g._id !== groupId);
                    setSelectedGroup(remainingGroups[0] || null);
                }

                toast.success(`Successfully left ${groupName}`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: theme === 'light' ? 'light' : 'dark',
                });
            }
        } catch (error: any) {
            console.error('Error leaving group:', error);
            console.error('Error response:', error.response?.data);
            
            toast.error(error.response?.data?.message || 'Failed to leave the group. Please try again.', {
                theme: theme === 'light' ? 'light' : 'dark'
            });
        }
    };

    const handleReport = async (reason: string, details: string) => {
        setIsSubmittingReport(true);
        try {
            await axios.post('http://localhost:8888/api/v1/reportSpam', {
                spamMessage: selectedMessage?.content,
                reason: reason,
                description: details,
                applyerUserId: user?.emailAddresses[0]?.emailAddress,
                spammerUserId: selectedMessage?.userID,
            });
            toast.success('Spam report submitted successfully', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme === 'light' ? 'light' : 'dark',
            });
        } catch (error) {
            console.error('Error submitting spam report:', error);
            toast.error('Failed to submit spam report', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: theme === 'light' ? 'light' : 'dark',
            });
        } finally {
            setIsSubmittingReport(false);
        }
    };

    return (
        <div className="h-screen flex dark:bg-gray-900">
            <div id="header-placeholder" className="pb-28 w-full absolute top-0 left-0">
                <Header />
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-4xl max-h-screen">
                        <button 
                            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewImage(null);
                            }}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden mt-28">
                <aside className="w-full md:w-1/4 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-y-auto h-full md:h-[calc(100vh-140px)]">
                    <div className="p-5">
                        <h3 className="text-lg font-semibold dark:text-white mb-4 flex items-center">
                            <Group className="w-5 h-5 text-blue-500 mr-2" />
                            My Groups
                        </h3>
                        
                        <div className="relative mb-4">
                            <input 
                                type="text" 
                                placeholder="Search groups..."
                                className="w-full p-3 pl-10 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        </div>
                        
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="flex items-center space-x-3 p-3">
                                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : groups.length === 0 ? (
                            <div className="text-center py-8 px-4">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Group className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-gray-500 dark:text-gray-400 mb-2">No groups available</p>
                                <Link to="/community/groups" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                                    Discover Groups
                                </Link>
                            </div>
                        ) : (
                            <ul className="space-y-2">
                                {groups.map((group) => (
                                    <li
                                        key={group._id}
                                        className={`p-3 rounded-xl transition-all 
                                            ${selectedGroup?._id === group._id 
                                                ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500' 
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div 
                                                className="flex items-center space-x-3 flex-1 cursor-pointer"
                                                onClick={() => handleGroupChange(group)}
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={group.profilePicture}
                                                        alt={group.groupName}
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-sm"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                                </div>
                                                <div>
                                                    <span className="font-medium dark:text-white block">{group.groupName}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{group.members?.length || 0} members</span>
                                                </div>
                                            </div>
                                            
                                            <div className="relative group">
                                                <button 
                                                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const dropdown = e.currentTarget.nextElementSibling;
                                                        dropdown?.classList.toggle('hidden');
                                                    }}
                                                >
                                                    <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                </button>
                                                
                                                <div className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                                    {group.groupCreator === user?.emailAddresses[0]?.emailAddress ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toast.info("To remove this group, use the delete option in the My Groups page", {
                                                                    theme: theme === 'light' ? 'light' : 'dark'
                                                                });
                                                                e.currentTarget.parentElement?.classList.add('hidden');
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                                        >
                                                            Manage Group
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm(`Are you sure you want to leave "${group.groupName}"?`)) {
                                                                    handleLeaveGroup(group._id, group.groupName, group.groupCreator);
                                                                }
                                                                e.currentTarget.parentElement?.classList.add('hidden');
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                                        >
                                                            Leave Group
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {selectedGroup ? (
                        <>
                            <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-5 mb-4 h-fit">
                                <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                                    <div className="flex flex-col md:flex-row items-center">
                                        <img
                                            src={selectedGroup.profilePicture}
                                            alt="Group Profile"
                                            className="w-16 h-16 rounded-full mb-3 md:mb-0 md:mr-4 border-4 border-white dark:border-gray-700 shadow"
                                        />
                                        <div>
                                            <h2 className="text-xl font-bold dark:text-white">{selectedGroup.groupName}</h2>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {selectedGroup.members?.length || 0} members • Active
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 md:mt-0">
                                        <button className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                            Group Info
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-3">
                                    <p className="dark:text-gray-300 text-sm">
                                        {selectedGroup.groupDescription}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col dark:bg-gray-800 bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                    {loadingMessages ? (
                                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                            <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-500 dark:text-gray-400 text-center mb-2">
                                                    No messages yet
                                                </p>
                                                <p className="text-gray-400 dark:text-gray-500 text-sm">
                                                    Be the first to start the conversation!
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        messages.map((message) => {
                                            const isCurrentUser = message.userID === user?.emailAddresses[0]?.emailAddress;
                                            return (
                                                <div key={message.id} className={`flex items-start space-x-3 ${isCurrentUser ? 'justify-end' : ''}`}>
                                                    {!isCurrentUser && (
                                                        <img
                                                            src={user?.imageUrl}
                                                            alt={message.senderEmail}
                                                            className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                                                        />
                                                    )}
                                                    <div className={`flex-1 max-w-[80%] ${isCurrentUser ? 'ml-12' : 'mr-12'}`}>
                                                        <div className={`flex items-baseline mb-1 ${isCurrentUser ? 'justify-end' : 'justify-between'}`}>
                                                            <div className={`flex items-center space-x-2 ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                                                                <span className="font-medium dark:text-white">{message.userID.split('@')[0]}</span>
                                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    if (message.userID === user?.emailAddresses[0]?.emailAddress) {
                                                                        toast.info("You cannot report your own message", {
                                                                            position: "top-right",
                                                                            autoClose: 3000,
                                                                            theme: theme === 'light' ? 'light' : 'dark',
                                                                        });
                                                                        return;
                                                                    }
                                                                    setSelectedMessage(message);
                                                                    setReportModalOpen(true);
                                                                }}
                                                                className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ${
                                                                    message.userID === user?.emailAddresses[0]?.emailAddress ? 'opacity-50 cursor-not-allowed' : ''
                                                                } ${isCurrentUser ? 'order-1 mr-2' : 'order-2'}`}
                                                                disabled={message.userID === user?.emailAddresses[0]?.emailAddress}
                                                                title={message.userID === user?.emailAddresses[0]?.emailAddress ? 
                                                                    'Cannot report own message' : 
                                                                    'Report message'}
                                                            >
                                                                <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                            </button>
                                                        </div>
                                                        <div className={`p-4 rounded-xl ${
                                                            isCurrentUser 
                                                            ? 'bg-blue-500 text-white' 
                                                            : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                                                        }`}>
                                                            <p className={isCurrentUser ? 'text-white' : 'dark:text-gray-200'}>{message.content}</p>
                                                            
                                                            {message.fileType && message.fileType !== 'none' && message.fileUrl && (
                                                                <div className={`mt-3 border rounded-lg overflow-hidden shadow-sm ${
                                                                    isCurrentUser 
                                                                    ? 'border-blue-400' 
                                                                    : 'border-gray-200 dark:border-gray-600'
                                                                }`}>
                                                                    {message.fileType === 'image' && (
                                                                        <div className={`relative group p-4 ${
                                                                            isCurrentUser 
                                                                            ? 'bg-blue-600' 
                                                                            : 'bg-gray-50 dark:bg-gray-800'
                                                                        } rounded-lg`}>
                                                                            <div className="flex items-center">
                                                                                <div className={`p-3 ${
                                                                                    isCurrentUser 
                                                                                    ? 'bg-blue-700' 
                                                                                    : 'bg-blue-100 dark:bg-blue-900/30'
                                                                                } rounded-lg mr-3`}>
                                                                                    <Image className={`w-8 h-8 ${
                                                                                        isCurrentUser 
                                                                                        ? 'text-white' 
                                                                                        : 'text-blue-500'
                                                                                    }`} />
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <p className={`font-medium text-sm ${
                                                                                        isCurrentUser 
                                                                                        ? 'text-white' 
                                                                                        : 'text-gray-900 dark:text-white'
                                                                                    }`}>
                                                                                        {message.fileName || "Image"}
                                                                                    </p>
                                                                                    <p className={`text-xs ${
                                                                                        isCurrentUser 
                                                                                        ? 'text-blue-200' 
                                                                                        : 'text-gray-500 dark:text-gray-400'
                                                                                    } mt-0.5`}>
                                                                                        Click to view image
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex space-x-2">
                                                                                    <button
                                                                                        onClick={() => message.fileUrl ? setPreviewImage(message.fileUrl) : null}
                                                                                        className={`p-2 rounded-full ${
                                                                                            isCurrentUser 
                                                                                            ? 'bg-blue-700 hover:bg-blue-800' 
                                                                                            : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                                                        }`}
                                                                                        title="View image"
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                                                                            isCurrentUser 
                                                                                            ? 'text-white' 
                                                                                            : 'text-blue-500'
                                                                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                        </svg>
                                                                                    </button>
                                                                                    <a 
                                                                                        href={message.fileUrl} 
                                                                                        download={message.fileName || `image-${Date.now()}.png`}
                                                                                        className={`p-2 rounded-full ${
                                                                                            isCurrentUser 
                                                                                            ? 'bg-blue-700 hover:bg-blue-800' 
                                                                                            : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                                                        }`}
                                                                                        title="Download image"
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                                                                            isCurrentUser 
                                                                                            ? 'text-white' 
                                                                                            : 'text-blue-500'
                                                                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                                        </svg>
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {message.fileType === 'audio' && (
                                                                        <div className={`p-4 ${
                                                                            isCurrentUser 
                                                                            ? 'bg-blue-600' 
                                                                            : 'bg-gray-50 dark:bg-gray-800'
                                                                        } rounded-lg`}>
                                                                            <div className="flex items-center justify-between mb-3">
                                                                                <div className="flex items-center">
                                                                                    <div className={`p-3 ${
                                                                                        isCurrentUser 
                                                                                        ? 'bg-blue-700' 
                                                                                        : 'bg-blue-100 dark:bg-blue-900/30'
                                                                                    } rounded-lg mr-3`}>
                                                                                        <Music className={`w-6 h-6 ${
                                                                                            isCurrentUser 
                                                                                            ? 'text-white' 
                                                                                            : 'text-blue-500'
                                                                                        }`} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className={`font-medium ${
                                                                                            isCurrentUser 
                                                                                            ? 'text-white' 
                                                                                            : 'text-gray-900 dark:text-white'
                                                                                        }`}>
                                                                                            {message.fileName || "Audio File"}
                                                                                        </p>
                                                                                        <p className={`text-xs ${
                                                                                            isCurrentUser 
                                                                                            ? 'text-blue-200' 
                                                                                            : 'text-gray-500 dark:text-gray-400'
                                                                                        } mt-0.5`}>
                                                                                            Audio File
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <a 
                                                                                    href={message.fileUrl} 
                                                                                    download={message.fileName || `audio-${Date.now()}.mp3`}
                                                                                    className={`p-2 rounded-full ${
                                                                                        isCurrentUser 
                                                                                        ? 'bg-blue-700 hover:bg-blue-800' 
                                                                                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                                                    }`}
                                                                                    title="Download audio"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                                                                        isCurrentUser 
                                                                                        ? 'text-white' 
                                                                                        : 'text-blue-500'
                                                                                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                                    </svg>
                                                                                </a>
                                                                            </div>
                                                                            <audio 
                                                                                controls 
                                                                                className="w-full mt-2"
                                                                            >
                                                                                <source src={message.fileUrl} />
                                                                                Your browser does not support the audio element.
                                                                            </audio>
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {message.fileType === 'video' && (
                                                                        <div className={`p-4 ${
                                                                            isCurrentUser 
                                                                            ? 'bg-blue-600' 
                                                                            : 'bg-gray-50 dark:bg-gray-800'
                                                                        } rounded-lg`}>
                                                                            <div className="flex items-center justify-between mb-3">
                                                                                <div className="flex items-center">
                                                                                    <div className={`p-3 ${
                                                                                        isCurrentUser 
                                                                                        ? 'bg-blue-700' 
                                                                                        : 'bg-purple-100 dark:bg-purple-900/30'
                                                                                    } rounded-lg mr-3`}>
                                                                                        <Video className={`w-6 h-6 ${
                                                                                            isCurrentUser 
                                                                                            ? 'text-white' 
                                                                                            : 'text-purple-500'
                                                                                        }`} />
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className={`font-medium ${
                                                                                            isCurrentUser 
                                                                                            ? 'text-white' 
                                                                                            : 'text-gray-900 dark:text-white'
                                                                                        }`}>
                                                                                            {message.fileName || "Video File"}
                                                                                        </p>
                                                                                        <p className={`text-xs ${
                                                                                            isCurrentUser 
                                                                                            ? 'text-blue-200' 
                                                                                            : 'text-gray-500 dark:text-gray-400'
                                                                                        } mt-0.5`}>
                                                                                            Click to play
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                                <a 
                                                                                    href={message.fileUrl} 
                                                                                    download={message.fileName || `video-${Date.now()}.mp4`}
                                                                                    className={`p-2 rounded-full ${
                                                                                        isCurrentUser 
                                                                                        ? 'bg-blue-700 hover:bg-blue-800' 
                                                                                        : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                                                    }`}
                                                                                    title="Download video"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                                                                        isCurrentUser 
                                                                                        ? 'text-white' 
                                                                                        : 'text-purple-500'
                                                                                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                                    </svg>
                                                                                </a>
                                                                            </div>
                                                                            <video 
                                                                                controls 
                                                                                className="max-w-full w-full rounded-lg mt-2"
                                                                            >
                                                                                <source src={message.fileUrl} />
                                                                                Your browser does not support the video element.
                                                                            </video>
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {message.fileType === 'file' && (
                                                                        <div className={`flex items-center p-4 ${
                                                                            isCurrentUser 
                                                                            ? 'bg-blue-600' 
                                                                            : 'bg-gray-50 dark:bg-gray-800'
                                                                        } rounded-lg`}>
                                                                            <div className={`p-3 ${
                                                                                isCurrentUser 
                                                                                ? 'bg-blue-700' 
                                                                                : 'bg-blue-100 dark:bg-blue-900/30'
                                                                            } rounded-lg mr-3`}>
                                                                                <File className={`w-6 h-6 ${
                                                                                    isCurrentUser 
                                                                                    ? 'text-white' 
                                                                                    : 'text-blue-500'
                                                                                }`} />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <p className={`font-medium ${
                                                                                    isCurrentUser 
                                                                                    ? 'text-white' 
                                                                                    : 'text-gray-900 dark:text-white'
                                                                                } text-sm`}>
                                                                                    {message.fileName || (message.content.includes('Shared a file') ? 'Document' : message.content)}
                                                                                </p>
                                                                                <p className={`text-xs ${
                                                                                    isCurrentUser 
                                                                                    ? 'text-blue-200' 
                                                                                    : 'text-gray-500 dark:text-gray-400'
                                                                                } mt-0.5`}>
                                                                                    Click to download
                                                                                </p>
                                                                            </div>
                                                                            <a 
                                                                                href={message.fileUrl} 
                                                                                download={message.fileName || `document-${Date.now()}.pdf`}
                                                                                className={`p-2 rounded-full ${
                                                                                    isCurrentUser 
                                                                                    ? 'bg-blue-700 hover:bg-blue-800' 
                                                                                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                                                }`}
                                                                                title="Download file"
                                                                            >
                                                                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                                                                    isCurrentUser 
                                                                                    ? 'text-white' 
                                                                                    : 'text-blue-500'
                                                                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                                </svg>
                                                                            </a>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                <div className="border-t dark:border-gray-700 p-4">
                                    {selectedFile && (
                                        <div className="mb-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                                            <div className="flex items-center">
                                                {fileType === 'image' && filePreview ? (
                                                    <div className="relative w-12 h-12 mr-3 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                                                        <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : fileType === 'audio' ? (
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                                        <Music className="w-8 h-8 text-blue-500" />
                                                    </div>
                                                ) : fileType === 'video' ? (
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                                                        <Video className="w-8 h-8 text-purple-500" />
                                                    </div>
                                                ) : (
                                                    <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-lg mr-3">
                                                        <File className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-sm font-medium truncate max-w-[200px] block dark:text-white">{selectedFile.name}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {Math.round(selectedFile.size / 1024)} KB
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={clearSelectedFile}
                                                className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-500 hover:text-red-500"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex space-x-2">
                                            <div className="flex-1 p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-2xl bg-gray-50 shadow-sm">
                                                <div className="flex items-center">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        placeholder={loadingMessages ? 'Loading...' : `Message ${selectedGroup?.groupName || 'group'}...`}
                                                        className="flex-1 bg-transparent outline-none py-2 px-3 dark:text-white"
                                                        onKeyPress={(e) => e.key === 'Enter' && !isUploading && handleSendMessage()}
                                                        disabled={loadingMessages || isUploading}
                                                    />
                                                    
                                                    {/* File upload button */}
                                                    <input 
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileSelect}
                                                        className="hidden"
                                                        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                                                        disabled={loadingMessages || isUploading}
                                                    />
                                                    <button
                                                        onClick={() => fileInputRef?.current?.click()}
                                                        disabled={loadingMessages || isUploading}
                                                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-400"
                                                        title="Attach file"
                                                    >
                                                        <Paperclip className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={loadingMessages || isUploading || (!newMessage.trim() && !selectedFile)}
                                                className="p-3 bg-blue-500 text-white rounded-full flex items-center justify-center h-14 w-14 shadow-sm hover:bg-blue-600 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isUploading ? (
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white"></div>
                                                ) : (
                                                    <Send className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Select a Group</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Please select a group from the sidebar to start chatting.
                            </p>
                            <Link to="/community/groups" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                Or Explore Groups
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <ToastContainer />
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => {
                    setReportModalOpen(false);
                    setSelectedMessage(null);
                }}
                onSubmit={handleReport}
                type="message"
                isSubmitting={isSubmittingReport}
            />
        </div>
    );
};

export default Chat;