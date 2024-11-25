import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  EyeIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon 
} from '@heroicons/react/24/solid';

interface ContentItem {
  id: string;
  type: 'message' | 'course' | 'user_content';
  content: string;
  author: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ContentModeration: React.FC = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // TODO: Replace with actual backend endpoint
        const response = await axios.get('/api/admin/content');
        setContent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch content');
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleContentAction = async (contentId: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      // TODO: Replace with actual backend endpoint
      await axios.post(`/api/admin/content/${contentId}`, { action });
      
      setContent(content.map(item => 
        item.id === contentId 
          ? { 
              ...item, 
              status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : item.status 
            }
          : item
      ).filter(item => action !== 'delete' || item.id !== contentId)
      );
      
      setSelectedContent(null);
    } catch (err) {
      setError(`Failed to ${action} content`);
    }
  };

  const handleContentPreview = (content: ContentItem) => {
    setSelectedContent(content);
  };

  if (loading) return <div>Loading content...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Content List */}
      <div className="md:col-span-1 space-y-4">
        {content.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center
              ${item.status === 'pending' ? 'border-l-4 border-yellow-500' : 
                item.status === 'approved' ? 'border-l-4 border-green-500' : 
                'border-l-4 border-red-500'}`}
          >
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white capitalize">
                {item.type}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                {item.content}
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => handleContentPreview(item)}
                className="text-blue-500 hover:text-blue-700"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleContentAction(item.id, 'delete')}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Content Preview and Actions */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {selectedContent ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
                {selectedContent.type} Details
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                By {selectedContent.author} on {new Date(selectedContent.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <pre className="whitespace-pre-wrap break-words text-gray-800 dark:text-white">
                {selectedContent.content}
              </pre>
            </div>

            {selectedContent.status === 'pending' && (
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleContentAction(selectedContent.id, 'approve')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                >
                  <CheckIcon className="h-5 w-5 mr-2" /> Approve
                </button>
                <button 
                  onClick={() => handleContentAction(selectedContent.id, 'reject')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                >
                  <XMarkIcon className="h-5 w-5 mr-2" /> Reject
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            Select a content item to preview
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModeration;
