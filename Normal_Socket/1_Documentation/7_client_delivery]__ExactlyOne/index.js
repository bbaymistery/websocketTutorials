import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// open the database file
const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
  );
`);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    connectionStateRecovery: {}
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

// [...]

io.on('connection', async (socket) => {
    socket.on('chat message', async (msg, clientOffset, callback) => {
        let result;
        try {
            result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
        } catch (e) {
            if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
                // the message was already inserted, so we notify the client
                callback();
            } else {
                // nothing to do, just let the client retry
            }
            return;
        }
        io.emit('chat message', msg, result.lastID);
        // acknowledge the event
        callback();
    });

    if (!socket.recovered) {
        try {
            await db.each('SELECT id, content FROM messages WHERE id > ?',
                [socket.handshake.auth.serverOffset || 0],
                (_err, row) => {
                    socket.emit('chat message', row.content, row.id);
                }
            )
        } catch (e) {
            // something went wrong
        }
    }
});

// [...]

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});