// components/Navigation.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = ({ postCreationModal, setpostCreationModal }) => {
  return (
    <nav className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <ul className="space-y-2">
        <li><Link to="myPost" className="block px-2 py-2 dark:hover:bg-gray-700 transition easy-out duration-125 hover:bg-gray-100 rounded">My Posts</Link></li>
        <li><a href="#" className="block px-2 py-2 dark:hover:bg-gray-700 transition easy-out duration-125 hover:bg-gray-100 rounded">My Groups</a></li>
        <div className='flex items-center justify-center border-indigo-700 dark:bg-white bg-blue-600 p-2 w-full rounded-md hover:bg-indigo-700 transition easy-out duration-125 cursor-pointer'>
          <button className='text-white dark:text-gray-800 font-normal p-1' onClick={() => setpostCreationModal(!postCreationModal)} >
            Create a Group
          </button>
        </div>
      </ul>
    </nav>
  );
};

export default Navigation;
