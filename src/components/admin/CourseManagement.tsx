import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Course {
  id: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
  createdAt: string;
  isActive: boolean;
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingCourse, setIsAddingCourse] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // TODO: Replace with actual backend endpoint
        const response = await axios.get('/api/admin/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseToggle = async (courseId: string) => {
    try {
      // TODO: Replace with actual backend endpoint
      await axios.patch(`/api/admin/courses/${courseId}/toggle`);
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, isActive: !course.isActive } : course
      ));
    } catch (err) {
      setError('Failed to toggle course status');
    }
  };

  const handleAddCourse = async () => {
    try {
      // TODO: Replace with actual backend endpoint
      const response = await axios.post('/api/admin/courses', newCourse);
      setCourses([...courses, response.data]);
      setNewCourse({});
      setIsAddingCourse(false);
    } catch (err) {
      setError('Failed to add course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      // TODO: Replace with actual backend endpoint
      await axios.delete(`/api/admin/courses/${courseId}`);
      setCourses(courses.filter(course => course.id !== courseId));
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <th className="px-5 py-3 border-b-2 text-left">Title</th>
              <th className="px-5 py-3 border-b-2 text-left">Grade</th>
              <th className="px-5 py-3 border-b-2 text-left">Subject</th>
              <th className="px-5 py-3 border-b-2 text-left">Created</th>
              <th className="px-5 py-3 border-b-2 text-left">Status</th>
              <th className="px-5 py-3 border-b-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-5 py-5 border-b dark:border-gray-600">{course.title}</td>
                <td className="px-5 py-5 border-b dark:border-gray-600">{course.grade}</td>
                <td className="px-5 py-5 border-b dark:border-gray-600">{course.subject}</td>
                <td className="px-5 py-5 border-b dark:border-gray-600">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-5 border-b dark:border-gray-600">
                  <span 
                    className={`px-3 py-1 rounded-full text-xs ${
                      course.isActive 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {course.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-5 border-b dark:border-gray-600 space-x-2">
                  <button 
                    onClick={() => handleCourseToggle(course.id)}
                    className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Toggle
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        {!isAddingCourse ? (
          <button 
            onClick={() => setIsAddingCourse(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add New Course
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Add New Course</h3>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Course Title" 
                value={newCourse.title || ''}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                className="input"
              />
              <input 
                type="number" 
                placeholder="Grade" 
                value={newCourse.grade || ''}
                onChange={(e) => setNewCourse({...newCourse, grade: parseInt(e.target.value)})}
                className="input"
              />
              <input 
                type="text" 
                placeholder="Subject" 
                value={newCourse.subject || ''}
                onChange={(e) => setNewCourse({...newCourse, subject: e.target.value})}
                className="input"
              />
              <textarea 
                placeholder="Description" 
                value={newCourse.description || ''}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                className="input col-span-2"
              />
              <div className="col-span-2 flex space-x-2">
                <button 
                  onClick={handleAddCourse}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Create Course
                </button>
                <button 
                  onClick={() => setIsAddingCourse(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
