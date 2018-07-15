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
const _ = require("lodash");
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
function actionSelectParticipant(req) {
    return __awaiter(this, void 0, void 0, function* () {
        const roomCode = req.params.room_code;
        const roomState = yield room_processor_1.getRoomState(roomCode);
        if (!roomState) {
            return { code: 404 };
        }
        const selectedFakeId = req.body.participant_id;
        if (roomState.last_selected_id === selectedFakeId) {
            return { code: 400, body: 'Cannot select previously selected' };
        }
        const participantReal = _.find(roomState.participants, (p) => p.fake_id === selectedFakeId);
        if (!participantReal) {
            return { code: 404 };
        }
        const participantMakingSelection = _.find(roomState.participants, (p) => p.state.turn);
        if (participantMakingSelection.fake_id === selectedFakeId) {
            return { code: 400, body: 'Cannot select self' };
        }
        yield room_processor_1.selectParticipant(roomCode, selectedFakeId);
        return { code: 200 };
    });
}
exports.actionSelectParticipant = actionSelectParticipant;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm9vbS1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxpRUFFc0M7QUFFdEMsK0JBQStCO0FBQy9CLDZCQUE2QjtBQUM3Qiw0QkFBNEI7QUFFNUIsd0JBQXFDLEdBQUc7O1FBQ3RDLE1BQU0sUUFBUSxHQUFHLE1BQU0sMkJBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXZELE9BQU87WUFDTCxJQUFJLEVBQUUsR0FBRztZQUNULElBQUksRUFBRTtnQkFDSixTQUFTLEVBQUUsUUFBUTthQUNwQjtTQUNGLENBQUE7SUFDSCxDQUFDO0NBQUE7QUFURCx3Q0FTQztBQUVELGlCQUE4QixHQUFHLEVBQUUsR0FBRzs7UUFDcEMsaUJBQWtCLEdBQUcsRUFBRSxHQUFHO1lBQ3hCLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7Z0JBQ3hCLE1BQU0sRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQzthQUM5QixDQUFDLENBQUE7UUFDSixDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7U0FDdEI7UUFFRCxNQUFNLFNBQVMsR0FBRyxNQUFNLDZCQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNkLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7U0FDdEI7UUFFRCxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFdkQsSUFBSSxPQUFPLENBQUMs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