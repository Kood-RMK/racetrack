const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    ws.send(JSON.stringify({ message: "Welcome to Race Schedule!" }));
});

app.get("/", (req, res) => {
    res.send("Race scedule WebSocket server running!");
});

server.listen(8080, () => console.log("Server running on http://localhost:8080"));
