import axios from 'axios';
// import { useState } from 'react';

// const API_URL = 'http://0.0.0.0:8001';
const API_URL = 'http://127.0.0.1:8000';
// const [selectedSubject, setselectedSubject] = useState("");

function cleanJsonResponse(response: string): string {
  let cleaned = response.replace(/```json\n?|\n?```/g, '');
  cleaned = cleaned.trim();
  return cleaned;
}

// For analyzing uploaded PDF content
export async function analyzePDFContent(content: string) {
  try {
    const prompt = `
      Analyze this educational content and create:
      1. A set of 5 multiple choice questions with explanations
      2. Key topics covered
      3. Areas for improvement based on content complexity
      
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
      user_quation: prompt,
      content: content, // Including content for the PDF analysis
      subject: "uploaded"
    });

    if (!response.data || !response.data.response) {
      throw new Error('Invalid response format from server');
    }

    const cleanedResponse = cleanJsonResponse(response.data.response);

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
export async function generateQuestionsForSubject(subject: string) {
  try {
    // setselectedSubject(subject);
    console.log('Generating questions for subject:', subject);

    const prompt = `
      Generate a set of questions for ${subject}:
      1. A set of 5 multiple choice questions with explanations
      2. Key topics covered
      3. Areas for improvement based on content complexity
      
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

    const response = await axios.post(`${API_URL}/process_pdf`, {
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

export async function generatePersonalizedFeedback(answers: any[], topics: string[]) {
  try {
    const prompt = `
      Based on these quiz answers and topics, provide personalized learning feedback.
      Return ONLY a JSON object with this exact structure (no markdown, no explanations):
      {
        "strengths": ["strength1", "strength2"],
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
      `
      ;

    const response = await axios.post(`${API_URL}/process_pdf`, {
      question: prompt,
      answers: answers,
      topics: topics
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