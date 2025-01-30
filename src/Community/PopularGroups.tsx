import React from 'react';

interface Group {
    id: string;
    name: string;
    members: number;
    imageUrl: string;
}

const popularGroups: Group[] = [
    { id: '1', name: 'Math Enthusiasts', members: 1250, imageUrl: 'https://cdn-icons-png.freepik.com/256/3976/3976555.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid' },
    { id: '2', name: 'Coding Club', members: 980, imageUrl: 'https://cdn-icons-png.freepik.com/256/8881/8881823.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid' },
    { id: '3', name: 'Science Explorers', members: 1500, imageUrl: 'https://cdn-icons-png.freepik.com/256/3976/3976631.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid' },
    { id: '4', name: 'Literature Lovers', members: 750, imageUrl: 'https://cdn-icons-png.freepik.com/256/15113/15113073.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid' },
    { id: '5', name: 'Literature Lovers', members: 750, imageUrl: 'https://cdn-icons-png.freepik.com/256/15113/15113073.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid' },
    { id: '6', name: 'Literature Lovers', members: 750, imageUrl: 'https://cdn-icons-png.freepik.com/256/15113/15113073.png?ga=GA1.1.532673313.1738069987&semt=ais_hybrid' },
];

const PopularGroups: React.FC = () => {
    return (
        <div className="dark:text-white dark:bg-gray-800 bg-white shadow border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Popular Groups</h2>
            <ul className="space-y-4">
                {popularGroups.map((group) => (
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
                        <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full cursor-pointer hover:bg-blue-400 transition easy-out duration-125">
                            Join
                        </button>
                    </li>
                ))}
            </ul>
            <button className="mt-4 w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition">
                See All Groups
            </button>
        </div>
    );
};

export default PopularGroups;
