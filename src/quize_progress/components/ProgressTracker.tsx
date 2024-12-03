import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

import {
  BookOpen,
  Brain,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ReviewModal from "./ReviewModal";
import { useProgressStore } from "./store/progressStore";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ProgressTracker() {
  const {
    quizResults,
    getOverallProgress,
    getCompletedQuizzes,
    studyStreak,
    getAreasToImprove,
    improvementAreas,
  } = useProgressStore();

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [feedbacker, setFeedback] = useState<any[]>([]);
  const [deleteLoading, setdeleteLoading] = useState(false);
  const [barChartLoading, setBarChartLoading] = useState(false);
  const [focusAreasLoading, setFocusAreasLoading] = useState(false);
  const selectedFeedback = feedbacker.find(
    (feedback) => feedback.subject === selectedTopic
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setBarChartLoading(true);
    setFocusAreasLoading(true);
    await axios
      .get("http://localhost:8888/api/v1/enhancement")
      .then((response) => {
        setFeedback(response.data);
        console.log("feedbacks from db: ", response.data);
        setBarChartLoading(false);
        setFocusAreasLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setBarChartLoading(false);
        setFocusAreasLoading(false);
      });
  }

  // const [feedbacker, setFeedback] = useState([]);
  // useEffect(() => {
  //   const existingFeedback = JSON.parse(localStorage.getItem("feedback") || "[]");
  //   setFeedback(existingFeedback)
  //   console.log("eski eyew pass yemtadergewun: ", existingFeedback);
  // }, []);

  const pieData = feedbacker.map((feedback) => ({
    name: feedback.subject,
    progress: feedback.score, // or any field that represents progress
  }));

  const barData = feedbacker.map((feedback) => ({
    subject: feedback.subject,
    score: feedback.score, // Assuming score is the desired metric
  }));

  // Get topics that need improvement (score < 70%)
  const topicsToImprove = Object.entries(quizResults)
    .filter(([_, result]) => result.score / result.totalQuestions < 0.7)
    .map(([topic, result]) => ({
      topic,
      score: (result.score / result.totalQuestions) * 100,
      feedback: result.feedback,
    }));

  // handle delete enhancements
  const handleDelete = async (id: string) => {
    // alert(id);
    setdeleteLoading(true);
    // delete with id axios req
    await axios
      .delete(`http://localhost:8888/api/v1/deleteEnhancement/${id}`)
      .then((response) => {
        console.log(response.data);
        fetchData();
        setdeleteLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setdeleteLoading(false);
      });
  };

  return (
    <div className="p-6 space-y-6">
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Subject Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={400}>
                <Pie
                  data={pieData}
                  dataKey="progress"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                />
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Topic Performance
          </h3>
          {barChartLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Recommended Focus Areas
        </h3>
        <div className="space-y-4">
          {focusAreasLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
          ) : feedbacker?.length > 0 ? (
            feedbacker?.map((topic) => (
              <div
                key={topic._id}
                className="p-4 border dark:border-gray-700 rounded-lg flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {topic.subject}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Current score: {topic.score}%
                    </p>
                  </div>
                </div>
                {/* action buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTopic(topic.subject)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Review
                  </button>
                  <button
                    onClick={() => handleDelete(topic._id)}
                    className="px-4 py-2 text-sm bg-red-700 text-white rounded-lg hover:bg-red-900 transition-colors"
                  >
                    {deleteLoading && topic._id ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No recommended focus areas found.
            </p>
          )}
        </div>
      </div>

      {selectedTopic && (
        <ReviewModal
          isOpen={!!selectedTopic}
          onClose={() => setSelectedTopic(null)}
          feedbacker={selectedFeedback} // pass specific feedback here
          // subject={selectedTopic}
          // score={(quizResults[selectedTopic].score / quizResults[selectedTopic].totalQuestions) * 100}
        />
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
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
