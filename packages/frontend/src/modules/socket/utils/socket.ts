import { io, Socket } from "socket.io-client";
import { VITE_WEBSOCKET_URL } from '@src/config';

export const createSocket = (): Socket => {
  return io(VITE_WEBSOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionAttempts: 10,
  });
}
