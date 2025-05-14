import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import Header from '../../components/Header';
import { Eye, Trash, Clock, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Post {
  _id: string;
  userID: string;
  content: string;
  tags: string[];
  likes: number;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MyPostProps {
  profilePicture?: string;
  name?: string;
  email?: string;
}

interface PostModalProps {
  post: Post | null;
  onClose: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Post Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300">{post.content}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes} likes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyPost: React.FC<MyPostProps> = () => {
  
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [pendingLikes, setPendingLikes] = useState<Set<string>>(new Set());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://extreamx-backend.onrender.com/api/v1/getPost'); // Fetch all posts
        const allPosts = response.data;
        const userEmail = user?.emailAddresses[0]?.emailAddress;

        if (!userEmail) {
          setError('User email not found. Please sign in.');
          setLoading(false);
          return;
        }

        // Filter posts to include only those created by the current user
        const userPosts = allPosts.filter((post: Post) => post.userID === userEmail);
        setPosts(userPosts);

      } catch (err) {
        setError('Failed to fetch posts');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  useEffect(() => {
    // Load liked posts from localStorage on component mount
    const savedLikedPosts = localStorage.getItem('likedPosts');
    if (savedLikedPosts) {
      setLikedPosts(new Set(JSON.parse(savedLikedPosts)));
    }
  }, []);

  const handleLike = async (postId: string) => {
    // Prevent multiple clicks
    if (pendingLikes.has(postId) || likedPosts.has(postId)) return;

    setPendingLikes(prev => new Set([...prev, postId]));

    try {
      // Get the current post first
      const currentPost = posts.find(p => p._id === postId);
      if (!currentPost) return;

      // Make the backend call
      const response = await axios.post(`https://extreamx-backend.onrender.com/api/v1/updateLikes/${postId}`, {
        increment: 1,
        currentLikes: currentPost.likes // Send current likes count to backend
      });

      if (!response.data?.data?.likes) {
        throw new Error('Invalid response from server');
      }

      // Update posts with the exact likes count from server
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId 
          ? { ...post, likes: response.data.data.likes }
          : post
      ));

      // Update liked state
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.add(postId);
        localStorage.setItem('likedPosts', JSON.stringify([...newSet]));
        return newSet;
      });

    } catch (err) {
      console.error('Error updating likes:', err);
      // Refresh the posts to get the correct state
      const refreshResponse = await axios.get('https://extreamx-backend.onrender.com/api/v1/getPost');
      setPosts(refreshResponse.data);
    } finally {
      setPendingLikes(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // Add this to the button's className to show loading state
  const getLikeButtonClasses = (postId: string) => `
    flex items-center gap-2 transition-colors
    ${pendingLikes.has(postId) ? 'opacity-50 cursor-not-allowed' : ''}
    ${likedPosts.has(postId)
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'
    }
  `;

  const handleDelete = async (postId: string) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this post?</p>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded-md"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded-md"
            onClick={async () => {
              try {
                await axios.delete(`https://extreamx-backend.onrender.com/api/v1/deletePost/${postId}`);
                setPosts(posts.filter(post => post._id !== postId));
                toast.success('Post deleted successfully');
              } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Failed to delete post');
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <ToastContainer position="top-center" />
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
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
          {posts.map((post) => (
            <div key={post._id} 
              className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${post.approved 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {post.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-600 dark:text-gray-300">
                    {post.content.slice(0, 100) + "..."}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.userID}</span>
                    </div>
                  </div>
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
              .filter(post => post.approved)
              .map((post) => (
                <div key={post._id} 
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">{post.userID}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {post.content.length > 50
                          ? post.content.substring(0, 50) + '...'
                          : post.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(post._id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setSelectedPost(post)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
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