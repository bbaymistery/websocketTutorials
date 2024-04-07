// MessagePanel.js
import React, { useState } from 'react';
import StatusIcon from './StatusIcon';
import './MessagePanel.css'; // Assume you have a separate CSS file

const MessagePanel = ({ user, onInput }) => {
  const [input, setInput] = useState('');

  const displaySender = (message, index) => {
    return (  index === 0 ||   user.messages[index - 1].fromSelf !== message.fromSelf );
  };

  const isValid = input.length > 0;

  const onSubmit = (event) => {
    event.preventDefault();
    if (isValid) {
      onInput(input);
      setInput('');
    }
  };

  return (
    <div style={{marginLeft:"400px"}}>
      <div className="header">
        <StatusIcon connected={user.connected} />
        {user.username}
      </div>

      <ul className="messages">
        {user.messages.map((message, index) => (
          <li key={index} className="message">
            {displaySender(message, index) && (
              <div className="sender">
                {message.fromSelf ? "(yourself)" : user.username}
              </div>
            )}
            {message.content}
          </li>
        ))}
      </ul>

      <form onSubmit={onSubmit} className="form">
        <textarea  value={input} onChange={(e) => setInput(e.target.value)} placeholder="Your message..." className="input" />
        <button disabled={!isValid} className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessagePanel;
