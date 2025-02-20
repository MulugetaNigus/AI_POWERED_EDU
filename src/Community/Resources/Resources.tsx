import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { Book, FileText, Video, Download, Search, BookOpen, Clock, ThumbsUp, Share2, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@clerk/clerk-react';

interface Resource {
    id: string;
    title: string;
    type: 'document' | 'video' | 'book';
    subject: string;
    grade: number;
    downloads: number;
    likes: number;
    uploadDate: string;
    fileSize?: string;
    duration?: string;
    thumbnail?: string;
    fileUrl?: string;
}

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    onResourceUploaded: () => void;
}

const dummyResources: Resource[] = [
    {
        id: '1',
        title: 'Grade 12 Physics Notes - Mechanics',
        type: 'document',
        subject: 'Physics',
        grade: 12,
        downloads: 156,
        likes: 89,
        uploadDate: '2024-03-15',
        fileSize: '2.5 MB'
    },
    {
        id: '2',
        title: 'Mathematics Formula Sheet',
        type: 'document',
        subject: 'Mathematics',
        grade: 12,
        downloads: 234,
        likes: 167,
        uploadDate: '2024-03-14',
        fileSize: '1.8 MB'
    },
    {
        id: '3',
        title: 'Biology Cell Structure Video Lesson',
        type: 'video',
        subject: 'Biology',
        grade: 11,
        downloads: 89,
        likes: 45,
        uploadDate: '2024-03-13',
        duration: '15:30'
    },
    {
        id: '4',
        title: 'Chemistry Complete Study Guide',
        type: 'book',
        subject: 'Chemistry',
        grade: 12,
        downloads: 312,
        likes: 198,
        uploadDate: '2024-03-12',
        fileSize: '5.2 MB'
    }
];

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onResourceUploaded }) => {

    const [title, setTitle] = useState('');
    const [type, setType] = useState<'document' | 'video' | 'book'>('document');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const { user } = useUser();
    const theme = 'light';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file to upload.", { theme: theme === 'light' ? 'light' : 'dark' });
            return;
        }
        if (!title || !subject || !grade) {
            toast.error("Please fill in all fields.", { theme: theme === 'light' ? 'light' : 'dark' });
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('type', type);
            formData.append('subject', subject);
            formData.append('grade', String(grade));
            formData.append('resourceFile', file);
            formData.append('userID', user?.emailAddresses[0]?.emailAddress || 'unknown-user');

            const response = await axios.post('http://localhost:8888/api/v1/uploadResource', formData,
                // {
                //     headers: {
                //         'Content-Type': 'multipart/form-data',
                //     },
                // }
            );

            if (response.status === 200) {
                toast.success("Resource uploaded successfully!", { theme: theme === 'light' ? 'light' : 'dark' });
                onClose();
                onResourceUploaded();
                resetForm();
            } else {
                toast.error("Failed to upload resource.", { theme: theme === 'light' ? 'light' : 'dark' });
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload resource. Please try again.", { theme: theme === 'light' ? 'light' : 'dark' });
        } finally {
            setUploading(false);
        }
    };

    // to reset our form after successfully upload 
    const resetForm = () => {
        setTitle('');
        setType('document');
        setSubject('');
        setGrade(null);
        setFile(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none bg-gray-500 bg-opacity-40 dark:bg-gray-800 dark:bg-opacity-60">
            <div className="relative w-auto max-w-md mx-auto my-6">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg relative flex flex-col w-full outline-none focus:outline-none"
                >
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl flex items-center justify-between">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Share a Resource
                        </h3>
                        <button
                            className="p-1 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                            onClick={onClose}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative p-6 flex-auto">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Resource Title"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Type</label>
                                <select
                                    id="type"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as 'document' | 'video' | 'book')}
                                    required
                                >
                                    <option value="document">Document</option>
                                    <option value="video">Video</option>
                                    <option value="book">Book</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Subject</label>
                                <input
                                    id="subject"
                                    type="text"
                                    placeholder="Subject"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="grade" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Grade</label>
                                <select
                                    id="grade"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                                    value={grade !== null ? String(grade) : ''}
                                    onChange={(e) => setGrade(e.target.value ? Number(e.target.value) : null)}
                                    required
                                >
                                    <option value="">Select Grade</option>
                                    {[9, 10, 11, 12].map(grade => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="file" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">File Upload</label>
                                <input
                                    id="file"
                                    type="file"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-end p-6 rounded-b-xl">
                                <button
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                    type="button"
                                    onClick={onClose}
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`bg-blue-600 text-white font-bold py-2 px-4 rounded-lg ml-3 focus:outline-none focus:shadow-outline hover:bg-blue-700 transition-colors duration-200 ${uploading ? 'opacity-50 cursor-wait' : ''}`}
                                    type="submit"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Resource'}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const Resources: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<'all' | 'document' | 'video' | 'book'>('all');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [resources, setResources] = useState<Resource[]>(dummyResources);
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8888/api/v1/getResources');
            setResources(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching resources:", error);
            toast.error("Failed to load resources.", { theme: 'light' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGrade = selectedGrade ? resource.grade === selectedGrade : true;
        const matchesType = selectedType === 'all' ? true : resource.type === selectedType;
        return matchesSearch && matchesGrade && matchesType;
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'document':
                return <FileText className="w-6 h-6" />;
            case 'video':
                return <Video className="w-6 h-6" />;
            case 'book':
                return <Book className="w-6 h-6" />;
            default:
                return <FileText className="w-6 h-6" />;
        }
    };

    const ResourcesSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>

                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />

                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="pb-28">
                <Header />
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold dark:text-white">Learning Resources</h1>
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                        Share Resource
                    </button>
                </div>

                <div className="mb-8 space-y-4">
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                        <Search className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            className="flex-1 bg-transparent border-none focus:outline-none dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <select
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2"
                            onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">All Grades</option>
                            {[9, 10, 11, 12].map(grade => (
                                <option key={grade} value={grade}>Grade {grade}</option>
                            ))}
                        </select>

                        <select
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2"
                            onChange={(e) => setSelectedType(e.target.value as any)}
                        >
                            <option value="all">All Types</option>
                            <option value="document">Documents</option>
                            <option value="video">Videos</option>
                            <option value="book">Books</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <ResourcesSkeleton />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        {getIcon(resource.type)}
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {resource.subject} • Grade {resource.grade}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-semibold mb-2 dark:text-white">{resource.title}</h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {resource.fileSize && (
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" />
                                                {resource.fileSize}
                                            </span>
                                        )}
                                        {resource.duration && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {resource.duration}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Download className="w-4 h-4" />
                                                {resource.downloads}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <ThumbsUp className="w-4 h-4" />
                                                {resource.likes}
                                            </span>
                                        </div>
                                        {resource.type === "video" || resource.type === 'document' || resource.type === 'book' ? (
                                            <a
                                                href={resource.fileUrl}
                                                download={resource.title}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </a>
                                        ) : (
                                            <button
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                disabled
                                            >
                                                Download
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    onResourceUploaded={fetchResources}
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
                // theme={theme === 'light' ? 'light' : 'dark'}
                />
            </main>
        </div>
    );
};

export default Resources; 