import * as redis from '../redis';
import {DAY_IN_SECONDS} from "../../helpers/constants";
import {roomChanged} from "../../controllers/websocket-controller";

const connection = redis.getRedis();

export interface Room {
  state: 'pending' | 'started' | 'finished';
  couch_size: number;
  empty_spot?: number;
  last_selected_id?: number;
}

export async function createRoom(code: string, couch_size: number) {
  await connection.setex(`ROOM_CODE_${code}`, DAY_IN_SECONDS, JSON.stringify( {
    state: 'pending',
    couch_size,
    empty_spot: null,
    last_selected_id: null,
  }));

  roomChanged(code);
}

export async function getRoom(code: string): Promise<Room> {
  return JSON.parse(await connection.get(`ROOM_CODE_${code}`));
}

export async function updateRoom(code: string, data: Partial<Room>) {
  const current = await getRoom(code);
  const updated = {
    ...current,
    ...data
  };
  await connection.setex(`ROOM_CODE_${code}`, DAY_IN_SECONDS, JSON.stringify(updated));
  roomChanged(code);
}

export async function setState(code: string, state: Room['state']) {
  await updateRoom(code, {state});
  roomChanged(code);
}


