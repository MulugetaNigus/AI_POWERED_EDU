import React from 'react';
import img1 from '../Assets/p10.png';
import { useUser } from '@clerk/clerk-react';
import Header from '../../components/Header';
import { Eye, Trash } from 'lucide-react';

interface MyPostProps {
    profilePicture: string;
    name: string;
    email: string;
    posts: {
        title: string;
        content: string;
        username: string;
        status: 'pending' | 'approved';
    }[];
}

const MyPost: React.FC<MyPostProps> = ({ profilePicture, name, email, posts }) => {
    // Get the current user
    const { user } = useUser();
    console.log(user?.imageUrl);

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header Placeholder */}
            <div className="w-full h-20 flex items-center justify-center">
                <Header />
            </div>

            <main className="flex flex-1">
                {/* Left side content */}
                <div className="w-3/4 p-8 ml-20">
                    <div className="flex items-center mb-4">
                        <img
                            src={user?.imageUrl}
                            alt="Profile"
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                            <p className="text-gray-500">{user?.emailAddresses[0]?.emailAddress}</p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">My Post</h3>

                    {posts.map((post, index) => (
                        <div key={index} className="mb-4 p-4 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-lg font-semibold">{post.title}</h4>
                                <span className={`text-sm font-semibold ${post.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-800">
                                    {post.content.length > 50
                                        ? post.content.substring(0, 50) + '...'
                                        : post.content}
                                </p>
                                <span className="text-gray-500">{user?.fullName}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right side content */}
                <div className="w-1/4 p-8">
                    <h3 className="text-2xl font-semibold mb-4">Approved Posts</h3>
                    <ul className="space-y-4">
                        {posts
                            .filter(post => post.status === 'approved')
                            .map((post, index) => (
                                <li key={index} className="p-2 border-b border-gray-300 dark:border-gray-700 flex justify-between items-center">
                                    <div>
                                        <p className="text-gray-800 font-semibold dark:text-gray-200">{user?.fullName}</p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {post.content.length > 50
                                                ? post.content.substring(0, 50) + '...'
                                                : post.content}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 gap-2">
                                        <button
                                            // onClick={() => handleViewMore(index)} 
                                            className="text-green-500 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500">
                                            <Eye size={20} />
                                        </button>
                                        <button
                                            // onClick={() => handleDelete(index)} 
                                            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500">
                                            <Trash size={20} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default MyPost;