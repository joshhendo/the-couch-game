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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0LWNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3ZWJzb2NrZXQtY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQ0EsaUVBQTBEO0FBQzFELDJCQUEyQjtBQUUzQixNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7QUFFM0IsMEJBQWlDLEdBQXFCO0lBQ3BELEdBQUcsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQU8sRUFBYSxFQUFFLEdBQVEsRUFBRSxFQUFFO1FBQ3JELE1BQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFOUQsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxTQUFTLEdBQUcsTUFBTSw2QkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRS9DLElBQUksU0FBUyxFQUFFO2dCQUNiLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUM3QixlQUFlLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztpQkFDaEU7cUJBQU07b0JBQ0wsZUFBZSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7aUJBQ2pDO2dCQUVELEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQ3BDO1NBQ0Y7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXBCRCw0Q0FvQkM7QUFFRCxxQkFBa0MsSUFBWTs7UUFDNUMsTUFBTSxTQUFTLEdBQUcsTUFBTSw2QkFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTNDLE1BQU0sV0FBVyxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLE9BQU87U0FDUjtRQUVELFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBTyxVQUFVLEVBQUUsRUFBRTtZQUN2QyxJQUFJO2dCQUNGLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2FBQzVDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUMxQjtRQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7SUFDSixDQUFDO0NBQUE7QUFmRCxrQ0FlQyJ9