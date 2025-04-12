const ChatHistory = require('../models/ChatHistory');
const User = require('../models/User');
const { generateAIResponse } = require('../utils/aiService');

// Send message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    // Get user context for personalized responses
    const user = await User.findById(userId);
    const userContext = {
      course: user.course,
      yearOfStudy: user.yearOfStudy,
      institution: user.institution
    };

    // Find or create chat history for this user
    let chatHistory = await ChatHistory.findOne({ userId });
    
    if (!chatHistory) {
      chatHistory = new ChatHistory({
        userId,
        messages: []
      });
    }

    // Format messages for AI API
    const formattedMessages = chatHistory.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
// Add new user message
formattedMessages.push({ role: 'user', content: message });

// Get response from AI service
const aiResponse = await generateAIResponse(formattedMessages, userContext);

// Save the message and response to chat history
chatHistory.messages.push({ role: 'user', content: message });
chatHistory.messages.push({ role: 'assistant', content: aiResponse });
chatHistory.updatedAt = Date.now();

await chatHistory.save();

res.json({
  message: 'Message processed successfully',
  response: aiResponse
});
} catch (error) {
console.error('Chat error:', error);
res.status(500).json({ message: 'Server error processing message' });
}
};

// Get chat history for a user
exports.getChatHistory = async (req, res) => {
try {
const userId = req.user.id;

const chatHistory = await ChatHistory.findOne({ userId });

if (!chatHistory) {
  return res.json({ messages: [] });
}

res.json({ messages: chatHistory.messages });
} catch (error) {
console.error('Get chat history error:', error);
res.status(500).json({ message: 'Server error retrieving chat history' });
}
};

// Clear chat history for a user
exports.clearChatHistory = async (req, res) => {
try {
const userId = req.user.id;

await ChatHistory.findOneAndUpdate(
  { userId },
  { $set: { messages: [], updatedAt: Date.now() } },
  { new: true }
);

res.json({ message: 'Chat history cleared successfully' });
} catch (error) {
console.error('Clear chat history error:', error);
res.status(500).json({ message: 'Server error clearing chat history' });
}
};