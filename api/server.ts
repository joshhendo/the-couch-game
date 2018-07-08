import app from './src/app';
import * as http from 'http';
import * as WebSocket from 'ws';
import {handleWebsockets} from "./src/controllers/websocket-controller";

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
handleWebsockets(wss);

server.listen(3001, () => {
  console.log('server started on port 3001');
});

