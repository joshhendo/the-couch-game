"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const roomRepository = require("../data/repositories/room-repository");
const generate = require('nanoid/generate');
const participant_repository_1 = require("../data/repositories/participant-repository");
const _ = require("lodash");
const websocket_controller_1 = require("../controllers/websocket-controller");
const room_repository_1 = require("../data/repositories/room-repository");
function createRoom(size) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = generate('ABCDEFGHIJKLMNOPQRTVWXYZ', 4);
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
            return null;
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
            // Determine if the game is over
            const participantsOnCouch = _.filter(participants, (p) => p.state.on_couch);
            if (participantsOnCouch.length === room.couch_size) {
                for (const team of [0, 1]) {
                    const allSameTeam = _.every(participantsOnCouch, (p) => p.team === team);
                    if (allSameTeam) {
                        room.state = 'finished';
                        room.payload = {
                            winners: _.filter(participants, (p) => p.team === team),
                        };
                    }
                }
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
function selectParticipant(code, selectedFakeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const _a = yield getRoomState(code), { participants } = _a, room = __rest(_a, ["participants"]);
        const participantReal = _.find(participants, (p) => p.fake_id === selectedFakeId);
        room.last_selected_id = selectedFakeId;
        // Move whoever has the selected Fake ID to the empty spot
        const newEmptySpot = participantReal.position;
        participantReal.position = room.empty_spot;
        room.empty_spot = newEmptySpot;
        // Identify who to swap with: the person to the right of the person who just moved
        let participantToSwapWithPosition = participantReal.position + 1;
        if (participantToSwapWithPosition > participants.length) {
            participantToSwapWithPosition = 0;
        }
        const participantToSwapWith = _.find(participants, (p) => p.position === participantToSwapWithPosition);
        participantReal.fake_id = participantToSwapWith.fake_id;
        participantToSwapWith.fake_id = selectedFakeId;
        yield room_repository_1.updateRoom(code, room);
        yield participant_repository_1.updateParticipants(code, participants);
        websocket_controller_1.roomChanged(code);
    });
}
exports.selectParticipant = selectParticipant;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS1wcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb29tLXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUVBQXVFO0FBQ3ZFLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzVDLHdGQUlxRDtBQUNyRCw0QkFBNEI7QUFDNUIsOEVBQWdFO0FBQ2hFLDBFQUFzRTtBQUd0RSxvQkFBaUMsSUFBWTs7UUFDM0MsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFNUMsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0NBQUE7QUFMRCxnQ0FLQztBQUVELHdCQUFxQyxJQUFZLEVBQUUsSUFBWTs7UUFDN0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hELElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1NBQ25CO1FBRUQsTUFBTSxZQUFZLEdBQUcsTUFBTSwrQ0FBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxNQUFNLGtCQUFrQixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFakQsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixNQUFNLElBQUksS0FBSyxFQUFFLENBQUM7U0FDbkI7UUFFRCxNQUFNLFdBQVcsR0FBRyxNQUFNLDhDQUFxQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUU1RCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0NBQUE7QUFoQkQsd0NBZ0JDO0FBSUQsc0JBQW1DLElB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