const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const port = 6800;
const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
    cors: {
        origin: "*", // Be cautious with this setting in production
        methods: ["GET", "POST"]
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const store = {};



io.on("connection", (socket) => {
    socket.on("join_room", (room) => {
        socket.join(room)
    });

    //we send message and data After joining a room
    socket.on("message", (data) => {
        const { room, message } = data
        //we sent message to room and emit meessage event
        socket.to(room).emit("message", {
            message,
            name: 'Friend'
        })


    });

    socket.on("typing", ({ room }) => {
        socket.to(room).emit("typing", "Someone is typing");
    });

    socket.on("stopped_tying", ({ room }) => {
        socket.to(room).emit("stopped_tying");
    });
});

server.listen(port, () => {
    console.log(`Listening on *:${port}`);
});
