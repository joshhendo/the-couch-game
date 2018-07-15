import {
  createRoom, getRoomState, addParticipant, startRoom, selectParticipant
} from "../processors/room-processor";

import * as fresh from 'fresh';
import * as etag from 'etag';
import * as _ from 'lodash';

export async function postCreateRoom(req) {
  const roomCode = await createRoom(req.body.couch_size);

  return {
    code: 201,
    body: {
      room_code: roomCode,
    }
  }
}

export async function getRoom(req, res) {
  function isFresh (req, res) {
    return fresh(req.headers, {
      'etag': res.getHeader('ETag'),
    })
  }

  const roomCode = req.params.room_code;
  if (!roomCode) {
    return { code: 400 };
  }

  const roomState = await getRoomState(roomCode);
  if (!roomState) {
    return { code: 404 };
  }

  res.setHeader('ETag', etag(JSON.stringify(roomState)));

  if (isFresh(req, res)) {
    return { code: 304 };
  }

  return {
    body: roomState
  }
}

export async function putUpdateRoom(req) {
  const roomCode = req.params.room_code;

  if (!roomCode) {
    return { code: 400 };
  }

  const roomState = await getRoomState(roomCode);
  if (!roomState) {
    return { code: 404 };
  }

  if (roomState.state === 'pending' && req.body.state === 'started') {
    await startRoom(roomCode);
  }

  return {
    code: 200
  }
}

export async function postAddParticipant(req) {
  const roomCode = req.params.room_code;
  const participantName = req.body.name;
  const participant = await addParticipant(roomCode, participantName);

  return {
    code: 201,
    body: participant,
  };
}

export async function actionSelectParticipant(req) {
  const roomCode = req.params.room_code;

  const roomState = await getRoomState(roomCode);
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
    return { code: 400, body: 'Cannot select self'}
  }

  await selectParticipant(roomCode, selectedFakeId);

  return { code: 200 };
}
