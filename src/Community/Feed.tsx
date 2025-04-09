import React, { useEffect, useState } from "react";
import { Clock, MessageCircle, User, MoreVertical, Globe, Users, Lock, PlusCircle } from 'lucide-react';
import axios from 'axios';
import img1 from './Assets/HeroOne.png';
import ReportModal from '../components/ReportModal';
import { toast, ToastContainer } from 'react-toastify';
import { useUser } from "@clerk/clerk-react";
import { formatDistanceToNow, format } from "date-fns";

// Configuration
const BASE_URL = "http://localhost:8888";
const API_URL = `${BASE_URL}/api/v1`;

interface Post {
  _id: string;
  userID: string;
  title: string;
  content: string;
  tags: string[];
  likes: number;
  dislikes: number;
  images: string[];
  visibility: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  email?: string;
  role?: string;
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const { user } = useUser();
  const theme = 'light';

  useEffect(() => {
    fetchPosts();
  }, []);

  // Debug logs for post images
  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach(post => {
        if (post.images && post.images.length > 0) {
          console.log(`Post ${post._id} has images:`, post.images);
        }
      });
    }
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/getPost`);
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

  const handleReport = async (reason: string, details: string) => {
    setIsSubmittingReport(true);
    try {
      await axios.post(`${API_URL}/reportSpam`, {
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

  const handleLike = async (postId: string, currentLikes: number) => {
    try {
      // Check if the post is already liked by the user
      const isLiked = likedPosts.has(postId);
      
      // If already liked, prevent the user from updating
      if (isLiked) {
        toast.info('You have already liked this post', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === 'light' ? 'light' : 'dark',
        });
        return;
      }
      
      // Add like
      const response = await axios.post(`${API_URL}/updateLikes/${postId}`, {
        increment: 1,
        currentLikes: currentLikes,
      });
      
      // for debugging purposes
      console.log(response);
      
      // Improvement suggestion: Check the response data
      // The backend returns { success: true, data: updatedPost }
      if (response.data.success) {
        // Update the liked posts set
        const newLikedPosts = new Set(likedPosts);
        newLikedPosts.add(postId); // Add to liked posts
        setLikedPosts(newLikedPosts);
        
        toast.success('Post liked successfully', {
          position: "top-right",
          autoClose: 300,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: theme === 'light' ? 'light' : 'dark',
        });
        fetchPosts();
      }

    } catch (error: any) {
      console.error('Error liking post:', error);

      // Improvement: More specific error handling
      let errorMessage = 'Failed to like post';
      if (error.response) {
        // Handle specific backend errors
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid request';
            break;
          case 404:
            errorMessage = 'Post not found';
            break;
          case 409:
            errorMessage = 'Likes count has changed';
            break;
          default:
            errorMessage = error.response.data.message || 'Failed to like post';
        }
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 300,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: theme === 'light' ? 'light' : 'dark',
      });
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
      
      {posts.length === 0 ? (
        // Empty state with iframe Lottie animation
        <div className="flex flex-col items-center justify-center py-10 px-4 overflow-hidden">
          <div className="w-full h-72 mb-4">
            <iframe 
              src="https://lottie.host/embed/13390110-b1cf-4da3-8743-dd158a83ce4e/ZawlSj53Cx.lottie" 
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="No posts animation"
              allowFullScreen
            ></iframe>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            No Posts Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
            Be the first to share your thoughts with the community or check back later for updates!
          </p>
          <button 
            onClick={() => {
              // Scroll to post creation component
              const postCreation = document.getElementById('post-creation');
              if (postCreation) {
                postCreation.scrollIntoView({ behavior: 'smooth' });
                // If there's an expandPostForm state in PostCreation component, we can try to set it
                const postCreationEvent = new CustomEvent('expand-post-form');
                document.dispatchEvent(postCreationEvent);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Create a Post
          </button>
        </div>
      ) : (
        // Show posts when available
        posts.map((post) => (
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
                  
                  {/* Show visibility indicator */}
                  {post.visibility && (
                    <div className="flex items-center mt-1">
                      {post.visibility === 'public' && (
                        <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Globe className="w-3 h-3 mr-1" /> Public
                        </span>
                      )}
                      {post.visibility === 'friends' && (
                        <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Users className="w-3 h-3 mr-1" /> Friends
                        </span>
                      )}
                      {post.visibility === 'private' && (
                        <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Lock className="w-3 h-3 mr-1" /> Only Me
                        </span>
                      )}
                    </div>
                  )}
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
                  className={`p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full ${post.userID === user?.emailAddresses[0]?.emailAddress ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  disabled={post.userID === user?.emailAddresses[0]?.emailAddress}
                  title={post.userID === user?.emailAddresses[0]?.emailAddress ?
                    'Cannot report own post' :
                    'Report post'}
                >
                  <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Post Title - New */}
              {post.title && (
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {post.title}
                </h2>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Rich Content - render HTML */}
              <div 
                className="prose dark:prose-invert max-w-none mb-4 text-gray-800 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Images - Display actual images from paths or default if none */}
              {post.images && post.images.length > 0 ? (
                <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-4`}>
                  {post.images.map((imagePath, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg group">
                      <img 
                        src={`${BASE_URL}${imagePath}`} 
                        alt={`Post image ${index + 1}`} 
                        className="w-full h-60 object-cover rounded-lg transition-transform hover:scale-105 duration-300"
                        onError={(e) => {
                          // Fallback to default image if loading fails
                          e.currentTarget.src = img1;
                          console.log(`Failed to load image at path: ${imagePath}`);
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <a 
                          href={`${BASE_URL}${imagePath}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          View Full Image
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Show default image if no images are available
                <img src={img1} alt="post-image" className="rounded-lg w-full h-48 object-cover mb-4" />
              )}

              {/* Timestamp and Interactions */}
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 pt-3 border-t dark:border-gray-700">
                {/* Like button and comment button */}
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleLike(post._id, post.likes)}
                    className={`transition-all duration-200 ease-in-out ${likedPosts.has(post._id) ? 'cursor-not-allowed' : 'hover:text-blue-600'}`}
                    title={likedPosts.has(post._id) ? "You already liked this post" : "Like this post"}
                    disabled={likedPosts.has(post._id)}
                  >
                    <div className="flex items-center gap-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill={likedPosts.has(post._id) ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke={likedPosts.has(post._id) ? "#2563eb" : "currentColor"} 
                        className={`w-5 h-5 ${likedPosts.has(post._id) ? "text-blue-600" : "text-gray-500"}`}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" 
                        />
                      </svg>
                      <span className={`text-sm ${likedPosts.has(post._id) ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                        {post.likes || 0}
                      </span>
                    </div>
                  </button>
                  
                  {/* Comment button */}
                  <button disabled className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Comment</span>
                  </button>
                </div>

                {/* Date and time on the right */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm" title={format(new Date(post.createdAt), "PPpp")}>
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
      
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
