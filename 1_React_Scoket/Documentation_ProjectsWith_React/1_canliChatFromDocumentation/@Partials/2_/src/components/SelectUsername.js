// SelectUsername.js
import React, { useState } from 'react';
import './SelectUsername.css'; // Assume you have a separate CSS file

const SelectUsername = ({ onInput }) => {
  const [username, setUsername] = useState('');

  const isValid = username.length > 2;

  const onSubmit = (event) => {
    event.preventDefault();
    if (isValid) onInput(username);
  };

  return (
    <div className="select-username">
      <form onSubmit={onSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username..." />
        <button type="submit" disabled={!isValid}>Send</button>
      </form>
    </div>
  );
};

export default SelectUsername;
