const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const port = 6900;
const website = "RadixCode";
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

const getOnlineUsers = () => {

    let sockets = Object.values(store);
    /*console.log({ sockets });
    sockets: [
    { socket: [Socket], user: [Object] },
    { socket: [Socket], user: [Object] }
  ]
    */
    let users = sockets.map(s => s.user);

    /** console.log({ users });
      users: [
    {
      ip: '185.43.188.143',
      city: 'Baku',
      state: 'Baku City',
      country: 'Azerbaijan'
    },
    //yani asagidaki gibi gondererse Filter ile onu reed edirik =>rendered
    {
      title: dasdsadas",
      emitName: 'new_visitor'
     ]
     */
    let rendered = users.filter(u => u?.ip !== undefined && u?.ip !== null);

    console.log(Object.values(store).map(e => e.user));

    return rendered;
}
io.on("connection", (socket) => {
    console.log("connected");

    const emitOnlineUsers = () => {
        socket.broadcast.emit("users", getOnlineUsers());
    };

    store[socket.id] = {
        socket: socket,
        user: null
    }

    socket.on("add_user", (user) => {

        socket.emit("server_message", {
            name: website,
            message: `Welcome to ${website} chat !`
        });

        socket.broadcast.emit("server_message", {
            name: website,
            message: `${user.name} just Joined Chat`
        });

        store[socket.id].user = user;
        emitOnlineUsers();

    });

    socket.on("message", message => {
        message.name = store[socket.id].user.name;
        socket.broadcast.emit("message", message);
    });

    socket.on("typing", () => {
        const name = store[socket.id].user.name;
        socket.broadcast.emit("typing", `${name} is typing`);
    });

    socket.on("stopped_typing", () => {
        socket.broadcast.emit("stopped_typing");
    });

    socket.on('disconnect', function () {
        console.log("disconnected");
        const user = store[socket.id].user
        if (user) {
            socket.broadcast.emit("server_message", {
                name: website,
                message: `${user.name} just left chat`
            });
        }
        delete store[socket.id];
        emitOnlineUsers()
    });
});

server.listen(port, () => {
    console.log(`Listening on *:${port}`);
});
