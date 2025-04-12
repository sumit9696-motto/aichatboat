// Import node-fetch using dynamic import instead of require
let fetch;

// Function to initialize fetch
const initializeFetch = async () => {
  try {
    const fetchModule = await import('node-fetch');
    fetch = fetchModule.default;
    return fetch;
  } catch (error) {
    console.error('Error importing node-fetch:', error);
    throw error;
  }
};

/**
 * Service to interact with Google's Gemini API
 * Uses the free tier of Gemini API
 */
const generateAIResponse = async (messages, userContext = {}) => {
  try {
    // Initialize fetch if it hasn't been initialized yet
    if (!fetch) {
      await initializeFetch();
    }
    
    // Gemini API endpoint - free tier
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    // Your Gemini API key (free tier)
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCAnWyfz9p5kJndXMVNMjF5kjJRx_BeAoc';
    
    // Format the conversation for Gemini
    const formattedMessages = formatMessagesForGemini(messages, userContext);
    
    // Make the API request
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
          topP: 0.95,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    const data = await response.json();
    
    // Error handling
    if (!response.ok) {
      console.error('Gemini API error:', data);
      return "I'm sorry, I encountered an error. Please try again later.";
    }
    
    // Extract and return the response text
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Unexpected Gemini API response format:', data);
      return "I'm sorry, I couldn't generate a response. Please try again later.";
    }
    
  } catch (error) {
    console.error('AI Service Error:', error);
    return "I'm sorry, I encountered a technical error. Please try again later.";
  }
};

/**
 * Format messages for Gemini API
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} userContext - User context information
 * @returns {Array} - Formatted messages for Gemini API
 */
const formatMessagesForGemini = (messages, userContext) => {
  // Create system message with student context
  const systemMessage = {
    role: "model",
    parts: [{
      text: `You are a helpful assistant for the Department of Technical Education, Government of Rajasthan. 
      Your goal is to assist students with their technical education queries.
      Student context: Course: ${userContext.course || 'Not specified'}, 
      Year: ${userContext.yearOfStudy || 'Not specified'},
      Institution: ${userContext.institution || 'Not specified'}
      
      Please provide concise, accurate, and helpful responses for technical education topics including:
      - Course materials and curriculum
      - Exam preparation
      - Technical concepts and explanations
      - Department policies and procedures
      - Career guidance related to technical fields
      - Scholarship and funding opportunities
      - Research and project ideas
      
      Always maintain a professional and supportive tone.`
    }]
  };

  // Format conversation history
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Return with system message first
  return [systemMessage, ...formattedMessages];
};

module.exports = { generateAIResponse };


// // Import node-fetch using dynamic import instead of require
// let fetch;

// // Function to initialize fetch
// const initializeFetch = async () => {
//   try {
//     const fetchModule = await import('node-fetch');
//     fetch = fetchModule.default;
//     return fetch;
//   } catch (error) {
//     console.error('Error importing node-fetch:', error);
//     throw error;
//   }
// };


// /**
//  * Fetch data from Hugging Face dataset
//  * @param {string} dataset - Name of the dataset
//  * @param {Object} options - Fetch options
//  * @returns {Promise} - Dataset rows and metadata
//  */
// const fetchHuggingFaceDataset = async (dataset, options = {}) => {
//   try {
//     const { 
//       offset = 0, 
//       length = 100, 
//       config = 'default', 
//       split = 'train' 
//     } = options;

//     const datasetUrl = `https://datasets-server.huggingface.co/rows?dataset=${encodeURIComponent(dataset)}&config=${config}&split=${split}&offset=${offset}&length=${length}`;

