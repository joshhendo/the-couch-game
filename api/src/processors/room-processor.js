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
//# sourceMappingURL=room-processor.js.map