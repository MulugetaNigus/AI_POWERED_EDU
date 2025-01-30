import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';

interface Message {
    id: number;
    text: string;
    senderEmail: string;
    senderProfilePic: string;
    timestamp: string;
}

const dummyMessages: Message[] = [
    { id: 1, text: 'Hey everyone! Welcome to the group!', senderEmail: 'admin@group.com', senderProfilePic: 'https://i.pravatar.cc/40?img=1', timestamp: '10:00 AM' },
    { id: 2, text: 'Thanks for having me!', senderEmail: 'user1@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=2', timestamp: '10:05 AM' },
    { id: 3, text: 'Looking forward to the discussions!', senderEmail: 'user2@example.com', senderProfilePic: 'https://i.pravatar.cc/40?img=3', timestamp: '10:07 AM' },
    // Add 9 more dummy messages here...
];

const Chat: React.FC = () => {
    const [messages, setMessages] = useState(dummyMessages);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg: Message = {
                id: messages.length + 1,
                text: newMessage,
                senderEmail: 'me@example.com', // Replace with logged-in user's email
                senderProfilePic: 'https://i.pravatar.cc/40?img=4',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <div className="h-screen flex flex-col dark:bg-gray-900">
            {/* Header Placeholder */}
            <div id="header-placeholder" className="pb-28">
                <Header />
            </div>

            <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
                {/* Group Info Section */}
                <div className="w-full md:w-1/4 dark:bg-gray-800 bg-white shadow-lg rounded-lg p-4 h-fit md:h-full">
                    <div className="flex flex-col items-center mb-4">
                        <img
                            src="https://cdn-icons-png.freepik.com/256/3976/3976555.png"
                            alt="Group Profile"
                            className="w-20 h-20 rounded-full mb-3"
                        />
                        <h2 className="text-xl font-bold dark:text-white">Math Enthusiasts</h2>
                        <p className="text-gray-500 dark:text-gray-400">1,250 members</p>
                    </div>

                    <div className="space-y-2">
                        <p className="dark:text-gray-300 text-sm">
                            🧮 A group for math lovers to discuss everything from basic algebra to advanced calculus!
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
                        {messages.map((message) => (
                            <div key={message.id} className="flex items-start space-x-3">
                                <img
                                    src={message.senderProfilePic}
                                    alt={message.senderEmail}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium dark:text-white">{message.senderEmail}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
                                    </div>
                                    <div className="mt-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <p className="dark:text-gray-200">{message.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t dark:border-gray-700 p-4">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type your message..."
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
            </main>
        </div>
    );
};

export default Chat;