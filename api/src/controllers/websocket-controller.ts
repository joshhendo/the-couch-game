import * as WebSocket from 'ws';
import {getRoomState} from "../processors/room-processor";
import * as url from 'url';

const roomSubscribers = {};

export function handleWebsockets(wss: WebSocket.Server) {
  wss.on('connection', async (ws: WebSocket, req: any) => {
    const parsedUrl = url.parse(req.url);
    const result = /^\/rooms\/(.*?)\/?$/.exec(parsedUrl.pathname);

    if (result) {
      const roomCode = result[1];
      const roomState = await getRoomState(roomCode);

      if (roomState) {
        if (roomSubscribers[roomCode]) {
          roomSubscribers[roomCode] = [...roomSubscribers[roomCode], ws];
        } else {
          roomSubscribers[roomCode] = [ws]
        }

        ws.send(JSON.stringify(roomState));
      }
    }
  });
}

export async function roomChanged(code: string) {
  const roomState = await getRoomState(code);

  const subscribers = roomSubscribers[code];
  if (!subscribers) {
    return;
  }

  subscribers.forEach(async (subscriber) => {
    try {
      subscriber.send(JSON.stringify(roomState));
    } catch (err) {
      console.log('not ready');
    }
  })
}
