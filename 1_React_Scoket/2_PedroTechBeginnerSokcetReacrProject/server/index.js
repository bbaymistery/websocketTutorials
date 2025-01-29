
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const optionsServer = { cors: { origin: "http://localhost:8080", methods: ["GET", "POST"] } }
const io = new Server(server, optionsServer);

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`)
});