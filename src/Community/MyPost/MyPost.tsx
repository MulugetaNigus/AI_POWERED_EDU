import React from 'react';
import img1 from '../Assets/p10.png';
import { useUser } from '@clerk/clerk-react';
import Header from '../../components/Header';
import { Eye, Trash, Clock, MessageCircle, Share2, ThumbsUp } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: number;
  timeToRead: string;
  status: string;
}

const MyPost: React.FC<MyPostProps> = ({ profilePicture, name, email, posts }) => {
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      {/* Header Placeholder */}
      <div className="w-full h-20 flex items-center justify-center">
        <Header />
      </div>

      <main className="flex flex-1">
        {/* Left side content */}
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
              <p className="text-gray-500 dark:text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Posts</h3>

          {/* Posts List */}
          {posts.map((post, index) => (
            <div key={index} 
              className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${post.status === 'approved' 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.content.length > 50
                      ? post.content.substring(0, 50) + '...'
                      : post.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">2 hours ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">5 comments</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">12 Likes</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{user?.fullName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right side content */}
        <div className="w-1/4 p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Approved Posts</h3>
          <div className="space-y-4">
            {posts
              .filter(post => post.status === 'approved')
              .map((post, index) => (
                <div key={index} 
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">{user?.fullName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {post.content.length > 50
                          ? post.content.substring(0, 50) + '...'
                          : post.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                        <Trash className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyPost;