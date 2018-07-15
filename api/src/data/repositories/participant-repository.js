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
const websocket_controller_1 = require("../../controllers/websocket-controller");
const connection = redis.getRedis();
function getParticipantsForRoom(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const participants = yield connection.get(`participants_room_${code}`);
        if (!participants) {
            return [];
        }
        return JSON.parse(participants);
    });
}
exports.getParticipantsForRoom = getParticipantsForRoom;
function addParticipantForRoom(code, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let participants = yield getParticipantsForRoom(code);
        let id = 0;
        if (!participants || participants.length === 0) {
            participants = [];
        }
        else {
            id = participants[participants.length - 1].id + 1;
        }
        const participant = {
            id: id,
            team: null,
            name: name,
            fake_id: null,
        };
        participants.push(participant);
        yield connection.set(`participants_room_${code}`, JSON.stringify(participants));
        websocket_controller_1.roomChanged(code);
        return participant;
    });
}
exports.addParticipantForRoom = addParticipantForRoom;
function updateParticipants(code, participants) {
    return __awaiter(this, void 0, void 0, function* () {
        yield connection.set(`participants_room_${code}`, JSON.stringify(participants));
        websocket_controller_1.roomChanged(code);
    });
}
exports.updateParticipants = updateParticipants;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGljaXBhbnQtcmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhcnRpY2lwYW50LXJlcG9zaXRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGtDQUFrQztBQUVsQyxpRkFBbUU7QUFFbkUsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBY3BDLGdDQUE2QyxJQUFZOztRQUN2RCxNQUFNLFlBQVksR0FBRyxNQUFNLFVBQVUsQ0FBQyxHQUFHLENBQUMscUJBQXFCLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNqQixPQUFPLEVBQUUsQ0FBQztTQUNYO1FBRUQsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQ2xDLENBQUM7Q0FBQTtBQVBELHdEQU9DO0FBRUQsK0JBQTRDLElBQVksRUFBRSxJQUFZOztRQUNwRSxJQUFJLFlBQVksR0FBRyxNQUFNLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVYLElBQUksQ0FBQyxZQUFZLElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDOUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztTQUNuQjthQUFNO1lBQ0wsRUFBRSxHQUFHLFlBQVksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDakQ7UUFFRCxNQUFNLFdBQVcsR0FBRztZQUNsQixFQUFFLEVBQUUsRUFBRTtZQUNOLElBQUksRUFBRSxJQUFJO1lBQ1YsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7UUFFRixZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRS9CLE1BQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBRWhGLGtDQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEIsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztDQUFBO0FBeEJELHNEQXdCQztBQUVELDRCQUF5QyxJQUFZLEVBQUUsWUFBMkI7O1FBQ2hGLE1BQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLGtDQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQztDQUFBO0FBSEQsZ0RBR0MifQ==