// components/UserProfile.tsx
import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

interface UserProfileProps {
  loading?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ loading = false }) => {
  const [userEmail, setuserEmail] = useState<string | undefined>();
  const [grade, setgrade] = useState<string | undefined>("");
  const { user } = useUser();
  
  useEffect(() => {
    setuserEmail(user?.emailAddresses[0].emailAddress as string);
    setgrade(JSON.parse(window.localStorage.getItem("user") as string));
  }, []);

  if (loading) {
    return (
      <div className="dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 py-10 mb-4">
        <div className="animate-pulse flex flex-col items-center">
          {/* Profile Image Skeleton */}
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-2" />
          
          {/* Email Skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2" />
          
          {/* Grade Skeleton */}
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 py-10 mb-4">
      <img 
        src={user?.imageUrl} 
        alt="User_Profile" 
        className="w-20 h-20 rounded-full mx-auto mb-2" 
      />
      <h2 className="text-base font-semibold text-center dark:text-white">{userEmail}</h2>
      <p className="dark:text-white text-gray-600 text-center">Grade {grade?.user_grade_level} Student</p>
    </div>
  );
};

export default UserProfile;
