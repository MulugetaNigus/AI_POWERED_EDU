import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { Users } from 'lucide-react';

interface Group {
    _id: string;
    groupName: string;
    groupDescription: string;
    groupMember: string;
    groupCreator: string;
    profilePicture: string;
    approval: boolean;
}

const PopularGroups: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:8888/api/v1/getGroup');
                const sortedGroups = response.data
                    .sort((a: Group, b: Group) => parseInt(b.groupMember) - parseInt(a.groupMember))
                    .slice(0, 5);
                setGroups(sortedGroups);
            } catch (err) {
                setError('Failed to fetch groups');
                console.error('Error fetching groups:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    if (loading) {
        return (
            <div className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Popular Groups</h2>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-3 p-2">
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            <div className="flex-grow space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                            </div>
                            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Popular Groups</h2>
                <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Popular Groups</h2>
            <ul className="space-y-4">
                {groups.map((group) => (
                    <li key={group._id} className="flex items-center space-x-3 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer p-2 rounded-lg">
                        <img
                            src={group.profilePicture}
                            alt={group.groupName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-grow">
                            <h3 className="font-medium">{group.groupName}</h3>
                            <p className="text-sm text-gray-500">{group.groupMember} members</p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                            group.approval 
                                ? 'bg-green-100 text-green-600'
                                : 'bg-yellow-100 text-yellow-600'
                        }`}>
                            {group.approval ? 'Approved' : 'Pending'}
                        </span>
                    </li>
                ))}
            </ul>
            <Link to="/search-groups">
                <button className="mt-4 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
                    See All Groups
                </button>
            </Link>
        </div>
    );
};

export default PopularGroups;