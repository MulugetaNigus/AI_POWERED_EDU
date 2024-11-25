import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // TODO: Replace with actual backend endpoint
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
    try {
      // TODO: Replace with actual backend endpoint
      await axios.patch(`/api/admin/users/${userId}`, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  const handleUserDelete = async (userId: string) => {
    try {
      // TODO: Replace with actual backend endpoint
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) return <div>Loading users...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full leading-normal">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <th className="px-5 py-3 border-b-2 text-left">Name</th>
            <th className="px-5 py-3 border-b-2 text-left">Email</th>
            <th className="px-5 py-3 border-b-2 text-left">Role</th>
            <th className="px-5 py-3 border-b-2 text-left">Joined</th>
            <th className="px-5 py-3 border-b-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-5 py-5 border-b dark:border-gray-600">{user.name}</td>
              <td className="px-5 py-5 border-b dark:border-gray-600">{user.email}</td>
              <td className="px-5 py-5 border-b dark:border-gray-600">
                <select 
                  value={user.role} 
                  onChange={(e) => handleUserRoleChange(user.id, e.target.value as 'student' | 'teacher' | 'admin')}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="px-5 py-5 border-b dark:border-gray-600">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-5 py-5 border-b dark:border-gray-600">
                <button 
                  onClick={() => handleUserDelete(user.id)}
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
  );
};

export default UserManagement;
