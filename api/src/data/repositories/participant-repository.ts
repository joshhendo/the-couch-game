import * as redis from '../redis';
import {DAY_IN_SECONDS} from "../../helpers/constants";
import {roomChanged} from "../../controllers/websocket-controller";

const connection = redis.getRedis();

export interface Participant {
  id: number;
  team: number;
  name: string;
  fake_id: number;
  position?: number;
  state?: {
    on_couch: boolean;
    turn: boolean;
  }
}

export async function getParticipantsForRoom(code: string): Promise<Participant[]> {
  const participants = await connection.get(`participants_room_${code}`);
  if (!participants) {
    return [];
  }

  return JSON.parse(participants);
}

export async function addParticipantForRoom(code: string, name: string) {
  let participants = await getParticipantsForRoom(code);
  let id = 0;

  if (!participants || participants.length === 0) {
    participants = [];
  } else {
    id = participants[participants.length-1].id + 1;
  }

  const participant = {
    id: id,
    team: null,
    name: name,
    fake_id: null,
  };

  participants.push(participant);

  await connection.set(`participants_room_${code}`, JSON.stringify(participants));

  roomChanged(code);

  return participant;
}

export async function updateParticipants(code: string, participants: Participant[]) {
  await connection.set(`participants_room_${code}`, JSON.stringify(participants));
  roomChanged(code);
}