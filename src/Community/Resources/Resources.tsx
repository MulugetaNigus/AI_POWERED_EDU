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
    _id: string;
    filename: string;
    contentType: string;
    length: number;
    id: string; // GridFS file ID
    uploadDate: string;
    approved: boolean;
    metadata: {
        title: string;
        description: string;
        uploadedBy: string;
        downloads: number;
    };
}

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    onResourceUploaded: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

// Add file type mappings for each document type
const FILE_TYPE_MAPPINGS = {
    document: {
        types: {
            'application/pdf': '.pdf',
            'application/msword': '.doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
            'application/vnd.ms-powerpoint': '.ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
            'application/vnd.ms-excel': '.xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
            'text/plain': '.txt'
        },
        description: 'Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT'
    },
    video: {
        types: {
            'video/mp4': '.mp4'
        },
        description: 'Supported format: MP4'
    },
    book: {
        types: {
            'application/pdf': '.pdf',
            'application/epub+zip': '.epub'
        },
        description: 'Supported formats: PDF, EPUB'
    }
};

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onResourceUploaded }) => {

    const [title, setTitle] = useState('');
    const [type, setType] = useState<'document' | 'video' | 'book'>('document');
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);

    const { user } = useUser();
    const theme = 'light';

    const validateFile = (file: File): boolean => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File size must be less than 10MB. Current file size: ${(file.size / 1024 / 1024).toFixed(2)}MB`, {
                theme: theme === 'light' ? 'light' : 'dark'
            });
            return false;
        }

        // Check if file type matches the selected document type
        const allowedTypes = FILE_TYPE_MAPPINGS[type].types;
        if (!Object.keys(allowedTypes).includes(file.type)) {
            toast.error(`Invalid file type for ${type}. ${FILE_TYPE_MAPPINGS[type].description}`, {
                theme: theme === 'light' ? 'light' : 'dark'
            });
            return false;
        }

        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (validateFile(selectedFile)) {
                setFile(selectedFile);
            } else {
                e.target.value = ''; // Reset file input
                setFile(null);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file to upload.", { theme: theme === 'light' ? 'light' : 'dark' });
            return;
        }
        if (!title) {
            toast.error("Please provide a title.", { theme: theme === 'light' ? 'light' : 'dark' });
            return;
        }
        
        // Double-check file size and type before upload
        if (!validateFile(file)) {
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('description', `${subject} - Grade ${grade}`);
            formData.append('userID', user?.emailAddresses[0]?.emailAddress || 'unknown-user');

            const response = await axios.post('http://localhost:8888/api/v1/uploadResource', formData);

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
            <div className="relative w-full max-w-2xl mx-auto my-6">
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
                    <div className="relative p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Resource Title"
                                    className={`shadow appearance-none border ${
                                        title === '' ? 'border-red-500' : 'border-gray-200'
                                    } rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline`}
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="type" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="type"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                                    value={type}
                                    onChange={(e) => {
                                        setType(e.target.value as 'document' | 'video' | 'book');
                                        // Reset file when type changes
                                        setFile(null);
                                        const fileInput = document.getElementById('file') as HTMLInputElement;
                                        if (fileInput) fileInput.value = '';
                                    }}
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="document">Document</option>
                                    <option value="video">Video</option>
                                    <option value="book">Book</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Subject <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    placeholder="Subject"
                                    className={`shadow appearance-none border ${
                                        subject === '' ? 'border-red-500' : 'border-gray-200'
                                    } rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline`}
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="grade" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    Grade <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="grade"
                                    className={`shadow appearance-none border ${
                                        grade === null ? 'border-red-500' : 'border-gray-200'
                                    } rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline`}
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
                                <label htmlFor="file" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                                    File Upload (Max 10MB) <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    <input
                                        id="file"
                                        type="file"
                                        className={`shadow appearance-none border ${
                                            !file ? 'border-red-500' : 'border-gray-200'
                                        } rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline`}
                                        onChange={handleFileChange}
                                        accept={type ? Object.values(FILE_TYPE_MAPPINGS[type].types).join(',') : ''}
                                        required
                                    />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {type ? FILE_TYPE_MAPPINGS[type].description : 'Please select a document type first'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-end pt-6 border-t border-gray-200 dark:border-gray-700 rounded-b">
                                <button
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                    type="button"
                                    onClick={onClose}
                                    disabled={uploading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={`bg-blue-600 text-white font-bold py-2 px-4 rounded-lg ml-3 focus:outline-none focus:shadow-outline hover:bg-blue-700 transition-colors duration-200 inline-flex items-center ${
                                        uploading ? 'opacity-75 cursor-wait' : ''
                                    }`}
                                    type="submit"
                                    disabled={uploading || !title || !subject || grade === null || !file}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Resource
                                        </>
                                    )}
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
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8888/api/v1/getResources');
            setResources(response.data);
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

    const handleDownload = async (resource: Resource) => {
        if (!resource.approved) {
            toast.info("This resource is pending approval from administrators. Please check back later.", { theme: 'light' });
            return;
        }

        setDownloadingId(resource._id);
        try {
            const response = await axios.get(
                `http://localhost:8888/api/v1/resource/${resource.id}`,
                { responseType: 'blob' }
            );

            // Create blob URL and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', resource.filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success("Download started!", { theme: 'light' });
        } catch (error) {
            console.error("Download error:", error);
            toast.error("Failed to download file.", { theme: 'light' });
        } finally {
            setDownloadingId(null);
        }
    };

    const filteredResources = resources.filter(resource => {
        const matchesSearch = (resource.metadata.title.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (resource.metadata.description.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' ? true : resource.contentType.includes(selectedType);
        return matchesSearch && matchesType;
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
                            <div key={resource._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        {getIcon(resource.contentType)}
                                        <span className={`text-sm font-medium text-blue-600 dark:text-blue-400 ${!resource.approved ? 'blur-sm' : ''}`}>
                                            {resource.metadata.description}
                                        </span>
                                    </div>

                                    <h3 className={`text-lg font-semibold mb-2 dark:text-white ${!resource.approved ? 'blur-sm' : ''}`}>
                                        {resource.metadata.title}
                                    </h3>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            {(resource.length / 1024 / 1024).toFixed(2)} MB
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Download className="w-4 h-4" />
                                                {resource.metadata.downloads}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {new Date(resource.uploadDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(resource)}
                                            disabled={downloadingId === resource._id}
                                            className={`px-4 py-2 ${
                                                resource.approved 
                                                    ? 'bg-blue-600 hover:bg-blue-700' 
                                                    : 'bg-gray-400 cursor-not-allowed'
                                            } text-white rounded-lg transition-colors inline-flex items-center ${
                                                downloadingId === resource._id ? 'opacity-75 cursor-wait' : ''
                                            }`}
                                        >
                                            {downloadingId === resource._id ? (
                                                <>
                                                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Downloading...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    {resource.approved ? 'Download' : 'Pending Approval'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {!resource.approved && (
                                        <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                                            This resource is pending administrator approval
                                        </p>
                                    )}
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
                />
            </main>
        </div>
    );
};

export default Resources; 