import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import PopularGroups from '../PopularGroups';
import { FaSpinner } from 'react-icons/fa'; // For the waiting icon

interface Group {
    id: string;
    name: string;
    members: number;
    imageUrl: string;
    status: 'approved' | 'pending'; // Add status to the group interface
}

const dummyGroups: Group[] = [
    { id: '1', name: 'Math Enthusiasts', members: 1250, imageUrl: 'https://cdn-icons-png.freepik.com/256/3976/3976555.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid', status: 'approved' },
    { id: '2', name: 'Coding Club', members: 980, imageUrl: 'https://cdn-icons-png.freepik.com/256/8881/8881823.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid', status: 'pending' },
    { id: '3', name: 'Science Explorers', members: 1500, imageUrl: 'https://cdn-icons-png.freepik.com/256/3976/3976631.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid', status: 'approved' },
    { id: '4', name: 'Literature Lovers', members: 750, imageUrl: 'https://cdn-icons-png.freepik.com/256/15113/15113073.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid', status: 'pending' },
];

// MyGroups Component
const MyGroups: React.FC = () => {
    const myGroupsList: Group[] = dummyGroups.filter(group => group.status === 'approved' || group.status === 'pending');

    return (
        <div className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">

            <h2 className="text-xl font-semibold mb-4">My Groups</h2>
            <ul className="space-y-4">
                {myGroupsList.map((group) => (
                    <li key={group.id} className="flex items-center space-x-3 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer p-2 rounded-lg">
                        <img
                            src={group.imageUrl}
                            alt={group.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-grow">
                            <h3 className="font-medium">{group.name}</h3>
                            <p className="text-sm text-gray-500">{group.members} members</p>
                        </div>
                        {group.status === 'approved' ? (
                            <Link to="chat">
                                <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full cursor-pointer hover:bg-blue-400 transition ease-out duration-125">
                                    Chat
                                </button>
                            </Link>
                        ) : (
                            <div className="text-gray-500">
                                <FaSpinner className="animate-spin" /> {/* Waiting icon for pending status */}
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mb-4 mt-8">Others Groups</h2>
            <ul className="space-y-4">
                {myGroupsList.map((group) => (
                    <li key={group.id} className="flex items-center space-x-3 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer p-2 rounded-lg">
                        <img
                            src={group.imageUrl}
                            alt={group.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-grow">
                            <h3 className="font-medium">{group.name}</h3>
                            <p className="text-sm text-gray-500">{group.members} members</p>
                        </div>
                        {group.status === 'approved' ? (
                            <Link to="chat">
                                <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full cursor-pointer hover:bg-blue-400 transition ease-out duration-125">
                                    Chat
                                </button>
                            </Link>
                        ) : (
                            <Link to="chat">
                                <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full cursor-pointer hover:bg-blue-400 transition ease-out duration-125">
                                    Chat
                                </button>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

        </div>
    );
};

const SearchGroups: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<Group[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
        setLoading(true);
        // Simulate a network request with a timeout
        setTimeout(() => {
            setGroups(dummyGroups);
            setLoading(false);
        }, 1500);
    };

    return (
        <>
            {/* Placeholder for the header component */}
            <div id="header-placeholder" className="pb-28">
                <Header />
            </div>
            <main className="flex flex-1">
                <div className="w-3/4 dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 m-4">
                    {/* Search bar and button */}
                    <p className='text-xl font-bold text-gray-500 dark:text-white mb-3'>Search Groups Here</p>
                    <div className="flex space-x-2 mb-4">
                        <input
                            type="text"
                            placeholder="Search groups by name"
                            className="flex-grow p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition ease-out duration-125"
                        >
                            Search
                        </button>
                    </div>

                    {/* Loading state */}
                    {loading && <div className="text-center py-4">Loading...</div>}

                    {/* Display groups */}
                    {!loading && groups.length > 0 && (
                        <ul className="space-y-4">
                            {groups.map((group) => (
                                <li key={group.id} className="flex items-center space-x-3 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer p-2 rounded-lg">
                                    <img
                                        src={group.imageUrl}
                                        alt={group.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="font-medium">{group.name}</h3>
                                        <p className="text-sm text-gray-500">{group.members} members</p>
                                    </div>
                                    <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full cursor-pointer hover:bg-blue-400 transition ease-out duration-125">
                                        Join
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Display message if no groups are found */}
                    {!loading && groups.length === 0 && searchQuery && (
                        <div className="text-center py-4">No groups found.</div>
                    )}
                    {/* My Groups Section */}
                    <MyGroups />
                </div>

                {/* Right side content */}
                <div className="w-1/4 p-4 bg-gray-50 dark:bg-gray-900">
                    <PopularGroups />
                </div>
            </main>
        </>
    );
};

export default SearchGroups;