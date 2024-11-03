import axios from 'axios';

const API_URL = ' http://127.0.0.1:8000';

function cleanJsonResponse(response: string): string {
  // Remove any markdown code block syntax
  let cleaned = response.replace(/```json\n?|\n?```/g, '');
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  return cleaned;
}

export async function analyzePDFContent(content: string) {
  try {
    const prompt = `
      Analyze this educational content and create:
      1. A set of 10 multiple choice questions with explanations
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

    const response = await axios.post(`${API_URL}/ask`, {
      user_quation: prompt,
      content: content
    });

    const cleanedResponse = cleanJsonResponse(response.data.response);
    
    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse response:', cleanedResponse);
      throw new Error('Invalid response format from AI service');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to analyze PDF: ${error.message}`);
    }
    throw new Error('Failed to analyze PDF');
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
    `;

    const response = await axios.post(`${API_URL}/ask`, {
      user_quation: prompt
    });

    const cleanedResponse = cleanJsonResponse(response.data.response);
    
    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse feedback response:', cleanedResponse);
      throw new Error('Invalid feedback format from AI service');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate feedback: ${error.message}`);
    }
    throw new Error('Failed to generate feedback');
  }
}