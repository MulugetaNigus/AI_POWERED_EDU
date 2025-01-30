import React from "react";
import { FaHeart, FaRegHeart, FaComment, FaRetweet, FaShare } from "react-icons/fa";
import img1 from './Assets/HeroOne.png';

interface Post {
  id: number;
  author: string;
  username: string;
  content: string;
  timestamp: string;
  avatar: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

const Feed: React.FC = () => {
  const posts: Post[] = [
    {
      id: 1,
      author: "Jane Smith",
      username: "@janesmith",
      content: "🚀 Just finished my AI project! #MachineLearning #AI",
      timestamp: "2 hours ago",
      avatar: "https://i.pravatar.cc/100?img=1",
      likes: 12,
      comments: 4,
      shares: 3,
      isLiked: false,
    },
    {
      id: 2,
      author: "Bob Johnson",
      username: "@bobjohnson",
      content: "📚 Anyone want to study for the upcoming exam? #FinalsWeek",
      timestamp: "4 hours ago",
      avatar: "https://i.pravatar.cc/100?img=2",
      likes: 8,
      comments: 2,
      shares: 1,
      isLiked: false,
    },
    {
      id: 3,
      author: "Jane Smith",
      username: "@janesmith",
      content: "🚀 Just finished my AI project! #MachineLearning #AI",
      timestamp: "2 hours ago",
      avatar: "https://i.pravatar.cc/100?img=1",
      likes: 12,
      comments: 4,
      shares: 3,
      isLiked: false,
    },
    {
      id: 4,
      author: "Bob Johnson",
      username: "@bobjohnson",
      content: "📚 Anyone want to study for the upcoming exam? #FinalsWeek",
      timestamp: "4 hours ago",
      avatar: "https://i.pravatar.cc/100?img=2",
      likes: 8,
      comments: 2,
      shares: 1,
      isLiked: false,
    },
    {
      id: 5,
      author: "Jane Smith",
      username: "@janesmith",
      content: "🚀 Just finished my AI project! #MachineLearning #AI",
      timestamp: "2 hours ago",
      avatar: "https://i.pravatar.cc/100?img=1",
      likes: 12,
      comments: 4,
      shares: 3,
      isLiked: false,
    },
    {
      id: 6,
      author: "Bob Johnson",
      username: "@bobjohnson",
      content: "📚 Anyone want to study for the upcoming exam? #FinalsWeek",
      timestamp: "4 hours ago",
      avatar: "https://i.pravatar.cc/100?img=2",
      likes: 8,
      comments: 2,
      shares: 1,
      isLiked: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mt-0">
        <p className="text-gray-600 text-2xl font-bold">Community Posts</p>
      </div>
      {posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4 border border-gray-300 dark:border-gray-700 transition hover:bg-gray-100 dark:hover:bg-gray-800">
          {/* User Info */}
          <div className="flex items-center space-x-4">
            <img src={post.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{post.author}</h3>
              <p className="text-gray-500 text-sm">{post.username} · {post.timestamp}</p>
            </div>
          </div>

          {/* Post Content */}
          <p className="mt-3 text-gray-800 dark:text-gray-300">{post.content}</p>
          <img src={img1} alt="post-image" className="rounded-lg my-4" />

          {/* Engagement Icons */}
          <div className="flex justify-between items-center mt-4 text-gray-500 dark:text-gray-400">
            {/* Like */}
            <button className="flex items-center space-x-2 hover:text-red-500 transition">
              {post.isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              <span>{post.likes}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
