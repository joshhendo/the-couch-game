import * as roomRepository from "../data/repositories/room-repository";
const generate = require('nanoid/generate');
import {
  addParticipantForRoom,
  getParticipantsForRoom, Participant,
  updateParticipants
} from "../data/repositories/participant-repository";
import * as _ from 'lodash';
import {roomChanged} from "../controllers/websocket-controller";
import {Room, updateRoom} from "../data/repositories/room-repository";


export async function createRoom(size: number) {
  const code = generate('ABCDEFGHIJKLMNOPQRTVWXYZ', 4);
  await roomRepository.createRoom(code, size);

  return code;
}

export async function addParticipant(code: string, name: string) {
  const room = await roomRepository.getRoom(code);
  if (room.state !== 'pending') {
    throw new Error();
  }

  const participants = await getParticipantsForRoom(code);
  const participantsByName = _.keyBy(participants);

  if (participantsByName[name]) {
    throw new Error();
  }

  const participant = await addParticipantForRoom(code, name);

  return participant;
}

export type RoomAndParticipants = Room & {participants: Participant[]};

export async function getRoomState(code: string): Promise<RoomAndParticipants> {
  const room = await roomRepository.getRoom(code);
  if (room === null) {
    return null;
  }

  const participants = await getParticipantsForRoom(code);
  if (participants === null) {
    throw new Error();
  }

  if (room.state !== 'pending') {
    const spots = participants.length + 1;
    const positionTurn = room.empty_spot < spots-1 ? room.empty_spot +1 : 0;

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
      }
    }

    // Determine if the game is over
    const participantsOnCouch = _.filter(participants, (p) => p.state.on_couch);

    if (participantsOnCouch.length === room.couch_size) {
      for (const team of [0,1]) {
        const allSameTeam = _.every(participantsOnCouch, (p) => p.team === team);

        if (allSameTeam) {
          room.state = 'finished';
          room.payload = {
            winners: _.filter(participants, (p) => p.team === team),
          }
        }
      }
    }
  }

  return {
    ...room,
    participants: participants
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export async function startRoom(code: string) {
  const room = await roomRepository.getRoom(code);
  if (room === null) {
    throw Error('not found');
  }

  if (room.state !== 'pending') {
    throw Error('already started');
  }

  let participants = await getParticipantsForRoom(code);
  if (participants === null) {
    throw Error('No participants');
  }

  const couchSize = room.couch_size;
  if (participants.length < couchSize*2) {
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

  room.empty_spot = getRandomInt(participants.length+1);
  for (let i = 0; i < participants.length; i++) {
    participants[i].fake_id = ids[i];

    if (i < room.empty_spot) {
      participants[i].position = i;
    } else {
      participants[i].position = i+1;
    }
  }

  await updateRoom(code, room);
  await updateParticipants(code, participants);

  roomChanged(code);
}

export async function selectParticipant(code: string, selectedFakeId: number) {
  const {participants, ...room} = await getRoomState(code);
  const participantReal = _.find(participants, (p) => p.fake_id === selectedFakeId);

  room.last_selected_id = selectedFakeId;

  // Move whoever has the selected Fake ID to the empty spot
  const newEmptySpot = participantReal.position;
  participantReal.position = room.empty_spot;
  room.empty_spot = newEmptySpot;

  // Identify who to swap with: the person to the right of the person who just moved
  let participantToSwapWithPosition = participantReal.position+1;
  if (participantToSwapWithPosition > participants.length) {
    participantToSwapWithPosition = 0;
  }

  const participantToSwapWith = _.find(participants, (p) => p.position === participantToSwapWithPosition);

  participantReal.fake_id = participantToSwapWith.fake_id;
  participantToSwapWith.fake_id = selectedFakeId;

  await updateRoom(code, room);
  await updateParticipants(code, participants);

  roomChanged(code);
}