
import './App.css';
import React, { useState, useEffect } from 'react';
import SelectUsername from './components/SelectUsername';
import Chat from './components/Chat';
import socket from './socket';

function App() {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");
    
    if (sessionID) {
      setUsernameAlreadySelected(true);
      socket.auth = { sessionID };
      socket.connect();
    }

    const handleSession = ({ sessionID, userID }) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    };

    const handleConnectError = (err) => {
      if (err.message === "invalid username") {
        setUsernameAlreadySelected(false);
      }
    };

    socket.on("session", handleSession);
    socket.on("connect_error", handleConnectError);

    // Cleanup on component unmount
    return () => {
      socket.off("session", handleSession);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  const onUsernameSelection = (username) => {
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
  };

  return (
    <div id="app">
      {!usernameAlreadySelected ? (
        <SelectUsername onInput={onUsernameSelection} />
      ) : (
        <Chat />
      )}
    </div>
  );
}


export default App;
