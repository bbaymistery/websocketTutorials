const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const port = 6600;
const app = express();
const server = http.createServer(app);
const io = new socketIo.Server(server, {
    cors: {
        origin: "*", // Be cautious with this setting in production
        methods: ["GET", "POST"]
    }
});

// __dirname is directly available in CommonJS, representing the directory name of the current module.
// For serving static files like 'index.html', ensure it's in the correct directory relative to this script.

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const store = {};

const emitVisitors = () => {
    io.emit('visitors', Object.values(store).map(e => e.user));
    console.log({ store });
}

io.on("connection", (socket) => {
    console.log("connected");
    store[socket.id] = {
        socket: socket,
        user: null
    }

    socket.on("new_visitor", (user) => {
        store[socket.id].user = user;
        console.log({ newUser: user });
        emitVisitors();
    });

    socket.on('disconnect', function () {
        console.log("disconnected");
        delete store[socket.id];
        emitVisitors();
    });
});

server.listen(port, () => {
    console.log(`Listening on *:${port}`);
});
