import React from 'react';

interface Topic {
  id: string;
  name: string;
  posts: number;
}

const trendingTopics: Topic[] = [
  { id: '1', name: 'AI in Education', posts: 156 },
  { id: '2', name: 'Exam Preparation Tips', posts: 132 },
  { id: '3', name: 'Online Learning Hacks', posts: 98 },
  { id: '4', name: 'STEM Career Paths', posts: 87 },
  { id: '5', name: 'Study Motivation', posts: 76 },
];

const TrendingTopics: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6">
      <h2 className="text-xl font-semibold mb-4">Trending Topics</h2>
      <ul className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <li key={topic.id} className="flex items-center space-x-3">
            <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
            <div className="flex-grow">
              <h3 className="font-medium text-blue-600 hover:underline cursor-pointer">
                {topic.name}
              </h3>
              <p className="text-sm text-gray-500">{topic.posts} posts</p>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
        See More Topics
      </button>
    </div>
  );
};

export default TrendingTopics;
