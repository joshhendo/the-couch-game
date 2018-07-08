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
const fresh = require("fresh");
const etag = require("etag");
function postCreateRoom(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomCode = yield room_processor_1.createRoom(req.body.couch_size);
        return {
            code: 201,
            body: {
                room_code: roomCode,
            }
        };
    });
}
exports.postCreateRoom = postCreateRoom;
function getRoom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        function isFresh(req, res) {
            return fresh(req.headers, {
                'etag': res.getHeader('ETag'),
            });
        }
        const roomCode = req.params.room_code;
        if (!roomCode) {
            return { code: 400 };
        }
        const roomState = yield room_processor_1.getRoomState(roomCode);
        if (!roomState) {
            return { code: 404 };
        }
        res.setHeader('ETag', etag(JSON.stringify(roomState)));
        if (isFresh(req, res)) {
            return { code: 304 };
        }
        return {
            body: roomState
        };
    });
}
exports.getRoom = getRoom;
function putUpdateRoom(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomCode = req.params.room_code;
        if (!roomCode) {
            return { code: 400 };
        }
        const roomState = yield room_processor_1.getRoomState(roomCode);
        if (!roomState) {
            return { code: 404 };
        }
        if (roomState.state === 'pending' && req.body.state === 'started') {
            yield room_processor_1.startRoom(roomCode);
        }
        return {
            code: 200
        };
    });
}
exports.putUpdateRoom = putUpdateRoom;
function postAddParticipant(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomCode = req.params.room_code;
        const participantName = req.body.name;
        const participant = yield room_processor_1.addParticipant(roomCode, participantName);
        return {
            code: 201,
            body: participant,
        };
    });
}
exports.postAddParticipant = postAddParticipant;
//# sourceMappingURL=room-controller.js.map