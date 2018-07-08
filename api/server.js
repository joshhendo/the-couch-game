"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const http = require("http");
const WebSocket = require("ws");
const websocket_controller_1 = require("./src/controllers/websocket-controller");
const server = http.createServer(app_1.default);
const wss = new WebSocket.Server({ server });
websocket_controller_1.handleWebsockets(wss);
server.listen(3001, () => {
    console.log('server started on port 3001');
});
//# sourceMappingURL=server.js.map