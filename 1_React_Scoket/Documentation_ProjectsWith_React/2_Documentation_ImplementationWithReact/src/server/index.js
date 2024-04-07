

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const PORT = 3000;
const app = express();
const server = http.createServer(app);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
const io = new socketIo.Server(server, {
    cors: {
        origin: `http://localhost:${PORT}`,
    }
});


io.on("connection", (socket) => {
    console.log("connected");

    socket.on('create-something', (msg) => {
        console.log('message: ' + msg);
    });
});

io.listen(4000);