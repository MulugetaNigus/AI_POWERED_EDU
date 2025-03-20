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
  ExternalLink,
  Heart,
  MessageSquare
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
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-4 animate-pulse">
          {/* Profile Skeleton */}
          <div className="flex flex-col items-center pb-4 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-3" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-32" />
          </div>
          
          {/* Stats Skeleton */}
          <div className="flex justify-between mb-4">
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-[48%]" />
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded w-[48%]" />
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full" />
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
      className="bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 mb-6"
    >
      {/* Profile Section */}
      <div className="p-4">
        <div className="flex flex-col items-center pb-4 mb-4 border-b border-gray-100 dark:border-gray-700">
          {user?.imageUrl ? (
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-2 border-blue-100 dark:border-blue-900/30 object-cover shadow-sm mb-3" 
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-blue-100 dark:border-blue-900/30 mb-3 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          )}
          
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{displayName}</h2>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-2">
            <Mail className="w-3 h-3" />
            <span>{userEmail}</span>
          </div>
          
          <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full text-xs">
            <Award className="w-3.5 h-3.5" />
            <span>Grade {grade?.user_grade_level || '9'} Student</span>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="flex justify-between mb-4">
          <div className="w-[48%] bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{userPosts.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
            </div>
          </div>
          
          <div className="w-[48%] bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-3 flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{userGroups.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Groups</div>
            </div>
          </div>
        </div>
        
        {/* Groups Section */}
        {userGroups.length > 0 && (
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 dark:text-white flex items-center gap-1.5 mb-3">
              <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>My Groups</span>
            </h3>
            <div className="space-y-2">
              {userGroups.slice(0, 2).map(group => (
                <div 
                  key={group._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <img 
                    src={group.profilePicture || 'https://via.placeholder.com/40'} 
                    alt={group.groupName} 
                    className="w-10 h-10 rounded-full object-cover"
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
                        <span>{group.members?.length || 0} members</span>
                      </div>
                      {group.groupCreator === userEmail && (
                        <span className="px-1.5 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded-full">
                          Creator
                        </span>
                      )}
                    </div>
                  </div>
                  {/* <Link to={`/search-groups?id=${group._id}`} className="text-blue-500 dark:text-blue-400">
                    <ExternalLink className="w-4 h-4" />
                  </Link> */}
                </div>
              ))}
              
              {userGroups.length > 2 && (
                <Link 
                  to="/search-groups" 
                  className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                >
                  View all {userGroups.length} groups
                </Link>
              )}
            </div>
          </div>
        )}
        
        {/* Posts Section */}
        {userPosts.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white flex items-center gap-1.5 mb-3">
              <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <span>My Posts</span>
            </h3>
            <div className="space-y-2">
              {userPosts.slice(0, 2).map(post => (
                <div 
                  key={post._id}
                  className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-800 dark:text-white line-clamp-2 mb-2">
                    {post.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
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

                      {/* <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>0</span>
                      </div> */}

                    </div>

                  </div>
                </div>
              ))}
              
              {userPosts.length > 2 && (
                <Link 
                  to="/community/myPost" 
                  className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                >
                  View all {userPosts.length} posts
                </Link>
              )}
            </div>
          </div>
        )}
        
        {userGroups.length === 0 && userPosts.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <FileText className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p>No activity yet</p>
            <p className="text-sm mt-1">Create posts or join groups to see them here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
