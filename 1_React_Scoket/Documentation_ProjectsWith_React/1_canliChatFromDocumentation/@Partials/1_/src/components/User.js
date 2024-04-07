// User.js
import React from 'react';
import StatusIcon from './StatusIcon';
import './User.css'; // Assume you have a separate CSS file

const User = ({ user, selected, onSelect }) => {
  const status = user.connected ? 'online' : 'offline';

  const onClick = () => {
    onSelect();
  };

  return (
    <div className={`user ${selected ? 'selected' : ''}`} onClick={onClick}>
      <div className="description">
        <div className="name">
          {user.username} {user.self ? ' (yourself)' : ''}
        </div>
        <div className="status">
          <StatusIcon connected={user.connected} />
          {status}
        </div>
      </div>
      {user.hasNewMessages && <div className="new-messages">!</div>}
    </div>
  );
};

export default User;
