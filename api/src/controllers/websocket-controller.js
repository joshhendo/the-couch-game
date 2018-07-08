"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const room_processor_1 = require("../processors/room-processor");
const url = require("url");
const roomSubscribers = {};
function handleWebsockets(wss) {
    wss.on('connection', (ws, req) => __awaiter(this, void 0, void 0, function* () {
        const parsedUrl = url.parse(req.url);
        const result = /^\/rooms\/(.*?)\/?$/.exec(parsedUrl.pathname);
        if (result) {
            const roomCode = result[1];
            const roomState = yield room_processor_1.getRoomState(roomCode);
            if (roomState) {
                if (roomSubscribers[roomCode]) {
                    roomSubscribers[roomCode] = [...roomSubscribers[roomCode], ws];
                }
                else {
                    roomSubscribers[roomCode] = [ws];
                }
                ws.send(JSON.stringify(roomState));
            }
        }
    }));
}
exports.handleWebsockets = handleWebsockets;
function roomChanged(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomState = yield room_processor_1.getRoomState(code);
        const subscribers = roomSubscribers[code];
        if (!subscribers) {
            return;
        }
        subscribers.forEach((subscriber) => __awaiter(this, void 0, void 0, function* () {
            try {
                subscriber.send(JSON.stringify(roomState));
            }
            catch (err) {
                console.log('not ready');
            }
        }));
    });
}
exports.roomChanged = roomChanged;
//# sourceMappingURL=websocket-controller.js.map