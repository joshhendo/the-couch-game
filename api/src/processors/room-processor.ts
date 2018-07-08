import * as roomRepository from "../data/repositories/room-repository";
import * as shortid from "shortid";
import {
  addParticipantForRoom,
  getParticipantsForRoom,
  updateParticipants
} from "../data/repositories/participant-repository";
import * as _ from 'lodash';
import {roomChanged} from "../controllers/websocket-controller";
import {updateRoom} from "../data/repositories/room-repository";

export async function createRoom(size: number) {
  const code = shortid.generate();

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

export async function getRoomState(code: string) {
  const room = await roomRepository.getRoom(code);
  if (room === null) {
    return room;
  }

  const participants = await getParticipantsForRoom(code);
  if (participants === null) {
    throw new Error();
  }

  if (room.state !== 'pending') {
    const positionTurn = (room.empty_spot + 1) % participants.length + 1;
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
    participant.team = team++ % 2;
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