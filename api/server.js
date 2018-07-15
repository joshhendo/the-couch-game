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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQTRCO0FBQzVCLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsaUZBQXdFO0FBRXhFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBRyxDQUFDLENBQUM7QUFFdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUM3Qyx1Q0FBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUV0QixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQzdDLENBQUMsQ0FBQyxDQUFDIn0=