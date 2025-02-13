import React, { useEffect, useState } from "react";
import { Clock, MessageCircle, User, MoreVertical } from 'lucide-react';
import axios from 'axios';
import img1 from './Assets/HeroOne.png';
import ReportModal from '../components/ReportModal';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from "@clerk/clerk-react";

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
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const { user } = useUser();
  const theme = 'light';

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

  const handleReport = async (reason: string, details: string) => {
    setIsSubmittingReport(true);
    try {
      await axios.post('http://localhost:8888/api/v1/reportSpam', {
        spamMessage: selectedPost?.content,
        reason: reason,
        description: details,
        applyerUserId: user?.emailAddresses[0]?.emailAddress,
        spammerUserId: selectedPost?.userID,
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

  if (loading) {
    return (
      <div className="space-y-6 p-1">
        <div className="mt-0">
          <p className="text-gray-600 text-2xl font-bold">Community Posts</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
            <div className="p-6 animate-pulse">
              {/* User Profile Section Skeleton */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b dark:border-gray-700">
                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              </div>

              {/* Tags Skeleton */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>

              {/* Content Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
              </div>

              {/* Image Skeleton */}
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />

              {/* Footer Skeleton */}
              <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
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
              <div className="flex-1">
                <span className="font-medium text-gray-900 dark:text-white">
                  {post.userID.split('@')[0]} {/* Display username part of email */}
                </span>
              </div>
              <button
                onClick={() => {
                  // Check if the post is from the current user
                  if (post.userID === user?.emailAddresses[0]?.emailAddress) {
                    toast.info("You cannot report your own post", {
                      position: "top-right",
                      autoClose: 3000,
                      theme: theme === 'light' ? 'light' : 'dark',
                    });
                    return;
                  }
                  setSelectedPost(post);
                  setReportModalOpen(true);
                }}
                className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ${
                  post.userID === user?.emailAddresses[0]?.emailAddress ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={post.userID === user?.emailAddresses[0]?.emailAddress}
                title={post.userID === user?.emailAddresses[0]?.emailAddress ? 
                  'Cannot report own post' : 
                  'Report post'}
              >
                <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
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
              {/* {post.content.slice(0, 100)} */}
              {post.content}
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
      <ToastContainer />
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setSelectedPost(null);
        }}
        onSubmit={handleReport}
        type="post"
        isSubmitting={isSubmittingReport}
      />
    </div>
  );
};

export default Feed;
