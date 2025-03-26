import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001"; // Change if needed

let socket: Socket;

export const connectSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL);
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};

export { socket };