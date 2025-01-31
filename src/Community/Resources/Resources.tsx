import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { Book, FileText, Video, Download, Search, BookOpen, Clock, ThumbsUp, Share2, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
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

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Here you would implement your file upload logic
            // For example, using FormData to send to your backend
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('subject', subject);
            formData.append('grade', grade);
            if (file) {
                formData.append('file', file);
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Reset form
            setTitle('');
            setDescription('');
            setSubject('');
            setGrade('');
            setFile(null);
            onClose();
        } catch (error) {
            console.error('Error uploading resource:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 dark:text-white">Share a Resource</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Subject
                                    </label>
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Select Subject</option>
                                        <option value="mathematics">Mathematics</option>
                                        <option value="physics">Physics</option>
                                        <option value="chemistry">Chemistry</option>
                                        <option value="biology">Biology</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Grade
                                    </label>
                                    <select
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                                        required
                                    >
                                        <option value="">Select Grade</option>
                                        {[9, 10, 11, 12].map(g => (
                                            <option key={g} value={g}>Grade {g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Upload File
                                </label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-sm">
                                            {file ? file.name : 'Click to upload or drag and drop'}
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                        Uploading...
                                    </div>
                                ) : (
                                    'Share Resource'
                                )}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Resources: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [selectedType, setSelectedType] = useState<'all' | 'document' | 'video' | 'book'>('all');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const filteredResources = dummyResources.filter(resource => {
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="pb-28">
                <Header />
            </div>

            <main className="container mx-auto px-4 py-8">
                {/* Add Share Resource button */}
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

                {/* Search and Filters */}
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
                        {/* Grade Filter */}
                        <select
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2"
                            onChange={(e) => setSelectedGrade(e.target.value ? Number(e.target.value) : null)}
                        >
                            <option value="">All Grades</option>
                            {[9, 10, 11, 12].map(grade => (
                                <option key={grade} value={grade}>Grade {grade}</option>
                            ))}
                        </select>

                        {/* Type Filter */}
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

                {/* Resources Grid */}
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
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Share Modal */}
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                />
            </main>
        </div>
    );
};

export default Resources; 