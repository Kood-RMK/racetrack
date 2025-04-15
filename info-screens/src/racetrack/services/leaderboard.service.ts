import type { Server as SocketIOServer } from "socket.io";




export function leaderboardService(io : SocketIOServer) {
    io.of('/leaderboard').on('connection', (socket) => {
        console.log('a user connected to leaderboard namespace');
    });
}