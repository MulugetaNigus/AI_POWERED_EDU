// components/UserProfile.tsx
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Mail, 
  Award, 
  Users, 
  FileText, 
  ChevronRight, 
  Bookmark,
  MessageSquare,
  Heart
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface UserProfileProps {
  loading?: boolean;
}

interface Group {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupMember: string;
  groupCreator: string;
  profilePicture: string;
  approval: boolean;
  members: string[];
}

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

const UserProfile: React.FC<UserProfileProps> = ({ loading = false }) => {
  const [userEmail, setUserEmail] = useState<string | undefined>();
  const [grade, setGrade] = useState<string | undefined>("");
  const [userGroups, setUserGroups] = useState<Group[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const { user } = useUser();
  
  useEffect(() => {
    setUserEmail(user?.emailAddresses[0]?.emailAddress as string);
    setGrade(JSON.parse(window.localStorage.getItem("user") as string));
    
    // Only fetch data if we have the user's email
    if (user?.emailAddresses[0]?.emailAddress) {
      const currentUserEmail = user.emailAddresses[0].emailAddress;
      
      // Fetch groups and posts
      const fetchUserData = async () => {
        try {
          // Fetch groups
          const groupsResponse = await axios.get('http://localhost:8888/api/v1/getGroup');
          // Filter for approved groups where the user is a member or creator
          const filteredGroups = groupsResponse.data.filter((group: Group) => 
            group.approval && (
              group.groupCreator === currentUserEmail || 
              (group.members && group.members.includes(currentUserEmail))
            )
          );
          setUserGroups(filteredGroups);
          
          // Fetch posts
          const postsResponse = await axios.get('http://localhost:8888/api/v1/getPost');
          // Filter for approved posts by the current user
          const filteredPosts = postsResponse.data.filter((post: Post) => 
            post.approved && post.userID === currentUserEmail
          );
          setUserPosts(filteredPosts);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setDataLoading(false);
        }
      };
      
      fetchUserData();
    }
  }, [user]);

  // Format date for posts
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Skeleton */}
            <div className="md:w-1/3 flex flex-col items-center md:items-start">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-3" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-32" />
            </div>
            
            {/* Stats and Activity Skeleton */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Extract the username from email (everything before @)
  const username = userEmail ? userEmail.split('@')[0] : 'User';
  // Capitalize the first letter of the username
  const displayName = username.charAt(0).toUpperCase() + username.slice(1);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Section */}
          <div className="md:w-1/3 flex flex-col items-center md:items-start">
            {user?.imageUrl ? (
              <img 
                src={user.imageUrl} 
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-purple-100 dark:border-purple-900/30 object-cover shadow-md mb-4" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-purple-100 dark:border-purple-900/30 mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{displayName}</h2>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>{userEmail}</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full text-sm">
              <Award className="w-4 h-4" />
              <span>Grade {grade?.user_grade_level || '9'} Student</span>
            </div>
            
            <div className="flex items-center gap-3 mt-5 w-full justify-center md:justify-start">
              <Link to="/community/myPost" className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors">
                <FileText className="w-4 h-4" />
                <span>My Posts</span>
              </Link>
              <Link to="/search-groups" className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors">
                <Users className="w-4 h-4" />
                <span>Groups</span>
              </Link>
            </div>
          </div>
          
          {/* Activity Section */}
          <div className="md:w-2/3">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4 shadow-sm border border-purple-100 dark:border-purple-900/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{userPosts.length}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Posts Created</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-4 shadow-sm border border-teal-100 dark:border-teal-900/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">{userGroups.length}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Groups Joined</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Groups and Posts Tabs */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Your Activity</h3>
                
                {/* Groups Section */}
                {userGroups.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                        <span>My Groups</span>
                      </h4>
                      <Link to="/search-groups" className="text-xs flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline">
                        <span>View All</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {userGroups.slice(0, 2).map(group => (
                        <motion.div 
                          key={group._id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          <img 
                            src={group.profilePicture || 'https://via.placeholder.com/40'} 
                            alt={group.groupName} 
                            className="w-10 h-10 rounded-full object-cover border border-teal-100 dark:border-teal-900/30"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/40';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 dark:text-white truncate">{group.groupName}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                                <Users className="w-3 h-3" />
                                <span>{group.members?.length || 0}</span>
                              </div>
                              {group.groupCreator === userEmail && (
                                <span className="px-1.5 py-0.5 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 text-xs rounded-full">
                                  Creator
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Posts Section */}
                {userPosts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                        <span>Recent Posts</span>
                      </h4>
                      <Link to="/community/myPost" className="text-xs flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline">
                        <span>View All</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                    
                    {userPosts.slice(0, 2).map(post => (
                      <motion.div 
                        key={post._id}
                        whileHover={{ scale: 1.01 }}
                        className="mb-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <p className="text-sm text-gray-800 dark:text-white line-clamp-2 mb-2">
                          {post.content}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 3 && (
                            <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                              +{post.tags.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{post.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>0</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {userGroups.length === 0 && userPosts.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No activity yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Join groups or create posts to see them here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
