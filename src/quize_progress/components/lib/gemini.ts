import axios from 'axios';

const API_URL = 'http://localhost:8000';

interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AIResponse {
  questions: Question[];
  topics: string[];
  improvementAreas: {
    topic: string;
    description: string;
  }[];
}

function cleanJsonResponse(response: string): string {
  if (!response || typeof response !== 'string') {
    throw new Error('Invalid response format: empty or not a string');
  }

  // Remove markdown code blocks
  let cleaned = response.replace(/```json\n?|\n?```/g, '');
  
  // Remove any potential HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  try {
    // Validate that it's parseable JSON
    JSON.parse(cleaned);
    return cleaned;
  } catch (error) {
    throw new Error('Failed to parse cleaned response as JSON');
  }
}

function validateQuestions(questions: any[]): questions is Question[] {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Questions must be a non-empty array');
  }

  return questions.every((q, index) => {
    if (!q || typeof q !== 'object') {
      throw new Error(`Question ${index + 1} must be an object`);
    }
    if (typeof q.text !== 'string' || !q.text) {
      throw new Error(`Question ${index + 1} must have a text property`);
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Question ${index + 1} must have at least 2 options`);
    }
    if (!q.options.every(opt => typeof opt === 'string')) {
      throw new Error(`Question ${index + 1} options must be strings`);
    }
    if (typeof q.correctAnswer !== 'number' || 
        q.correctAnswer < 0 || 
        q.correctAnswer >= q.options.length) {
      throw new Error(`Question ${index + 1} must have a valid correctAnswer`);
    }
    if (typeof q.explanation !== 'string' || !q.explanation) {
      throw new Error(`Question ${index + 1} must have an explanation`);
    }
    return true;
  });
}

function validateAIResponse(data: any): AIResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Response must be an object');
  }

  if (!Array.isArray(data.questions)) {
    throw new Error('Questions must be an array');
  }

  validateQuestions(data.questions);

  if (!Array.isArray(data.topics)) {
    throw new Error('Topics must be an array');
  }

  if (!data.topics.every(t => typeof t === 'string')) {
    throw new Error('Topics must be strings');
  }

  if (!Array.isArray(data.improvementAreas)) {
    throw new Error('ImprovementAreas must be an array');
  }

  if (!data.improvementAreas.every(a => 
    typeof a === 'object' &&
    a !== null &&
    typeof a.topic === 'string' &&
    typeof a.description === 'string'
  )) {
    throw new Error('Invalid improvementAreas format');
  }

  return data as AIResponse;
}

export async function generateQuestionsForSubject(
  subject: string,
  startChapter?: number,
  endChapter?: number
): Promise<AIResponse> {
  try {
    const prompt = `
      Generate 5 multiple choice questions for ${subject} ${
        startChapter && endChapter
          ? `covering chapters ${startChapter} to ${endChapter}`
          : ''
      } with the following requirements:
      - Each question must have 4 options
      - One option must be correct
      - Include a detailed explanation for the correct answer
      - Questions should test understanding, not just memorization
      - Include relevant topics and areas for improvement
      
      The response MUST be a valid JSON object with EXACTLY this structure:
      {
        "questions": [
          {
            "text": "What is the question?",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": 0,
            "explanation": "Why this answer is correct"
          }
        ],
        "topics": ["topic1", "topic2"],
        "improvementAreas": [
          {
            "topic": "specific topic",
            "description": "what to improve"
          }
        ]
      }
    `;

    const response = await axios.post(`${API_URL}/ask`, {
      user_question: prompt,
      subject: subject,
      startChapter,
      endChapter,
    });

    if (!response.data?.response) {
      throw new Error('No response data received from AI service');
    }

    const cleanedResponse = cleanJsonResponse(response.data.response);
    const parsedResponse = JSON.parse(cleanedResponse);
    return validateAIResponse(parsedResponse);
  } catch (error) {
    // Create a plain error object without symbols
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to generate questions';
    
    throw new Error(errorMessage);
  }
}

export async function analyzePDFContent(content: string): Promise<AIResponse> {
  try {
    const prompt = `
      Analyze this educational content and create:
      1. A set of 5 multiple choice questions with explanations
      2. Key topics covered
      3. Areas for improvement based on content complexity
    `;

    const response = await axios.post(`${API_URL}/ask`, {
      user_question: prompt,
      content: content,
      subject: 'uploaded'
    });

    if (!response.data?.response) {
      throw new Error('No response data received from AI service');
    }

    const cleanedResponse = cleanJsonResponse(response.data.response);
    const parsedResponse = JSON.parse(cleanedResponse);
    return validateAIResponse(parsedResponse);
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to analyze PDF';
    
    throw new Error(errorMessage);
  }
}

export async function generatePersonalizedFeedback(
  answers: { correct: boolean; questionIndex: number }[], 
  topics: string[]
): Promise<{
  strengths: string[];
  weaknesses: string[];
  recommendations: {
    topic: string;
    action: string;
    resources: string[];
  }[];
}> {
  try {
    const prompt = `
      Based on these quiz answers and topics, provide personalized learning feedback.
      Quiz data:
      Answers: ${JSON.stringify(answers)}
      Topics: ${JSON.stringify(topics)}
    `;

    const response = await axios.post(`${API_URL}/ask`, {
      user_question: prompt,
      answers: answers,
      topics: topics
    });

    if (!response.data?.response) {
      throw new Error('No feedback data received from AI service');
    }

    const cleanedResponse = cleanJsonResponse(response.data.response);
    const parsedResponse = JSON.parse(cleanedResponse);

    if (!parsedResponse.strengths || !parsedResponse.weaknesses || !parsedResponse.recommendations) {
      throw new Error('Invalid feedback format');
    }

    return parsedResponse;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to generate feedback';
    
    throw new Error(errorMessage);
  }
}