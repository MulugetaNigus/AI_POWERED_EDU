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

interface ProgressState {
  questions: Question[];
  topics: string[];
  improvementAreas: ImprovementArea[];
  quizResults: {
    [key: string]: {
      score: number;
      totalQuestions: number;
      timestamp: number;
    };
  };
  updateQuestions: (questions: Question[]) => void;
  updateTopics: (topics: string[]) => void;
  updateImprovementAreas: (areas: ImprovementArea[]) => void;
  addQuizResult: (topic: string, score: number, total: number) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  questions: [],
  topics: [],
  improvementAreas: [],
  quizResults: {},
  
  updateQuestions: (questions) => set({ questions }),
  updateTopics: (topics) => set({ topics }),
  updateImprovementAreas: (areas) => set({ improvementAreas: areas }),
  
  addQuizResult: (topic, score, total) => set((state) => ({
    quizResults: {
      ...state.quizResults,
      [topic]: {
        score,
        totalQuestions: total,
        timestamp: Date.now(),
      },
    },
  })),
}));