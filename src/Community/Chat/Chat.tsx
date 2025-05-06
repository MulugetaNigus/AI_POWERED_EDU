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

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8888/api/v1/getGroup');
                const allGroups = response.data;
                const userEmail = user?.emailAddresses[0]?.emailAddress;

                const filteredGroups = allGroups.filter((group: Group) => {
                    const isApproved = group.approval === true;
                    const isMember = group.members?.includes(userEmail);
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

            <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden mt-28">
                <aside className="w-full md:w-1/5 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-y-auto h-full md:h-[calc(100vh - 140px)]">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold dark:text-white mb-3 flex items-center">
                            <Group className="w-5 h-5 text-blue-500 mr-2" />
                            My Groups
                        </h3>
                        
                        <div className="relative mb-4">
                            <input 
                                type="text" 
                                placeholder="Search groups..."
                                className="w-full p-2 pl-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm dark:text-white"
                            />
                            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                        </div>
                        
                        {loading ? (
                            <div className="space-y-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="flex items-center space-x-2 p-2">
                                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : groups.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                                No groups available
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {groups.map((group) => (
                                    <li
                                        key={group._id}
                                        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                                            ${selectedGroup?._id === group._id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div 
                                                className="flex items-center space-x-2 flex-1 cursor-pointer"
                                                onClick={() => handleGroupChange(group)}
                                            >
                                                <img
                                                    src={group.profilePicture}
                                                    alt={group.groupName}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <span className="dark:text-white">{group.groupName}</span>
                                            </div>
                                            
                                            <div className="relative group">
                                                <button 
                                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
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

                <div className="flex-1 flex flex-col  overflow-hidden">
                    <div className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-4 h-fit">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-2">
                            <div className="flex flex-col md:flex-row items-center">
                                <img
                                    src={selectedGroup?.profilePicture}
                                    alt="Group Profile"
                                    className="w-16 h-16 rounded-full mb-3 md:mb-0 md:mr-4"
                                />
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">{selectedGroup?.groupName}</h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {selectedGroup?.members?.length || 0} members
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="dark:text-gray-300 text-sm">
                                {selectedGroup?.groupDescription}
                            </p>
                            <div className="flex items-center space-x-2">
                                <span className="dark:text-gray-400 text-sm">Created:</span>
                                <span className="dark:text-gray-300 text-sm">January 2024</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col dark:bg-gray-800 bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loadingMessages ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-4">
                                    <div className="text-6xl">💭</div>
                                    <p className="text-gray-500 dark:text-gray-400 text-center">
                                        No messages yet. Be the first to start the conversation!
                                    </p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <div key={message.id} className="flex items-start space-x-3">
                                        <img
                                            src={user?.imageUrl}
                                            alt={message.senderEmail}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-baseline justify-between mb-1">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-medium dark:text-white">{message.userID}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {new Date(message.createdAt).toLocaleString()}
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
                                                    }`}
                                                    disabled={message.userID === user?.emailAddresses[0]?.emailAddress}
                                                    title={message.userID === user?.emailAddresses[0]?.emailAddress ? 
                                                        'Cannot report own message' : 
                                                        'Report message'}
                                                >
                                                    <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                </button>
                                            </div>
                                            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                <p className="dark:text-gray-200">{message.content}</p>
                                                
                                                {message.fileType && message.fileType !== 'none' && message.fileUrl && (
                                                    <div className="mt-3 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
                                                        {message.fileType === 'image' && (
                                                            <div className="relative group">
                                                                <img 
                                                                    src={message.fileUrl} 
                                                                    alt={message.fileName || "Shared image"} 
                                                                    className="max-w-full w-full rounded-lg max-h-80 object-contain bg-gray-50 dark:bg-gray-800"
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                    <a 
                                                                        href={message.fileUrl} 
                                                                        download={message.fileName || `image-${Date.now()}.png`}
                                                                        className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                                        title="Download image"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {message.fileType === 'audio' && (
                                                            <div className="p-3 bg-gray-50 dark:bg-gray-800">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="flex items-center">
                                                                        <Music className="w-5 h-5 text-blue-500 mr-2" />
                                                                        <span className="text-sm font-medium dark:text-white">
                                                                            {message.fileName || "Audio File"}
                                                                        </span>
                                                                    </div>
                                                                    <a 
                                                                        href={message.fileUrl} 
                                                                        download={message.fileName || `audio-${Date.now()}.mp3`}
                                                                        className="p-1.5 bg-white dark:bg-gray-700 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                                        title="Download audio"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                                <audio 
                                                                    controls 
                                                                    className="w-full"
                                                                >
                                                                    <source src={message.fileUrl} />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            </div>
                                                        )}
                                                        
                                                        {message.fileType === 'video' && (
                                                            <div className="relative group">
                                                                <video 
                                                                    controls 
                                                                    className="max-w-full w-full rounded-lg"
                                                                >
                                                                    <source src={message.fileUrl} />
                                                                    Your browser does not support the video element.
                                                                </video>
                                                                <div className="absolute top-2 right-2">
                                                                    <a 
                                                                        href={message.fileUrl} 
                                                                        download={message.fileName || `video-${Date.now()}.mp4`}
                                                                        className="p-1.5 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all"
                                                                        title="Download video"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}
                                                        
                                                        {message.fileType === 'file' && (
                                                            <a 
                                                                href={message.fileUrl} 
                                                                download={message.fileName || `document-${Date.now()}.pdf`}
                                                                className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                            >
                                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                                                    <File className="w-6 h-6 text-blue-500" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                                        {message.fileName || (message.content.includes('Shared a file') ? 'Document' : message.content)}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                        Click to download
                                                                    </p>
                                                                </div>
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="border-t dark:border-gray-700 p-4">
                            {selectedFile && (
                                <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center">
                                        {fileType === 'image' && filePreview ? (
                                            <img src={filePreview} alt="Preview" className="w-10 h-10 object-cover rounded mr-2" />
                                        ) : fileType === 'audio' ? (
                                            <Music className="w-10 h-10 text-blue-500 mr-2" />
                                        ) : fileType === 'video' ? (
                                            <Video className="w-10 h-10 text-purple-500 mr-2" />
                                        ) : (
                                            <File className="w-10 h-10 text-gray-500 mr-2" />
                                        )}
                                        <span className="text-sm truncate max-w-[200px] dark:text-white">{selectedFile.name}</span>
                                    </div>
                                    <button 
                                        onClick={clearSelectedFile}
                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                                    >
                                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>
                            )}
                            
                            <div className="flex flex-col space-y-2">
                                <div className="flex space-x-2">
                                    <div className="flex-1 flex items-center space-x-2 p-2 border dark:border-gray-600 dark:bg-gray-700 rounded-lg">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder={loadingMessages ? 'Loading...' : `Message ${selectedGroup?.groupName}...`}
                                            className="flex-1 bg-transparent outline-none dark:text-white"
                                            onKeyPress={(e) => e.key === 'Enter' && !isUploading && handleSendMessage()}
                                            disabled={loadingMessages || isUploading}
                                        />
                                        
                                        {/* File upload button */}
                                        <input 
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            disabled={loadingMessages || isUploading}
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={loadingMessages || isUploading}
                                            className={`p-1.5 rounded-full transition text-gray-500 dark:text-gray-400 ${loadingMessages || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-blue-500'}`}
                                            title="Attach file"
                                        >
                                            <Paperclip className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={loadingMessages || isUploading || (!newMessage.trim() && !selectedFile)}
                                        className={`p-2 bg-blue-500 text-white rounded-lg transition flex items-center justify-center min-w-[40px]
                                            ${(loadingMessages || isUploading || (!newMessage.trim() && !selectedFile))
                                                ? 'opacity-50 cursor-not-allowed' 
                                                : 'hover:bg-blue-600'}`}
                                    >
                                        {isUploading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                
                                {selectedFile && (
                                    <div className="flex items-center justify-between px-1">
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Selected: {selectedFile.name.substring(0, 30)}{selectedFile.name.length > 30 ? '...' : ''}
                                        </div>
                                        <button
                                            onClick={clearSelectedFile}
                                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                            title="Remove file"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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