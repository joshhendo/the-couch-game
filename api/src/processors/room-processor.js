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
const roomRepository = require("../data/repositories/room-repository");
const shortid = require("shortid");
const participant_repository_1 = require("../data/repositories/participant-repository");
const _ = require("lodash");
const websocket_controller_1 = require("../controllers/websocket-controller");
const room_repository_1 = require("../data/repositories/room-repository");
function createRoom(size) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = shortid.generate();
        yield roomRepository.createRoom(code, size);
        return code;
    });
}
exports.createRoom = createRoom;
function addParticipant(code, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const room = yield roomRepository.getRoom(code);
        if (room.state !== 'pending') {
            throw new Error();
        }
        const participants = yield participant_repository_1.getParticipantsForRoom(code);
        const participantsByName = _.keyBy(participants);
        if (participantsByName[name]) {
            throw new Error();
        }
        const participant = yield participant_repository_1.addParticipantForRoom(code, name);
        return participant;
    });
}
exports.addParticipant = addParticipant;
function getRoomState(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const room = yield roomRepository.getRoom(code);
        if (room === null) {
            return room;
        }
        const participants = yield participant_repository_1.getParticipantsForRoom(code);
        if (participants === null) {
            throw new Error();
        }
        if (room.state !== 'pending') {
            const spots = participants.length + 1;
            const positionTurn = room.empty_spot < spots - 1 ? room.empty_spot + 1 : 0;
            for (let i = 0; i < participants.length; i++) {
                // Determine if they are on couch
                const on_couch = participants[i].position < room.couch_size;
                let turn = false;
                if (participants[i].position === positionTurn) {
                    turn = true;
                }
                participants[i].state = {
                    on_couch,
                    turn
                };
            }
        }
        return Object.assign({}, room, { participants: participants });
    });
}
exports.getRoomState = getRoomState;
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function startRoom(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const room = yield roomRepository.getRoom(code);
        if (room === null) {
            throw Error('not found');
        }
        if (room.state !== 'pending') {
            throw Error('already started');
        }
        let participants = yield participant_repository_1.getParticipantsForRoom(code);
        if (participants === null) {
            throw Error('No participants');
        }
        const couchSize = room.couch_size;
        if (participants.length < couchSize * 2) {
            throw Error('There must be at least twice the number of participants than couch size');
        }
        room.state = 'started';
        // quick but easy way to assign everyone to a team :|
        participants = _.shuffle(participants);
        let team = 0;
        for (const participant of participants) {
            participant.team = team % 2;
            team++;
        }
        // Randomly assign everyone an ID of someone else and assign positions
        const ids = _.chain(participants)
            .map('id')
            .shuffle()
            .value();
        room.empty_spot = getRandomInt(participants.length + 1);
        for (let i = 0; i < participants.length; i++) {
            participants[i].fake_id = ids[i];
            if (i < room.empty_spot) {
                participants[i].position = i;
            }
            else {
                participants[i].position = i + 1;
            }
        }
        yield room_repository_1.updateRoom(code, room);
        yield participant_repository_1.updateParticipants(code, participants);
        websocket_controller_1.roomChanged(code);
    });
}
exports.startRoom = startRoom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS1wcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb29tLXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsdUVBQXVFO0FBQ3ZFLG1DQUFtQztBQUNuQyx3RkFJcUQ7QUFDckQsNEJBQTRCO0FBQzVCLDhFQUFnRTtBQUNoRSwwRUFBZ0U7QUFFaEUsb0JBQWlDLElBQVk7O1FBQzNDLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVoQyxNQUFNLGNBQWMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTVDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztDQUFBO0FBTkQsZ0NBTUM7QUFFRCx3QkFBcUMsSUFBWSxFQUFFLElBQVk7O1FBQzdELE1BQU0sSUFBSSxHQUFHLE1BQU0sY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzVCLE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztTQUNuQjtRQUVELE1BQU0sWUFBWSxHQUFHLE1BQU0sK0NBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRWpELElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1NBQ25CO1FBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSw4Q0FBcUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFNUQsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztDQUFBO0FBaEJELHdDQWdCQztBQUVELHNCQUFtQyxJQUFZOztRQUM3QyxNQUFNLElBQUksR0FBRyxNQUFNLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxD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