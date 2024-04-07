
import './App.css';
import { Route, Routes } from "react-router-dom";
import { BrowserRouter as Router, } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import SelectUsername from './components/SelectUsername';
import Chat from './components/Chat';
import socket from './socket';

const App = () => {
  const [usernameAlreadySelected, setUsernameAlreadySelected] = useState(false);

  const onUsernameSelection = (username) => {
    setUsernameAlreadySelected(true);
    socket.auth = { username };
    socket.connect();
  };

  useEffect(() => {
    const handleConnectError = (err) => (err.message === 'invalid username') && setUsernameAlreadySelected(false)
    socket.on('connect_error', handleConnectError);
    // Cleanup function to run when the component is unmounted
    return () => socket.off('connect_error', handleConnectError);
  }, []);

  return (
    <div id="app">
      {!usernameAlreadySelected ? <SelectUsername onInput={onUsernameSelection} /> : <Chat />}
      {/* <Router>
  <Routes>
    {routes.map((r, i) => r.Component ? <Route key={i} path={r.path} element={<r.Component />} /> : null)}
  </Routes>
</Router> */}
    </div>
  );
};

export default App;
