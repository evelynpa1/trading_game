// server.js
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('WebSocket server started on ws://localhost:8080');
});
// TODO: allow spectators to join
// client id -> connection between server/client
clients = new Map();
// client ids that have disconnected
disclients = new Set();
var round = 0
var fullTable = [];
var currentTable = [0, 0, 0, 0]; // Server-side state

wss.on('connection', (ws) => {
  console.log('Client connected, total clients: ' + wss.clients.size);
  let clientId;
  // Send initial table state
  // ws.send(JSON.stringify({ type: 'table_update', table: currentTable }));

  // TODO: if the game has started, overwrite this whole ws.on to not allow new players, etc. (can do later)
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      if (data.event === "new_player") {
        clientId = uuidv4();
        clients.set(clientId, ws);
        ws.send(JSON.stringify({ event: "assign_id", id: clientId }));
        console.log(`Assigned new ID: ${clientId}`);
        ws.once('close', () => {
          console.log("connection closed " + clientId);
          disclients.add(clientId);
          clients.delete(clientId);
        })
        return;
      }
      clientId = data.id;
      if (!clientId) {
        ws.send(JSON.stringify({ event: "failure", id: clientId, message: "Client ID not provided" }));
        return;
      }
      // Handle reconnection or new connection
      if (data.event === "reconnect") {
        if (clients.has(clientId)) {
          console.log(clientId + " failed to reconnect, already connected.")
          ws.send(JSON.stringify({ event: "failure", id: clientId, message: "Failed to reconnect, instance already running" }));
          return;
        }
        if (!disclients.has(clientId)) {
          console.log(clientId + " failed to reconnect, unknown client.")
          ws.send(JSON.stringify({ event: "failure", id: clientId, message: "Unknown client id for reconnection" }));
          return;
        }
        disclients.delete(clientId);
        clients.set(clientId, ws);
        console.log(`Client ${clientId} reconnected.`);
        ws.send(JSON.stringify({ event: "reconnect_success", id: clientId, message: "Reconnected successfully" }));
        ws.once('close', () => {
          console.log("connection closed " + clientId);
          clients.delete(clientId);
          disclients.add(clientId);
        });
        return;
      }


	  // TODO: assume there is a variable NUMPLAYERS that if we have that many in cleints, start the game
      // Check if we have 4 unique players
      if (clients.size === 4) {
        console.log("4 players connected. Attempting to start game...");
        // check that there are 4 players in clients
        for (const [id, clientWs] of clients) {
          if (clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ event: "game_start", message: "Game is starting!", players: [...clients.keys()] }));
          }
        }
      }
    } catch (err) {
      console.error("Invalid message format:", err);
    }
  });

  // TODO: start the game


  // TODO: game logic

  //   // Example: simulate revealing a new card
  //   setTimeout(() => {
  //     currentTable = [1, 0, 0, 0];
  //     broadcast({ type: 'TABLE_UPDATE', table: currentTable });
  //   }, 5000);
});


// broadcast helper
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}
