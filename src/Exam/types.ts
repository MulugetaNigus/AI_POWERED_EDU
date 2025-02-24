export default interface QuestionsType {
    DummyQuestions: {
        question: string;
        alternatives: string[];
        answer: string;
        answerDetail: string;
    }
};

export interface DBQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  grade: string;
  difficulty: string;
  uploadedAt: string;
}

export interface ExamQuestion {
  _id: string;
  grade: string;
  subject: string;
  year: number;
  questions: DBQuestion[];
}

export interface ExamDetails {
  subject: string;
  period: string;
  grade: string;
}

export interface TransformedQuestion {
    question: string;
    alternatives: string[];
    answer: string;
    answerDetail: string;
}