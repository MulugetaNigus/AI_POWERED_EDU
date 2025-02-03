import React, { useEffect, useState } from "react";
import { Clock, MessageCircle, User } from 'lucide-react';
import axios from 'axios';
import img1 from './Assets/HeroOne.png';

interface Post {
  _id: string;
  userID: string;
  content: string;
  tags: string[];
  likes: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  userName?: string; // Optional user name field
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/v1/getPost');
        // Filter only approved posts
        const approvedPosts = response.data.filter((post: Post) => post.approved);
        setPosts(approvedPosts);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6 p-1">
      <div className="mt-0">
        <p className="text-gray-600 text-2xl font-bold">Community Posts</p>
      </div>
      {posts.map((post) => (
        <div key={post._id} 
          className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 transition hover:shadow-xl">
          <div className="p-6">
            {/* User Profile Section */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b dark:border-gray-700">
              <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/30">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {post.userID.split('@')[0]} {/* Display username part of email */}
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Content */}
            <p className="text-gray-800 dark:text-gray-300 mb-4">
              {post.content.slice(0, 100)}
              {post.content.length > 100 && "..."}
            </p>

            {/* Default Image */}
            <img src={img1} alt="post-image" className="rounded-lg w-full object-cover h-48 mb-4" />

            {/* Timestamp and Email */}
            <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-3 border-t dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.userID}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
