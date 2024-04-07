
const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const port = 8080;
const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
    cors: {
        origin: `http://localhost:${port}`,
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
io.on("connection", (socket) => {
    console.log("connected");

});

server.listen(port, () => console.log(`Listening on *:${port}`));
