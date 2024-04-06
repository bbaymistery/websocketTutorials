import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});
io.on("connection", (socket) => {
    console.log("initial transport", socket); // prints "polling"
  
    socket.conn.once("upgrade", () => {
      // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
      console.log("upgraded transport", socket.conn.transport.name); // prints "websocket"
    });
  
    socket.conn.on("packet", ({ type, data }) => {
      // called for each packet received
    });
  
    socket.conn.on("packetCreate", ({ type, data }) => {
      // called for each packet sent
    });
  
    socket.conn.on("drain", () => {
      // called when the write buffer is drained
    });
  
    socket.conn.on("close", (reason) => {
      // called when the underlying connection is closed
    });
  });
server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});