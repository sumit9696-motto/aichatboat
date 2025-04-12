import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load chat history on component mount
    loadChatHistory();
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/chat/history');
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    try {
      setLoading(true);
      
      // Optimistically update UI with user message
      const userMessage = { role: 'user', content: message };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Send message to API
      const response = await api.post('/chat/send', { message });
      
      // Add AI response to messages
      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message to user
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await api.delete('/chat/clear');
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Student Assistant Chatbot</h2>
        <button onClick={handleClearChat} className="clear-chat-btn">
          Clear Chat
        </button>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h3>Welcome to the Technical Education Assistant!</h3>
            <p>How can I help you today? You can ask me about:</p>
            <ul>
              <li>Course information</li>
              <li>Admission procedures</li>
              <li>Exam schedules</li>
              <li>Academic resources</li>
              <li>Technical concepts</li>
              <li>Career guidance</li>
            </ul>
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage 
              key={index} 
              message={msg.content} 
              isUser={msg.role === 'user'} 
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatBox;