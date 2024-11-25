import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ClockIcon 
} from '@heroicons/react/24/solid';

interface Analytics {
  totalUsers: number;
  totalCourses: number;
  activeUsers: number;
  completedCourses: number;
  userGrowthData: { month: string; count: number }[];
  courseEnrollmentData: { subject: string; count: number }[];
}

const getMaxCount = (data: { count: number }[] = []) => {
  return data.length > 0 ? Math.max(...data.map(d => d.count)) : 1;
};

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>({
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
    completedCourses: 0,
    userGrowthData: [
      { month: 'Jan', count: 0 },
      { month: 'Feb', count: 0 },
      { month: 'Mar', count: 0 },
      { month: 'Apr', count: 0 },
      { month: 'May', count: 0 },
      { month: 'Jun', count: 0 }
    ],
    courseEnrollmentData: [
      { subject: 'Math', count: 0 },
      { subject: 'Science', count: 0 },
      { subject: 'History', count: 0 }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // TODO: Replace with actual backend endpoint
        const response = await axios.get('/api/admin/analytics');
        setAnalytics(response.data || {
          totalUsers: 0,
          totalCourses: 0,
          activeUsers: 0,
          completedCourses: 0,
          userGrowthData: [],
          courseEnrollmentData: []
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch analytics');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading analytics...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Ensure we always have valid data
  const safeAnalytics = analytics || {
    totalUsers: 0,
    totalCourses: 0,
    activeUsers: 0,
    completedCourses: 0,
    userGrowthData: [],
    courseEnrollmentData: []
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Key Metrics Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
        <UserGroupIcon className="h-12 w-12 text-blue-500" />
        <div>
          <h3 className="text-gray-500 dark:text-gray-400">Total Users</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {safeAnalytics.totalUsers}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
        <DocumentTextIcon className="h-12 w-12 text-green-500" />
        <div>
          <h3 className="text-gray-500 dark:text-gray-400">Total Courses</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {safeAnalytics.totalCourses}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
        <ChartBarIcon className="h-12 w-12 text-purple-500" />
        <div>
          <h3 className="text-gray-500 dark:text-gray-400">Active Users</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {safeAnalytics.activeUsers}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
        <ClockIcon className="h-12 w-12 text-yellow-500" />
        <div>
          <h3 className="text-gray-500 dark:text-gray-400">Completed Courses</h3>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">
            {safeAnalytics.completedCourses}
          </p>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 col-span-full md:col-span-1">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          User Growth
        </h3>
        <div className="flex space-x-2 items-end h-48">
          {(safeAnalytics.userGrowthData || []).map((data, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center flex-1"
            >
              <div 
                className="bg-blue-500 w-full rounded-t-md" 
                style={{ 
                  height: `${(data.count / (getMaxCount(safeAnalytics.userGrowthData) || 1)) * 100}%` 
                }}
              />
              <span className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                {data.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Enrollment Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 col-span-full md:col-span-1">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Course Enrollments
        </h3>
        <div className="space-y-2">
          {(safeAnalytics.courseEnrollmentData || []).map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ 
                    width: `${(data.count / (getMaxCount(safeAnalytics.courseEnrollmentData) || 1)) * 100}%` 
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {data.subject}: {data.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
