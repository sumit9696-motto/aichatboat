import React, { useState } from 'react';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    onSendMessage(message);
    setMessage('');
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        disabled={disabled}
        className="chat-input"
      />
      <button 
        type="submit" 
        className="send-button" 
        disabled={disabled || message.trim() === ''}
      >
        {disabled ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default ChatInput;