import axios from 'axios';
// import { useState } from 'react';

// const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'https://tuned-models.onrender.com';
// const API_URL = 'https://python-gemini-doc-backend.onrender.com';
// const [selectedSubject, setselectedSubject] = useState("");

// implement useEffect here to fetch the users grade level from localstorage here
// Get user grade level from localStorage
let userGradeLevel: number;
const getUserGradeLevel = () => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      return parsedUser.user_grade_level;
    }
  } catch (error) {
    console.error("Error getting user grade level from localStorage:", error);
    return 12; // Default to grade 12 if there's an error
  }
};

userGradeLevel = getUserGradeLevel();


function cleanJsonResponse(response: string): string {
  try {
    // Check if the response is Python code
    if (response.includes('def generate') || response.trim().startsWith('def ')) {
      console.log('Detected Python code in response, attempting to extract JSON data');
      
      // Look for return statement with JSON data
      const returnMatch = response.match(/return\s+({[\s\S]*})/);
      if (returnMatch && returnMatch[1]) {
        // Extract the JSON object from the return statement
        let jsonStr = returnMatch[1].trim();
        
        // Replace Python syntax with JSON syntax
        jsonStr = jsonStr
          .replace(/'/g, '"')                 // Replace single quotes with double quotes
          .replace(/True/g, 'true')           // Replace Python True with JSON true
          .replace(/False/g, 'false')         // Replace Python False with JSON false
          .replace(/None/g, 'null');          // Replace Python None with JSON null
        
        return fixJsonSyntax(jsonStr);
      }
      
      // If we can't find a return statement, look for a dictionary definition
      const dictMatch = response.match(/question_set\s*=\s*(\[[\s\S]*?\])/);
      const topicsMatch = response.match(/topics\s*=\s*(\[[\s\S]*?\])/);
      const improvementMatch = response.match(/improvementAreas\s*=\s*(\[[\s\S]*?\])/);
      
      if (dictMatch && topicsMatch && improvementMatch) {
        let questions = dictMatch[1]
          .replace(/'/g, '"')
          .replace(/True/g, 'true')
          .replace(/False/g, 'false')
          .replace(/None/g, 'null');
          
        let topics = topicsMatch[1]
          .replace(/'/g, '"')
          .replace(/True/g, 'true')
          .replace(/False/g, 'false')
          .replace(/None/g, 'null');
          
        let improvements = improvementMatch[1]
          .replace(/'/g, '"')
          .replace(/True/g, 'true')
          .replace(/False/g, 'false')
          .replace(/None/g, 'null');
          
        return fixJsonSyntax(`{"questions": ${questions}, "topics": ${topics}, "improvementAreas": ${improvements}}`);
      }
    }
    
    // Standard JSON cleaning
    let cleaned = response.replace(/```(?:json|python)?\n?|\n?```/g, '');
    
    // Find the first { and last } to extract just the JSON part
    const startIndex = cleaned.indexOf('{');
    const endIndex = cleaned.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1) {
      cleaned = cleaned.substring(startIndex, endIndex + 1);
    }
    
    cleaned = cleaned.trim();
    return fixJsonSyntax(cleaned);
  } catch (error) {
    console.error('Error cleaning JSON response:', error);
    throw new Error('Failed to clean response');
  }
}

// Function to fix common JSON syntax errors
function fixJsonSyntax(jsonStr: string): string {
  try {
    // Try parsing as is first
    JSON.parse(jsonStr);
    return jsonStr;
  } catch (error) {
    console.log('Attempting to fix JSON syntax errors');
    
    // Fix missing quotes in array elements
    let fixed = jsonStr;
    
    // Fix missing closing quotes in array elements
    fixed = fixed.replace(/\[\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)(?!\s*")/g, '["$1", "$2", "$3", "$4"');
    
    // Fix missing opening quotes in array elements
    fixed = fixed.replace(/\[\s*([^"][^,]*),\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)"\s*\]/g, '["$1", "$2", "$3", "$4"]');
    
    // Fix missing quotes in the middle of arrays
    fixed = fixed.replace(/",\s*([^"][^,]*),\s*"/g, '", "$1", "');
    
    // Fix missing quotes around property names
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3');
    
    // Fix missing commas between array elements
    fixed = fixed.replace(/"([^"]*)"\s*"([^"]*)"/g, '"$1", "$2"');
    
    // Fix missing commas between objects in arrays
    fixed = fixed.replace(/}\s*{/g, '}, {');
    
    // Fix trailing commas in arrays and objects
    fixed = fixed.replace(/,\s*}/g, '}');
    fixed = fixed.replace(/,\s*\]/g, ']');
    
    try {
      // Verify the fixed JSON is valid
      JSON.parse(fixed);
      return fixed;
    } catch (fixError) {
      console.error('Failed to fix JSON syntax:', fixError);
      
      // Try a more aggressive approach - manually fix the specific error in the example
      if (jsonStr.includes('"Normal force]')) {
        fixed = jsonStr.replace('"Normal force]', '"Normal force"]');
        
        try {
          JSON.parse(fixed);
          return fixed;
        } catch (e) {
          console.error('Failed to fix specific JSON error');
        }
      }
      
      throw new Error('Failed to fix JSON syntax errors');
    }
  }
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
    console.log('Generating questions for subject:', subject);
    console.log('difficulty level:', difficulty);

    const prompt = `
    IMPORTANT: You MUST respond with ONLY a valid JSON object. DO NOT return Python code.
    
    Generate ${subject} questions with difficulty level: ${difficulty}
    
    Return ONLY this JSON structure with proper JSON syntax:
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
    
    Requirements:
    1. Generate 5 multiple choice questions
    2. Each question must have exactly 4 options
    3. Provide detailed explanations
    4. Cover diverse topics within ${subject}
    5. Match the ${difficulty} difficulty level
    6. DO NOT RETURN PYTHON CODE OR FUNCTIONS
    7. ENSURE ALL QUOTES ARE PROPERLY CLOSED
    `;

    const response = await axios.post(`${API_URL}/api/tuned-model/generate`, {
      question: prompt,
      subject: subject,
      grade: userGradeLevel
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

      // Validate and fix each question
      parsedResponse.questions = parsedResponse.questions.map((question: any, index: number) => {
        // Ensure all required fields exist
        if (!question.text) question.text = `Question ${index + 1}`;
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          question.options = question.options || [];
          // Fill missing options
          while (question.options.length < 4) {
            question.options.push(`Option ${question.options.length + 1}`);
          }
        }
        if (typeof question.correctAnswer !== 'number' || question.correctAnswer < 0 || question.correctAnswer > 3) {
          question.correctAnswer = 0;
        }
        if (!question.explanation) {
          question.explanation = `Explanation for question ${index + 1}`;
        }
        return question;
      });

      // Ensure topics and improvementAreas exist
      if (!Array.isArray(parsedResponse.topics) || parsedResponse.topics.length === 0) {
        parsedResponse.topics = [`${subject} Topics`];
      }
      
      if (!Array.isArray(parsedResponse.improvementAreas) || parsedResponse.improvementAreas.length === 0) {
        parsedResponse.improvementAreas = [{
          topic: `${subject} Study`,
          description: "Review the material and practice more questions."
        }];
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
Based on the provided quiz answers and topics, analyze the user's performance to offer personalized learning feedback. Identify strengths and weaknesses. For each weakness, generate specific improvement actions and recommend relevant online resources such as websites and YouTube videos url for youtube like this https://www.youtube.com/results?search_query=topic_name and for the websites like this https://www.google.com/search?q=topic_name. If no weaknesses are found, add an encouraging narrative in the strengths section to motivate the user.

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
      subject: subject,
      grade: userGradeLevel 
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
