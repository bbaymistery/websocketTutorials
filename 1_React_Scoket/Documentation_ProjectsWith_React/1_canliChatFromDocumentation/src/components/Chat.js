// Chat.js
import React, { useState, useEffect } from 'react';
import User from './User';
import MessagePanel from './MessagePanel';
import socket from '../socket';
import './Chat.css'; // Assume you have a separate CSS file

const Chat = () => {
 

    const [useSelectedIndex, setUseSelectedIndex] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
  
    useEffect(() => {
      const initReactiveProperties = (user) => {
        user.messages = [];
        user.hasNewMessages = false;
        return user;
      };
  
      socket.on('connect', () => {
        setUsers((currentUsers) =>
          currentUsers.map((user) => ({
            ...user,
            connected: user.self ? true : user.connected,
          }))
        );
      });
  
      socket.on('disconnect', () => {
        setUsers((currentUsers) =>
          currentUsers.map((user) => ({
            ...user,
            connected: user.self ? false : user.connected,
          }))
        );
      });
  
      socket.on('users', (newUsers) => {
        const updatedUsers = newUsers.map((newUser) => {
          const existingUser = users.find((user) => user.userID === newUser.userID);
          if (existingUser) {
            return { ...existingUser, connected: newUser.connected };
          } else {
            newUser.self = newUser.userID === socket.userID;
            return initReactiveProperties(newUser);
          }
        });
  
        setUsers(
          updatedUsers.sort((a, b) => {
            if (a.self) return -1;
            if (b.self) return 1;
            return a.username.localeCompare(b.username);
          })
        );
      });
  
      socket.on('user connected', (user) => {
        setUsers((currentUsers) => {
          const existingIndex = currentUsers.findIndex((u) => u.userID === user.userID);
          if (existingIndex !== -1) {
            const updatedUsers = [...currentUsers];
            updatedUsers[existingIndex] = { ...updatedUsers[existingIndex], connected: true };
            return updatedUsers;
          } else {
            return [...currentUsers, initReactiveProperties(user)];
          }
        });
      });
  
      socket.on('user disconnected', (id) => {
        setUsers((currentUsers) =>
          currentUsers.map((user) => (user.userID === id ? { ...user, connected: false } : user))
        );
      });
  
      socket.on('private message', ({ content, from, to }) => {
        setUsers((currentUsers) =>
          currentUsers.map((user) => {
            const fromSelf = socket.userID === from;
            if (user.userID === (fromSelf ? to : from)) {
              const newUser = { ...user, messages: [...user.messages, { content, fromSelf }] };
              if (user !== selectedUser) {
                newUser.hasNewMessages = true;
              }
              return newUser;
            }
            return user;
          })
        );
      });
  
      // Cleanup on component unmount
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('users');
        socket.off('user connected');
        socket.off('user disconnected');
        socket.off('private message');
      };
    }, [selectedUser, users]);
  
    const onMessage = (content) => {
      if (selectedUser) {
        socket.emit('private message', {
          content,
          to: selectedUser.userID,
        });
        setSelectedUser((currentUser) => ({
          ...currentUser,
          messages: [...currentUser.messages, { content, fromSelf: true }],
        }));
      }
    };
  
    const onSelectUser = (user) => {
      setSelectedUser({ ...user, hasNewMessages: false });
    };
  

    return (
        <div>
            <div className="left-panel">
                {users.map((user,i) => {
                    return <User key={user.userID} user={user} setUseSelectedIndex={()=>setUseSelectedIndex(i)} selected={useSelectedIndex === i} onSelect={() => onSelectUser(user)} />
                })}
            </div>
            {selectedUser && (<MessagePanel user={selectedUser} onInput={onMessage} className="right-panel" />)}
        </div>
    );
};

export default Chat;
