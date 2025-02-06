import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import Header from '../../components/Header';
import { Calendar, Clock, Users, Video, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Meeting {
    _id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    host: string;
    zoomLink: string;
    participants: string[];
    maxParticipants: number;
}

const LiveSessions: React.FC = () => {
    const { user } = useUser();
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newMeeting, setNewMeeting] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        maxParticipants: 10,
        zoomLink: ''
    });

    // Add expanded dummy data
    const dummyMeetings: Meeting[] = [
        {
            _id: '1',
            title: 'Introduction to React Hooks',
            description: 'Learn the basics of React Hooks and how to implement them in your projects. We will cover useState, useEffect, and custom hooks.',
            date: '2024-03-25',
            time: '10:00',
            host: 'john.doe@example.com',
            zoomLink: 'https://zoom.us/j/123456789',
            participants: ['alice@example.com', 'bob@example.com'],
            maxParticipants: 10
        },
        {
            _id: '2',
            title: 'Advanced TypeScript Patterns',
            description: 'Deep dive into TypeScript advanced types, generics, and design patterns for better type safety.',
            date: '2024-03-26',
            time: '14:00',
            host: 'jane.smith@example.com',
            zoomLink: 'https://zoom.us/j/987654321',
            participants: ['charlie@example.com'],
            maxParticipants: 15
        },
        {
            _id: '3',
            title: 'Building REST APIs with Node.js',
            description: 'Learn how to build scalable REST APIs using Node.js, Express, and MongoDB.',
            date: '2024-03-27',
            time: '16:00',
            host: user?.emailAddresses[0].emailAddress || '',
            zoomLink: 'https://zoom.us/j/456789123',
            participants: [],
            maxParticipants: 20
        },
        {
            _id: '4',
            title: 'Machine Learning Fundamentals',
            description: 'Introduction to machine learning concepts, algorithms, and practical applications using Python.',
            date: '2024-03-28',
            time: '09:00',
            host: 'ml.expert@example.com',
            zoomLink: 'https://zoom.us/j/111222333',
            participants: ['student1@example.com', 'student2@example.com', 'student3@example.com'],
            maxParticipants: 25
        },
        {
            _id: '5',
            title: 'Mobile App UI/UX Design',
            description: 'Best practices for designing intuitive and engaging mobile app interfaces using Figma.',
            date: '2024-03-29',
            time: '13:00',
            host: 'designer@example.com',
            zoomLink: 'https://zoom.us/j/444555666',
            participants: ['designer1@example.com'],
            maxParticipants: 12
        },
        {
            _id: '6',
            title: 'Cloud Architecture Workshop',
            description: 'Designing scalable and resilient cloud architectures using AWS services.',
            date: '2024-03-30',
            time: '11:00',
            host: user?.emailAddresses[0].emailAddress || '',
            zoomLink: 'https://zoom.us/j/777888999',
            participants: ['cloud1@example.com', 'cloud2@example.com'],
            maxParticipants: 15
        },
        {
            _id: '7',
            title: 'DevOps Best Practices',
            description: 'Learn about CI/CD pipelines, containerization, and infrastructure as code.',
            date: '2024-03-31',
            time: '15:00',
            host: 'devops@example.com',
            zoomLink: 'https://zoom.us/j/123123123',
            participants: [],
            maxParticipants: 18
        },
        {
            _id: '8',
            title: 'Flutter App Development',
            description: 'Building cross-platform mobile applications using Flutter and Dart.',
            date: '2024-04-01',
            time: '10:30',
            host: 'flutter.dev@example.com',
            zoomLink: 'https://zoom.us/j/456456456',
            participants: ['mobile1@example.com', 'mobile2@example.com'],
            maxParticipants: 20
        },
        {
            _id: '9',
            title: 'Data Visualization with D3.js',
            description: 'Creating interactive and dynamic data visualizations for the web.',
            date: '2024-04-02',
            time: '14:30',
            host: user?.emailAddresses[0].emailAddress || '',
            zoomLink: 'https://zoom.us/j/789789789',
            participants: ['viz1@example.com'],
            maxParticipants: 15
        },
        {
            _id: '10',
            title: 'Cybersecurity Essentials',
            description: 'Understanding common security threats and implementing protective measures.',
            date: '2024-04-03',
            time: '16:30',
            host: 'security@example.com',
            zoomLink: 'https://zoom.us/j/321321321',
            participants: ['sec1@example.com', 'sec2@example.com', 'sec3@example.com'],
            maxParticipants: 30
        },
        {
            _id: '11',
            title: 'GraphQL API Design',
            description: 'Building efficient and flexible APIs using GraphQL and Apollo Server.',
            date: '2024-04-04',
            time: '11:30',
            host: 'graphql@example.com',
            zoomLink: 'https://zoom.us/j/654654654',
            participants: ['api1@example.com'],
            maxParticipants: 20
        },
        {
            _id: '12',
            title: 'Web Accessibility Workshop',
            description: 'Making web applications accessible to all users following WCAG guidelines.',
            date: '2024-04-05',
            time: '13:30',
            host: user?.emailAddresses[0].emailAddress || '',
            zoomLink: 'https://zoom.us/j/987987987',
            participants: ['a11y1@example.com', 'a11y2@example.com'],
            maxParticipants: 25
        }
    ];

    // Modify the useEffect to use dummy data
    useEffect(() => {
        // Simulate API call
        setLoading(true);
        setTimeout(() => {
            setMeetings(dummyMeetings);
            setLoading(false);
        }, 1000);
    }, []);

    const handleCreateMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8888/api/v1/meetings', {
                ...newMeeting,
                host: user?.emailAddresses[0].emailAddress,
                participants: []
            });
            
            setMeetings([...meetings, response.data]);
            setShowCreateModal(false);
            toast.success('Meeting created successfully!');
        } catch (error) {
            console.error('Error creating meeting:', error);
            toast.error('Failed to create meeting');
        }
    };

    const handleJoinMeeting = async (meetingId: string) => {
        try {
            const response = await axios.post(`http://localhost:8888/api/v1/meetings/${meetingId}/join`, {
                email: user?.emailAddresses[0].emailAddress
            });
            
            // Update meetings list with new participant
            const updatedMeetings = meetings.map(meeting => 
                meeting._id === meetingId ? response.data : meeting
            );
            setMeetings(updatedMeetings);
            toast.success('Successfully joined the meeting!');
        } catch (error) {
            console.error('Error joining meeting:', error);
            toast.error('Failed to join meeting');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            
            <main className="container mx-auto px-4 py-8 mt-20">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold dark:text-white">Live Sessions</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                            transition-colors flex items-center gap-2"
                    >
                        <Video className="w-5 h-5" />
                        Create Session
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meetings.map((meeting) => (
                            <div key={meeting._id} 
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                                    transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <h3 className="text-xl font-semibold mb-2 dark:text-white">{meeting.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">{meeting.description}</p>
                                
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(meeting.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        <span>{meeting.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                        <Users className="w-4 h-4" />
                                        <span>{meeting.participants.length}/{meeting.maxParticipants} participants</span>
                                    </div>
                                </div>

                                {meeting.host === user?.emailAddresses[0].emailAddress ? (
                                    <a
                                        href={meeting.zoomLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                                            transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Video className="w-5 h-5" />
                                        Start Session
                                    </a>
                                ) : meeting.participants.includes(user?.emailAddresses[0].emailAddress || '') ? (
                                    <a
                                        href={meeting.zoomLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                            transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Video className="w-5 h-5" />
                                        Join Session
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => handleJoinMeeting(meeting._id)}
                                        disabled={meeting.participants.length >= meeting.maxParticipants}
                                        className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                                            ${meeting.participants.length >= meeting.maxParticipants
                                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                                    >
                                        <Users className="w-5 h-5" />
                                        Register
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Meeting Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold dark:text-white">Create Live Session</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateMeeting} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newMeeting.title}
                                    onChange={(e) => setNewMeeting({...newMeeting, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                        dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    value={newMeeting.description}
                                    onChange={(e) => setNewMeeting({...newMeeting, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                        dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={newMeeting.date}
                                        onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                            dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={newMeeting.time}
                                        onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                            dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Zoom Link
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={newMeeting.zoomLink}
                                    onChange={(e) => setNewMeeting({...newMeeting, zoomLink: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                        dark:bg-gray-700 dark:text-white"
                                    placeholder="https://zoom.us/j/..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Max Participants
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="100"
                                    value={newMeeting.maxParticipants}
                                    onChange={(e) => setNewMeeting({...newMeeting, maxParticipants: parseInt(e.target.value)})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                        dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                                    transition-colors flex items-center justify-center gap-2"
                            >
                                <Video className="w-5 h-5" />
                                Create Session
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default LiveSessions; 