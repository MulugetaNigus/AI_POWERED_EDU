import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend 
} from 'recharts';
import { 
  BookOpen, Brain, Trophy, Target,
  TrendingUp, AlertCircle 
} from 'lucide-react';
import ReviewModal from './ReviewModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const progressData = [
  { subject: 'Physics', completed: 75, total: 100 },
  { subject: 'Mathematics', completed: 60, total: 100 },
  { subject: 'English', completed: 90, total: 100 },
  { subject: 'Biology', completed: 45, total: 100 },
];

const weaknessData = [
  { topic: 'Mechanics', score: 65 },
  { topic: 'Thermodynamics', score: 45 },
  { topic: 'Optics', score: 80 },
  { topic: 'Electricity', score: 70 },
];

export default function ProgressTracker() {
  const [selectedTopic, setSelectedTopic] = useState<{ topic: string; score: number } | null>(null);
  
  const pieData = progressData.map(item => ({
    name: item.subject,
    value: (item.completed / item.total) * 100
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value="72%"
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Completed Quizzes"
          value="24/30"
          icon={<Trophy className="w-6 h-6" />}
          color="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Study Streak"
          value="7 days"
          icon={<Target className="w-6 h-6" />}
          color="text-yellow-600 dark:text-yellow-400"
        />
        <StatCard
          title="Areas to Improve"
          value="3"
          icon={<AlertCircle className="w-6 h-6" />}
          color="text-red-600 dark:text-red-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Subject Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Topic Performance
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weaknessData}>
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Recommended Focus Areas
        </h3>
        <div className="space-y-4">
          {weaknessData
            .sort((a, b) => a.score - b.score)
            .slice(0, 2)
            .map((topic, index) => (
              <div
                key={topic.topic}
                className="p-4 border dark:border-gray-700 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {topic.topic}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current score: {topic.score}%
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTopic(topic)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
        </div>
      </div>

      {selectedTopic && (
        <ReviewModal
          isOpen={!!selectedTopic}
          onClose={() => setSelectedTopic(null)}
          topic={selectedTopic}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-semibold text-gray-800 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`${color}`}>{icon}</div>
      </div>
    </div>
  );
}