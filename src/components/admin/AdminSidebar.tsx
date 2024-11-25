import React from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      label: 'Dashboard',
      section: 'dashboard'
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      label: 'User Management',
      section: 'users'
    },
    {
      icon: <DocumentTextIcon className="w-6 h-6" />,
      label: 'Course Management',
      section: 'courses'
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      label: 'Content Moderation',
      section: 'content'
    }
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="px-6 py-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Admin
        </h2>
      </div>
      <nav className="mt-10">
        {menuItems.map((item) => (
          <button
            key={item.section}
            onClick={() => onSectionChange(item.section)}
            className={`w-full flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 
              ${activeSection === item.section
                ? 'bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-white'
                : ''}`}
          >
            {item.icon}
            <span className="mx-4 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
