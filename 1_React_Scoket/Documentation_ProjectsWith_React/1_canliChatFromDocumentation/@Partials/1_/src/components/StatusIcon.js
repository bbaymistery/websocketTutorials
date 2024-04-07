// StatusIcon.js
import React from 'react';
import './StatusIcon.css'; // Assume you have a separate CSS file

const StatusIcon = ({ connected }) => {
  // The classnames package could be used here for more complex class logic,
  // but for simplicity, we'll concatenate strings directly.
  const iconClass = `icon${connected ? ' connected' : ''}`;

  return <i className={iconClass}></i>;
};

export default StatusIcon;
