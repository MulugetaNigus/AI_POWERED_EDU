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
import { useProgressStore } from './store/progressStore';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ProgressTracker() {
  const { 
    quizResults, 
    getOverallProgress, 
    getCompletedQuizzes, 
    studyStreak,
    getAreasToImprove,
    improvementAreas
  } = useProgressStore();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const pieData = Object.entries(quizResults).map(([subject, result]) => ({
    name: subject,
    value: (result.score / result.totalQuestions) * 100
  }));

  const barData = Object.entries(quizResults).map(([topic, result]) => ({
    topic,
    score: (result.score / result.totalQuestions) * 100
  }));

  // Get topics that need improvement (score < 70%)
  const topicsToImprove = Object.entries(quizResults)
    .filter(([_, result]) => (result.score / result.totalQuestions) < 0.7)
    .map(([topic, result]) => ({
      topic,
      score: (result.score / result.totalQuestions) * 100,
      feedback: result.feedback
    }));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Progress"
          value={`${getOverallProgress()}%`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Completed Quizzes"
          value={getCompletedQuizzes()}
          icon={<Trophy className="w-6 h-6" />}
          color="text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Study Streak"
          value={`${studyStreak} days`}
          icon={<Target className="w-6 h-6" />}
          color="text-yellow-600 dark:text-yellow-400"
        />
        <StatCard
          title="Areas to Improve"
          value={getAreasToImprove().toString()}
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
              <BarChart data={barData}>
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
          {improvementAreas.map((area, index) => (
            <div
              key={index}
              className="p-4 border dark:border-gray-700 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {area.topic}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {area.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {topicsToImprove.map((topic) => (
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
                    Current score: {topic.score.toFixed(1)}%
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTopic(topic.topic)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Review
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedTopic && quizResults[selectedTopic]?.feedback && (
        <ReviewModal
          isOpen={!!selectedTopic}
          onClose={() => setSelectedTopic(null)}
          feedback={quizResults[selectedTopic].feedback!}
          topic={selectedTopic}
          score={(quizResults[selectedTopic].score / quizResults[selectedTopic].totalQuestions) * 100}
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