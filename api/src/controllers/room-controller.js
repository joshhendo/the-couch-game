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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vbS1jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm9vbS1jb250cm9sbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxpRUFFc0M7QUFFdEMsK0JBQStCO0FBQy9CLDZCQUE2QjtBQUU3Qix3QkFBcUMsR0FBRzs7UUFDdEMsTUFBTSxRQUFRLEdBQUcsTUFBTSwyQkFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdkQsT0FBTztZQUNMLElBQUksRUFBRSxHQUFHO1lBQ1QsSUFBSSxFQUFFO2dCQUNKLFNBQVMsRUFBRSxRQUFRO2FBQ3BCO1NBQ0YsQ0FBQTtJQUNILENBQUM7Q0FBQTtBQVRELHdDQVNDO0FBRUQsaUJBQThCLEdBQUcsRUFBRSxHQUFHOztRQUNwQyxpQkFBa0IsR0FBRyxFQUFFLEdBQUc7WUFDeEIsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtnQkFDeEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO2FBQzlCLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFFRCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUN0QjtRQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sNkJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUN0QjtRQUVELEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RCxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDckIsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUN0QjtRQUVELE9BQU87WUFDTCxJQUFJLEVBQUUsU0FBUztTQUNoQixDQUFBO0lBQ0gsQ0FBQztDQUFBO0FBMUJELDBCQTBCQztBQUVELHVCQUFvQyxHQUFHOztRQUNyQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUV0QyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUN0QjtRQUVELE1BQU0sU0FBUyxHQUFHLE1BQU0sNkJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztTQUN0QjtRQUVELElBQUksU0FBUyxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQ2pFLE1BQU0sMEJBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMzQjtRQUVELE9BQU87WUFDTCxJQUFJLEVBQUUsR0FBRztTQUNWLENBQUE7SUFDSCxDQUFDO0NBQUE7QUFuQkQsc0NBbUJDO0FBRUQsNEJBQXlDLEdBQUc7O1FBQzFDLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ3RDLE1BQU0sZUFBZSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3RDLE1BQU0sV0FBVyxHQUFHLE1BQU0sK0JBQWMsQ0FBQyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFcEUsT0FBTztZQUNMLElBQUksRUFBRSxHQUFHO1lBQ1QsSUFBSSxFQUFFLFdBQVc7U0FDbEIsQ0FBQztJQUNKLENBQUM7Q0FBQTtBQVRELGdEQVNDIn0=