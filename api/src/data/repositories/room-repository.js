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
const redis = require("../redis");
const constants_1 = require("../../helpers/constants");
const websocket_controller_1 = require("../../controllers/websocket-controller");
const connection = redis.getRedis();
function createRoom(code, couch_size) {
    return __awaiter(this, void 0, void 0, function* () {
        yield connection.setex(`ROOM_CODE_${code}`, constants_1.DAY_IN_SECONDS, JSON.stringify({
            state: 'pending',
            couch_size,
            empty_spot: null,
            last_selected_id: null,
        }));
        websocket_controller_1.roomChanged(code);
    });
}
exports.createRoom = createRoom;
function getRoom(code) {
    return __awaiter(this, void 0, void 0, function* () {
        return JSON.parse(yield connection.get(`ROOM_CODE_${code}`));
    });
}
exports.getRoom = getRoom;
function updateRoom(code, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const current = yield getRoom(code);
        const updated = Object.assign({}, current, data);
        yield connection.setex(`ROOM_CODE_${code}`, constants_1.DAY_IN_SECONDS, JSON.stringify(updated));
        websocket_controller_1.roomChanged(code);
    });
}
exports.updateRoom = updateRoom;
function setState(code, state) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateRoom(code, { state });
        websocket_controller_1.roomChanged(code);
    });
}
exports.setState = setState;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS1yZXBvc2l0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm9vbS1yZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxrQ0FBa0M7QUFDbEMsdURBQXVEO0FBQ3ZELGlGQUFtRTtBQUVuRSxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7QUFTcEMsb0JBQWlDLElBQVksRUFBRSxVQUFrQjs7UUFDL0QsTUFBTSxVQUFVLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUUsMEJBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFFO1lBQzFFLEtBQUssRUFBRSxTQUFTO1lBQ2hCLFVBQVU7WUFDVixVQUFVLEVBQUUsSUFBSTtZQUNoQixnQkFBZ0IsRUFBRSxJQUFJO1NBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBRUosa0NBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwQixDQUFDO0NBQUE7QUFURCxnQ0FTQztBQUVELGlCQUE4QixJQUFZOztRQUN4QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7Q0FBQTtBQUZELDBCQUVDO0FBRUQsb0JBQWlDLElBQVksRUFBRSxJQUFtQjs7UUFDaEUsTUFBTSxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsTUFBTSxPQUFPLHFCQUNSLE9BQU8sRUFDUCxJQUFJLENBQ1IsQ0FBQztRQUNGLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FBQyxhQUFhLElBQUksRUFBRSxFQUFFLDBCQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLGtDQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQztDQUFBO0FBUkQsZ0NBUUM7QUFFRCxrQkFBK0IsSUFBWSxFQUFFLEtBQW9COztRQUMvRCxNQUFNLFVBQVUsQ0FBQyxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ2hDLGtDQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQztDQUFBO0FBSEQsNEJBR0MifQ==