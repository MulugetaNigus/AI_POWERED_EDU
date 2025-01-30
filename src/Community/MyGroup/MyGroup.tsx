import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from '../../components/Header';
import { Eye, Trash } from 'lucide-react';
import img1 from '../Assets/p4.png';
import PopularGroups from '../PopularGroups';

interface MyGroupProps {
    groupName: string;
    groupDescription: string;
    groupPicture: string;
    members: {
        username: string;
        profilePicture: string;
        posts: {
            title: string;
            content: string;
            status: 'pending' | 'approved';
        }[];
    }[];
}

const MyGroup: React.FC<MyGroupProps> = ({ groupName, groupDescription, groupPicture, members }) => {
    // Get the current user
    const { user } = useUser();

    // State to track the theme
    const [theme, setTheme] = useState('light');

    // Function to toggle the theme
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark');
    };

    // Placeholder functions for delete and view more actions
    const handleDelete = (memberIndex: number, postIndex: number) => {
        console.log(`Delete post at index ${postIndex} for member ${memberIndex}`);
        // Add your delete logic here
    };

    const handleViewMore = (memberIndex: number, postIndex: number) => {
        console.log(`View more for post at index ${postIndex} for member ${memberIndex}`);
        // Add your view more logic here
    };

    return (
        <div className={`flex flex-col min-h-screen dark:bg-gray-700 text-gray-800 dark:text-white`}>
            {/* Header Placeholder */}
            <div className="w-full h-20 flex items-center justify-center">
                <Header toggleTheme={toggleTheme} />
            </div>

            <main className="flex flex-1">
                {/* Left side content */}
                <div className="w-3/4 p-8 bg-white dark:bg-gray-700">
                    <div className="flex items-center mb-4">
                        <img
                            src={user?.imageUrl}
                            alt="Group"
                            className="w-16 h-16 rounded-full mr-4"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                            <p className="text-gray-500 dark:text-gray-400">{user?.emailAddresses[0].emailAddress}</p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-semibold mb-4">My Groups</h3>

                    <div className="mb-4 p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="mb-4 p-4 border-b border-gray-200 dark:border-gray-700">
                            {/* image with info here */}
                            <div className='flex flex-row items-center justify-start gap-3'>
                                <img src={img1} alt="profile_picture_here" width={60} height={60} />
                                <div className='flex flex-col gap-1'>
                                    <p className='text-gray-700 text-xl font-bold'>this is muller</p>
                                    <p className='text-gray-700 text-base font-normal'>and this is his information</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right side content */}
                <div className="w-1/4 p-8 bg-gray-50 dark:bg-gray-900">
                    {/* <h3 className="text-2xl font-semibold mb-4">Approved Posts</h3> */}
                    <PopularGroups />
                </div>
            </main>
        </div>
    );
};

export default MyGroup;