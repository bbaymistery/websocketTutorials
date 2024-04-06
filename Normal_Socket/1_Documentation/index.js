import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

//https://socket.io/docs/v4/tutorial/step-9
//!new
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }
  
  // set up the adapter on the primary thread
  setupPrimary();
} else {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    // set up the adapter on each worker thread
    adapter: createAdapter()
  });

  // [...]

  // each worker will listen on a distinct port
  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
}