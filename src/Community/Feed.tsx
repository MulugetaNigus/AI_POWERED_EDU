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
        <div className="mt-0 mb-4"> {/* Added margin-bottom */}
          <p className="text-gray-700 dark:text-gray-300 text-2xl font-semibold">Community Posts</p> {/* Adjusted font weight and color */}
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"> {/* Adjusted background and border */}
            <div className="p-5 animate-pulse"> {/* Adjusted padding */}
              {/* User Profile Section Skeleton */}
              <div className="flex items-center gap-3 mb-4"> {/* Removed border-bottom */}
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full" /> {/* Adjusted size and color */}
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" /> {/* User name skeleton */}
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4" /> {/* Timestamp/Visibility skeleton */}
                </div>
              </div>

              {/* Title Skeleton */}
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3" />

              {/* Tags Skeleton */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded-full" />
                <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>

              {/* Content Skeleton */}
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
              </div>

              {/* Image Skeleton */}
              <div className="w-full h-56 bg-gray-300 dark:bg-gray-600 rounded-md mb-4" /> {/* Adjusted height and rounding */}

              {/* Footer Skeleton */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700"> {/* Adjusted padding and border */}
                <div className="flex gap-4">
                  <div className="h-5 w-16 bg-gray-300 dark:bg-gray-600 rounded" /> {/* Like button skeleton */}
                  <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded" /> {/* Comment button skeleton */}
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24" /> {/* Timestamp skeleton */}
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
      <div className="mt-0 mb-4"> {/* Added margin-bottom */}
        <p className="text-gray-700 dark:text-gray-300 text-2xl font-semibold">Community Posts</p> {/* Adjusted font weight and color */}
      </div>

      {posts.length === 0 ? (
        // Empty state with iframe Lottie animation
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"> {/* Added background, padding, shadow, border */}
          <div className="w-full max-w-xs h-64 mb-6"> {/* Adjusted size and margin */}
            <iframe
              src="https://lottie.host/embed/13390110-b1cf-4da3-8743-dd158a83ce4e/ZawlSj53Cx.lottie"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="No posts animation"
              allowFullScreen
            ></iframe>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            No Posts Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm"> {/* Adjusted max-width */}
            It's quiet here... Be the first to share something with the community!
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
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800" // Adjusted padding and added focus styles
          >
            <PlusCircle className="w-5 h-5" />
            Create a Post
          </button>
        </div>
      ) : (
        // Show posts when available
        posts.map((post) => (
          <div key={post._id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition hover:shadow-md"> {/* Adjusted background, border, hover effect */}
            <div className="p-5"> {/* Adjusted padding */}
              {/* User Profile Section */}
              <div className="flex items-start gap-3 mb-4"> {/* Use items-start for alignment, removed border */}
                <div className="flex-shrink-0 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" /> {/* Slightly larger icon */}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 dark:text-white block"> {/* Use block for better spacing */}
                    {post.userID.split('@')[0]} {/* Display username part of email */}
                  </span>
                  {/* Timestamp and Visibility combined */}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5"> {/* Reduced margin-top */}
                    <span title={format(new Date(post.createdAt), "PPpp")}>
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                    {post.visibility && (
                      <>
                        <span className="mx-1.5">&middot;</span> {/* Separator */}
                        {post.visibility === 'public' && (
                          <span className="flex items-center">
                            <Globe className="w-3 h-3 mr-1" /> Public
                          </span>
                        )}
                        {post.visibility === 'friends' && (
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" /> Friends
                          </span>
                        )}
                        {post.visibility === 'private' && (
                          <span className="flex items-center">
                            <Lock className="w-3 h-3 mr-1" /> Only Me
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* Report Button - Icon Only */}
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
                  className={`p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 ${post.userID === user?.emailAddresses[0]?.emailAddress ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  disabled={post.userID === user?.emailAddresses[0]?.emailAddress}
                  title={post.userID === user?.emailAddresses[0]?.emailAddress ?
                    'Cannot report own post' :
                    'Report post'}
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Post Title */}
              {post.title && (
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2"> {/* Adjusted size and margin */}
                  {post.title}
                </h2>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-3 flex-wrap"> {/* Adjusted margin */}
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium"> {/* Adjusted padding, size, color */}
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Rich Content */}
              <div
                className="prose prose-sm sm:prose dark:prose-invert max-w-none mb-4 text-gray-700 dark:text-gray-300" /* Adjusted text color and prose size */
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-4`}>
                  {post.images.map((imagePath, index) => (
                    <div key={index} className="relative overflow-hidden rounded-md group aspect-video"> {/* Use aspect-video for consistency, adjusted rounding */}
                      <img
                        src={`${BASE_URL}${imagePath}`}
                        alt={`Post image ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Ensure image covers container, adjusted hover
                        onError={(e) => {
                          e.currentTarget.src = img1; // Fallback
                          e.currentTarget.parentElement?.classList.add('bg-gray-100', 'dark:bg-gray-700'); // Add background on error
                          console.log(`Failed to load image at path: ${imagePath}`);
                        }}
                      />
                      <a
                        href={`${BASE_URL}${imagePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                        aria-label="View full image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                        </svg>
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {/* Removed default image display when no images are present */}

              {/* Interactions */}
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700"> {/* Adjusted padding and border */}
                {/* Like and Comment buttons */}
                <div className="flex items-center gap-4"> {/* Increased gap */}
                  <button
                    onClick={() => handleLike(post._id, post.likes)}
                    className={`flex items-center gap-1.5 group transition-colors duration-200 ease-in-out ${likedPosts.has(post._id) ? 'text-blue-600 cursor-not-allowed' : 'hover:text-blue-600 dark:hover:text-blue-500'}`}
                    title={likedPosts.has(post._id) ? "You already liked this post" : "Like this post"}
                    disabled={likedPosts.has(post._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={likedPosts.has(post._id) ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`w-5 h-5 ${likedPosts.has(post._id) ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500'}`} // Conditional coloring
                    >
                      {/* Simplified Like Icon Path */}
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H5.904M6.633 10.5l-1.07-1.07m1.07 1.07v7.875M5.563 18.375a12.001 12.001 0 00-1.423-.23H2.25a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25h1.586a12.001 12.001 0 011.423.23l1.07 1.07M6.633 10.5H14.25" />
                    </svg>
                    <span className={`text-sm font-medium ${likedPosts.has(post._id) ? "text-blue-600" : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"}`}> {/* Adjusted font weight and color */}
                      {post.likes || 0}
                    </span>
                  </button>

                  {/* Comment button */}
                  <button disabled className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors cursor-not-implemented" title="Comments coming soon"> {/* Added tooltip */}
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
                {/* Timestamp moved to user info section */}
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
