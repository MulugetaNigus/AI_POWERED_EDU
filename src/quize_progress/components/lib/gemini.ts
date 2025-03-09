import axios from 'axios';
// import { useState } from 'react';

// const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'http://localhost:3000';
// const API_URL = 'https://python-gemini-doc-backend.onrender.com';
// const [selectedSubject, setselectedSubject] = useState("");

function cleanJsonResponse(response: string): string {
  let cleaned = response.replace(/```json\n?|\n?```/g, '');
  cleaned = cleaned.trim();
  return cleaned;
}

// difficulty types
// type difficultyLevel = "easy" | "medium" | "hard";

// For analyzing uploaded PDF content
export async function analyzePDFContent(content: string) {
  try {
    const prompt = `
      Analyze this educational content and create:
      1. A set of 5 multiple choice questions with explanations
      2. Key topics covered
      
      Return ONLY a JSON object with this exact structure (no markdown, no explanations):
      {
        "questions": [
          {
            "text": "question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": 0,
            "explanation": "detailed explanation"
          }
        ],
        "topics": ["topic1", "topic2"],
        "improvementAreas": [
          {
            "topic": "topic name",
            "description": "improvement details"
          }
        ]
      }
    `;

    // const response = await axios.post(`${API_URL}/ask`, {
    const response = await axios.post(`${API_URL}/process_pdf`, {
      // process_pdf
      question: prompt,
      content: content,
      subject: "uploaded"
    });

    if (!response.data || !response.data.answer) {
      throw new Error('Invalid response format from server');
    }

    const cleanedResponse = cleanJsonResponse(response.data.answer);

    try {
      const parsedResponse = JSON.parse(cleanedResponse);

      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid questions format in response');
      }

      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse response:', cleanedResponse);
      throw new Error('Invalid response format from AI service');
    }
  } catch (error) {
    console.error('PDF analysis error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Server error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to analyze PDF');
  }
}


// For generating questions based on a selected subject
export async function generateQuestionsForSubject(subject: string, difficulty: string) {
  try {
    // setselectedSubject(subject);
    console.log('Generating questions for subject:', subject);
    console.log('difficulty level:', difficulty);

    const prompt = `
    Generate a unique and varity set of questions for ${subject} with a specified difficulty level ${difficulty} your questions generation is based on the provided difficulty:${difficulty} , every time this function is called. Ensure that:
    1. Each set includes 5 multiple choice questions with diverse topics, question types, and difficulty levels.
    2. Provide detailed explanations for each correct answer.
    3. Cover key topics related to the subject, ensuring no repetition of questions from previous sets.
    4. Identify areas for improvement based on content complexity and include relevant suggestions.
    
    Return ONLY a JSON object with the following structure (no markdown, no explanations):
    
    {
      "questions": [
        {
          "text": "question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": 0,
          "explanation": "detailed explanation"
        }
      ],
      "topics": ["topic1", "topic2"],
      "improvementAreas": [
        {
          "topic": "topic name",
          "description": "improvement details"
        }
      ]
    }
    `;
    

    const response = await axios.post(`${API_URL}/api/tuned-model/generate`, {
      question: prompt,
      subject: subject // Sending subject name directly
    });

    if (!response.data || !response.data.answer) {
      throw new Error('Invalid response format from server');
    }

    const cleanedResponse = cleanJsonResponse(response.data.answer);

    if (!cleanedResponse || typeof cleanedResponse !== 'string') {
      throw new Error('Cleaned response is not a valid JSON string');
    }

    try {
      const parsedResponse = JSON.parse(cleanedResponse);

      if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
        throw new Error('Invalid questions format in response');
      }

      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse response:', cleanedResponse);
      throw new Error('Invalid response format from AI service');
    }
  } catch (error) {
    console.error('Question generation error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Server error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to generate questions');
  }
}

export async function generatePersonalizedFeedback(answers: any[], topics: string[], subject: string) {
  try {
    const prompt = `
Based on the provided quiz answers and topics, analyze the user's performance to offer personalized learning feedback. Identify strengths and weaknesses. For each weakness, generate specific improvement actions and recommend relevant online resources such as websites and YouTube links. If no weaknesses are found, add an encouraging narrative in the strengths section to motivate the user.

Return ONLY a JSON object with the following structure (no additional explanations or markdown):

{
  "strengths": ["strength1", "strength2", "motivationalMessage"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": [
    {
      "topic": "topic name",
      "action": "specific improvement action",
      "resources": ["resource1", "resource2"]
    }
  ]
}

Quiz data:
Answers: ${JSON.stringify(answers)}
Topics: ${JSON.stringify(topics)}
`;


    const response = await axios.post(`${API_URL}/api/tuned-model/generate`, {
      question: prompt,
      answers: answers,
      topics: topics,
      // subject: subject
      subject: "grade6english"
      // grade6english
    });

    if (!response.data || !response.data.answer) {
      throw new Error('Invalid response format from server');
    }

    const cleanedResponse = cleanJsonResponse(response.data.answer);

    try {
      const parsedResponse = JSON.parse(cleanedResponse);

      // Validate response structure
      if (!parsedResponse.strengths || !parsedResponse.weaknesses || !parsedResponse.recommendations) {
        throw new Error('Invalid feedback format in response');
      }

      return parsedResponse;
    } catch (parseError) {
      console.error('Failed to parse feedback response:', cleanedResponse);
      throw new Error('Invalid feedback format from AI service');
    }
  } catch (error) {
    console.error('Feedback generation error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Server error: ${error.response?.data?.message || error.message}`);
    }
    if (error instanceof Error) {
      throw new Error(`Failed to generate feedback: ${error.message}`);
    }
    throw new Error('Failed to generate feedback');
  }
}