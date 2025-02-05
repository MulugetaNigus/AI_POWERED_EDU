import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import axios from 'axios'; // Import axios
import { useUser } from '@clerk/clerk-react'; // Import useUser from Clerk
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import { Group } from 'lucide-react';

interface Message {
    id: number;
    content: string; // Changed from text to content to match backend
    senderEmail: string;
    senderProfilePic: string;
    timestamp: string;
    userID: string;
    createdAt: string;
}

interface Group {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupMember: string[];
    groupCreator: string;
    profilePicture: string;
    approval: boolean;
}

const dummyGroups: Group[] = [
    {
        id: 1,
        name: 'Math Enthusiasts',
        description: 'A group for math lovers!',
        memberCount: 1250,
        groupProfilePic: 'https://cdn-icons-png.freepik.com/256/3976/3976555.png'
    },
    {
        id: 2,
        name: 'Code Wizards',
        description: 'Discuss programming and tech.',
        memberCount: 875,
        groupProfilePic: 'https://cdn-icons-png.freepik.com/256/971/971639.png?w=740'
    },
    {
        id: 3,
        name: 'Book Club',
        description: 'Reading and discussing books together.',
        memberCount: 540,
        groupProfilePic: 'https://cdn-icons-png.freepik.com/256/4814/4814547.png?w=740'
    },
];

const dummyMessages: Message[] = [
    { id: 1, text: 'Hey everyone! Welcome to the group!', senderEmail: 'admin@group.com', senderProfilePic: 'https://i.pravatar.cc/40?img=1', timestamp: '10:00 AM' },
    { id: 2, text: 'Thanks for having me!', senderEmail: 'user1@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=2', timestamp: '10:05 AM' },
    { id: 3, text: 'Looking forward to the discussions!', senderEmail: 'user2@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=3', timestamp: '10:07 AM' },
    // Add 9 more dummy messages here...
    { id: 4, text: 'This is another message.', senderEmail: 'user1@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=2', timestamp: '10:10 AM' },
    { id: 5, text: 'And yet another one!', senderEmail: 'admin@group.com', senderProfilePic: 'https://i.pravatar.cc/40?img=1', timestamp: '10:12 AM' },
    { id: 6, text: 'Hello world!', senderEmail: 'user2@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=3', timestamp: '10:15 AM' },
    { id: 7, text: 'React is awesome.', senderEmail: 'user1@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=2', timestamp: '10:20 AM' },
    { id: 8, text: 'Tailwind CSS is great for styling.', senderEmail: 'admin@group.com', senderProfilePic: 'https://i.pravatar.cc/40?img=1', timestamp: '10:25 AM' },
    { id: 9, text: 'Let\'s discuss the latest math problem.', senderEmail: 'user2@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=3', timestamp: '10:30 AM' },
    { id: 10, text: 'Agreed!', senderEmail: 'user1@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=2', timestamp: '10:35 AM' },
    { id: 11, text: 'What do you think about calculus?', senderEmail: 'admin@group.com', senderProfilePic: 'https://i.pravatar.cc/40?img=1', timestamp: '10:40 AM' },
    { id: 12, text: 'Calculus is fundamental.', senderEmail: 'user2@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=3', timestamp: '10:45 AM' },
];

const Chat: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const { user } = useUser();
    const theme = 'light';

    // Fetch groups and filter them based on rules
    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8888/api/v1/getGroup');
                const allGroups = response.data;
                const userEmail = user?.emailAddresses[0]?.emailAddress;

                // Filter groups based on approval, membership, and creator
                const filteredGroups = allGroups.filter((group: Group) => {
                    // Rule 1: Group must be approved
                    const isApproved = group.approval === true;
                    
                    // Rule 2: Current user must be a member
                    const isMember = group.members?.includes(userEmail);

                    // Rule 3: Current user is the group creator
                    const isCreator = group.groupCreator === userEmail;

                    // Group is shown if it's approved AND (user is a member OR is the creator)
                    return isApproved && (isMember || isCreator);
                });

                setGroups(filteredGroups);
                
                // Set the first group as selected if available
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
        if (newMessage.trim()) {
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
                const response = await axios.post('http://localhost:8888/api/v1/sendChat', {
                    content: newMessage,
                    userID: userEmail,
                    groupID: groupId,
                });

                if (response.status === 200) {
                    const sentMessage = response.data; // Assuming backend returns the sent message object
                    // Update messages state by appending the newly sent message
                    setMessages(prevMessages => [...prevMessages, sentMessage]);
                    setNewMessage('');
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
            }
        }
    };

    const handleGroupChange = async (group: Group) => {
        setSelectedGroup(group);
        setLoadingMessages(true);
        try {
            const response = await axios.get(`http://localhost:8888/api/v1/getGroupID?groupID=${group.groupName}`);
            if (response.status === 200) {
                const fetchedMessages = response.data;
                setMessages(fetchedMessages);
            } else {
                toast.error(`Failed to fetch messages for ${group.groupName}. Please try again.`, {
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
            console.error("Error fetching messages:", error);
            toast.error(`Failed to fetch messages for ${group.groupName}. Please try again.`, {
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
            setLoadingMessages(false);
        }
    };

    return (
        <div className="h-screen flex dark:bg-gray-900">
            {/* Header Placeholder */}
            <div id="header-placeholder" className="pb-28 w-full absolute top-0 left-0">
                <Header />
            </div>

            <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden mt-28">
                {/* Group List Section */}
                <aside className="w-full md:w-1/5 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-y-auto h-full md:h-[calc(100vh - 140px)]">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold dark:text-white mb-3">My Groups</h3>
                        {loading ? (
                            // Add loading skeleton here
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
                                        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer 
                                            ${selectedGroup?._id === group._id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                                        onClick={() => handleGroupChange(group)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={group.profilePicture}
                                                alt={group.groupName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <span className="dark:text-white">{group.groupName}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>

                {/* Main Content: Group Info and Chat Section */}
                <div className="flex-1 flex flex-col  overflow-hidden">
                    {/* Group Info Section */}
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
                                    <p className="text-gray-500 dark:text-gray-400">{selectedGroup?.groupMember.length} members</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="dark:text-gray-300 text-sm">
                                🧮 {selectedGroup?.groupDescription}
                            </p>
                            <div className="flex items-center space-x-2">
                                <span className="dark:text-gray-400 text-sm">Created:</span>
                                <span className="dark:text-gray-300 text-sm">January 2024</span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="flex-1 flex flex-col dark:bg-gray-800 bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loadingMessages ? (
                                <div className="text-center dark:text-white">Loading messages...</div>
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
                                                <div>
                                                    <span className="font-medium dark:text-white">{message.userID}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{new Date(message.createdAt).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                                <p className="dark:text-gray-200">{message.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="border-t dark:border-gray-700 p-4">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder={`Message ${selectedGroup?.groupName}...`}
                                    className="flex-1 p-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ToastContainer />
        </div>
    );
};

export default Chat;