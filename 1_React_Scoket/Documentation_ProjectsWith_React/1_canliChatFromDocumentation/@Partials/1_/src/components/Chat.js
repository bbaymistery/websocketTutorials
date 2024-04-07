// Chat.js
import React, { useState, useEffect } from 'react';
import User from './User';
import MessagePanel from './MessagePanel';
import socket from '../socket';
import './Chat.css'; // Assume you have a separate CSS file

const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);

    const [useSelectedIndex, setUseSelectedIndex] = useState(null)
    useEffect(() => {
        const initReactiveProperties = (user) => {
            user.connected = true;
            user.messages = [];
            user.hasNewMessages = false;
        };

        socket.on('connect', () => {
            setUsers((currentUsers) =>
                currentUsers.map((user) => {
                    if (user.self) {
                        return { ...user, connected: true };
                    }
                    return user;
                }),
            );
        });

        socket.on('disconnect', () => {
            setUsers((currentUsers) =>
                currentUsers.map((user) => {
                    if (user.self) {
                        return { ...user, connected: false };
                    }
                    return user;
                }),
            );
        });

        socket.on('users', (users) => {
            const updatedUsers = users.map((user) => {
                user.self = user.userID === socket.id;
                initReactiveProperties(user);
                return user;
            }).sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                return a.username.localeCompare(b.username);
            });
            setUsers(updatedUsers);
        });

        //her user gelende Menim ekranimda gelen cixan gorunecek
        socket.on('user connected', (user) => {
            initReactiveProperties(user);
            setUsers((currentUsers) => [...currentUsers, user]);
        });

        socket.on('user disconnected', (id) => {
            setUsers((currentUsers) =>
                currentUsers.map((user) => {
                    if (user.userID === id) {
                        return { ...user, connected: false };
                    }
                    return user;
                }),
            );
        });

        socket.on('private message', ({ content, from }) => {
            setUsers((currentUsers) =>
                currentUsers.map((user) => {
                    //yazan Adam nermin Nerminin mesajlarin icine Yazdigi mesaji ekliyirik
                    if (user.userID === from) {
                        const newMessages = [...user.messages, { content, fromSelf: false }];
                        return {
                            ...user,
                            messages: newMessages,
                            hasNewMessages: user !== selectedUser,
                        };
                    }
                    return user;
                }),
            );
        });

        // Cleanup function to run when the component is unmounted
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('users');
            socket.off('user connected');
            socket.off('user disconnected');
            socket.off('private message');
        };
    }, [selectedUser]);

    const onMessage = (content) => {
        if (selectedUser) {
            //burda birinci men mesaji yazb Kime gonderecegimi (to)
            //ve content() seklinde olusduruam 
            //atiram servere =>
            //server onu    socket.on("private message", ({ content, to }) => {     seklinde alr 
           //ve     socket.to(to)   Kime gondermisikse onun mesajlarin icine atr )
           //sorada  73.CU satrdaki kimi onu client terefde filterleyr
            socket.emit('private message', {
                content,
                to: selectedUser.userID,
            });
            setSelectedUser({
                ...selectedUser,
                messages: [...selectedUser.messages, { content, fromSelf: true }],
            });
        }
    };

    const onSelectUser = (user) => {
        setSelectedUser({ ...user, hasNewMessages: false });
    };
console.log(users);


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
