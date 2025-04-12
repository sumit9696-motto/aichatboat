import React from 'react';

const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-avatar">
        {isUser ? (
          <span className="user-avatar">👤</span>
        ) : (
          <span className="bot-avatar">🤖</span>
        )}
      </div>
      <div className="message-content">
        <div className="message-text">{message}</div>
      </div>
    </div>
  );
};

export default ChatMessage;