//     const response = await fetch(datasetUrl);
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return {
//       rows: data.rows,
//       numRowsTotal: data.num_rows_total,
//       numRowsPerPage: data.num_rows_per_page,
//       partial: data.partial
//     };
//   } catch (error) {
//     console.error('Hugging Face Dataset Fetch Error:', error);
//     throw error;
//   }
// };

// /**
//  * Service to interact with Google's Gemini API
//  * Uses the free tier of Gemini API
//  */
// const generateAIResponse = async (messages, userContext = {}, datasetContext = null) => {
//   try {
//     // Gemini API endpoint - free tier
//     const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
//     // Your Gemini API key (free tier)
//     const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCAnWyfz9p5kJndXMVNMjF5kjJRx_BeAoc';
    
//     // Format the conversation for Gemini
//     const formattedMessages = formatMessagesForGemini(messages, userContext, datasetContext);
    
//     // Make the API request
//     const response = await fetch(`${apiUrl}?key=${apiKey}`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         contents: formattedMessages,
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 800,
//           topP: 0.95,
//           topK: 40
//         },
//         safetySettings: [
//           {
//             category: "HARM_CATEGORY_HARASSMENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE"
//           },
//           {
//             category: "HARM_CATEGORY_HATE_SPEECH",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE"
//           },
//           {
//             category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE"
//           },
//           {
//             category: "HARM_CATEGORY_DANGEROUS_CONTENT",
//             threshold: "BLOCK_MEDIUM_AND_ABOVE"
//           }
//         ]
//       })
//     });

//     const data = await response.json();
    
//     // Error handling
//     if (!response.ok) {
//       console.error('Gemini API error:', data);
//       return "I'm sorry, I encountered an error. Please try again later.";
//     }
    
//     // Extract and return the response text
//     if (data.candidates && data.candidates[0] && data.candidates[0].content) {
//       return data.candidates[0].content.parts[0].text;
//     } else {
//       console.error('Unexpected Gemini API response format:', data);
//       return "I'm sorry, I couldn't generate a response. Please try again later.";
//     }
    
//   } catch (error) {
//     console.error('AI Service Error:', error);
//     return "I'm sorry, I encountered a technical error. Please try again later.";
//   }
// };

// /**
//  * Format messages for Gemini API
//  * @param {Array} messages - Array of message objects with role and content
//  * @param {Object} userContext - User context information
//  * @param {Object} datasetContext - Dataset context information
//  * @returns {Array} - Formatted messages for Gemini API
//  */
// const formatMessagesForGemini = (messages, userContext, datasetContext) => {
//   // Create system message with comprehensive context
//   const systemMessage = {
//     role: "model",
//     parts: [{
//       text: `You are a helpful AI assistant with access to contextual information.
      
//       User Context:
//       - Course: ${userContext.course || 'Not specified'}
//       - Year: ${userContext.yearOfStudy || 'Not specified'}
//       - Institution: ${userContext.institution || 'Not specified'}
      
//       ${datasetContext ? `Dataset Context:
//       - Dataset Name: ${datasetContext.name || 'Unknown'}
//       - Total Rows: ${datasetContext.numRowsTotal || 'N/A'}
//       - Rows in Current Page: ${datasetContext.numRowsPerPage || 'N/A'}
//       ` : ''}
      
//       Provide accurate, contextually relevant, and helpful responses.`
//     }]
//   };

//   // Format conversation history
//   const formattedMessages = messages.map(msg => ({
//     role: msg.role === 'user' ? 'user' : 'model',
//     parts: [{ text: msg.content }]
//   }));

//   // Return with system message first
//   return [systemMessage, ...formattedMessages];
// };

// /**
//  * Main service function to integrate Hugging Face dataset and Gemini API
//  * @param {Object} options - Configuration options
//  * @returns {Promise} - Processed AI response with dataset context
//  */
// const processDatasetWithAI = async (options = {}) => {
//   const { 
//     dataset = 'Neha13/ChatBot_Nirma_Dataset', 
//     messages = [], 
//     userContext = {},
//     fetchOptions = {} 
//   } = options;

//   try {
//     // Fetch dataset
//     const datasetResult = await fetchHuggingFaceDataset(dataset, fetchOptions);

//     // Prepare dataset context
//     const datasetContext = {
//       name: dataset,
//       numRowsTotal: datasetResult.numRowsTotal,
//       numRowsPerPage: datasetResult.numRowsPerPage
//     };

//     // Generate AI response with dataset context
//     const aiResponse = await generateAIResponse(
//       messages, 
//       userContext, 
//       datasetContext
//     );

//     return {
//       datasetInfo: datasetResult,
//       aiResponse: aiResponse
//     };
//   } catch (error) {
//     console.error('Processing Error:', error);
//     throw error;
//   }
// };

// module.exports = { 
//   fetchHuggingFaceDataset, 
//   generateAIResponse, 
//   processDatasetWithAI 
// };

