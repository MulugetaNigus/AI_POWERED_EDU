import { create } from 'zustand';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ImprovementArea {
  topic: string;
  description: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  timestamp: number;
  feedback?: {
    strengths: string[];
    weaknesses: string[];
    recommendations: {
      topic: string;
      action: string;
      resources: string[];
    }[];
  };
}

interface ProgressState {
  questions: Question[];
  topics: string[];
  improvementAreas: ImprovementArea[];
  quizResults: {
    [key: string]: QuizResult;
  };
  studyStreak: number;
  updateQuestions: (questions: Question[]) => void;
  updateTopics: (topics: string[]) => void;
  updateImprovementAreas: (areas: ImprovementArea[]) => void;
  addQuizResult: (topic: string, score: number, total: number, feedback?: QuizResult['feedback']) => void;
  getOverallProgress: () => number;
  getCompletedQuizzes: () => string;
  getAreasToImprove: () => number;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  questions: [],
  topics: [],
  improvementAreas: [],
  quizResults: {},
  studyStreak: 0,
  
  updateQuestions: (questions) => set({ questions }),
  updateTopics: (topics) => set({ topics }),
  updateImprovementAreas: (areas) => set({ improvementAreas: areas }),
  
  addQuizResult: (topic, score, total, feedback) => {
    set((state) => {
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      const lastQuizTime = Math.max(...Object.values(state.quizResults).map(r => r.timestamp), 0);
      
      // Update study streak
      let streak = state.studyStreak;
      if (now - lastQuizTime <= oneDayMs) {
        streak += 1;
      } else if (now - lastQuizTime > oneDayMs) {
        streak = 1;
      }

      return {
        quizResults: {
          ...state.quizResults,
          [topic]: {
            score,
            totalQuestions: total,
            timestamp: now,
            feedback,
          },
        },
        studyStreak: streak,
      };
    });
  },

  getOverallProgress: () => {
    const results = Object.values(get().quizResults);
    if (results.length === 0) return 0;
    
    const totalScore = results.reduce((sum, r) => sum + (r.score / r.totalQuestions), 0);
    return Math.round((totalScore / results.length) * 100);
  },

  getCompletedQuizzes: () => {
    const total = Object.keys(get().quizResults).length;
    return `${total}/30`;
  },

  getAreasToImprove: () => {
    const results = Object.values(get().quizResults);
    return results.filter(r => (r.score / r.totalQuestions) < 0.7).length;
  },
}));