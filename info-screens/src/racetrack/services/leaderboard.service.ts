import type { Server as IOServer } from "socket.io";



export function leaderboardService(io : IOServer) {
    io.of('/leaderboard').on('connection', (socket) => {
        console.log('a user connected to leaderboard namespace');
    });
}