const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const port = 6900;
const website = "RadixCode";
const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
//!tutorialdan orijinal olan Hansiki  => io.sockets.clients().connected;   => ashibka verdi biz Ozumuz PublicChatdaki kimi yazdk
//customize etdik 
const getOnlineUsers = () => {
    let clients = io.sockets.clients().connected;
    let sockets = Object.values(clients);
    let users = sockets.map(s => s.user);
    return users.filter(u => u !== undefined);
};

io.on("connection", function (socket) {

    const emitOnlineUsers = () => {
        socket.broadcast.emit("users", getOnlineUsers());
    };

    socket.on("add_user", user => {
        socket.emit("server_message", {
            name: website,
            message: `Welcome to ${website} chat !`
        });

        socket.broadcast.emit("server_message", {
            name: website,
            message: `${user.name} just Joined Chat`
        });

        socket.user = user;
        emitOnlineUsers();
    });

    socket.on("message", message => {
        message.name = socket.user.name;
        socket.broadcast.emit("message", message);
    });

    socket.on("typing", () => {
        const name = socket.user.name;
        socket.broadcast.emit("typing", `${name} is typing`);
    });

    socket.on("stopped_typing", () => {
        socket.broadcast.emit("stopped_typing");
    });

    socket.on("disconnect", function () {
        const { user } = socket;

        if (user) {
            socket.broadcast.emit("server_message", {
                name: website,
                message: `${user.name} just left chat`
            });
        }

        emitOnlineUsers();
    });
});

server.listen(port, () => {
    console.log(`Listening on *:${port}`);
});
