import { readFileSync } from "fs";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

const httpServer = createServer((req, res) => {
  if (req.url !== "/") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  
  const content = readFileSync("index.html");
  const length = Buffer.byteLength(content);

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": length,
  });
  res.end(content);
});

const wss = new WebSocketServer({ server: httpServer });

// Player data store { <websocket_id>: <data> }
const playersData = new Map();

function stringifyPlayersData(data) {
  return JSON.stringify(Object.fromEntries(data));
}

function generateRandomColor() {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return `${r}, ${g}, ${b}`;
}

wss.on("connection", function connection(ws) {
  ws.id = uuidv4();
  console.log(`${ws.id} connected`);

  // initialise player data
  playersData.set(ws.id, { x: 0, y: 0, color: generateRandomColor() });

  ws.send(stringifyPlayersData(playersData));

  ws.on("error", console.error);

  ws.on("message", function message(data) {

    // update sender's data in player data store
    const senderData = playersData.get(ws.id);
    playersData.set(ws.id, {
      ...senderData,
      ...JSON.parse(data.toString())
    });

    // broadcast new data to all connected web sockets
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(stringifyPlayersData(playersData));
      }
    });
  });

  ws.on('close', function close() {
    playersData.delete(ws.id);
    wss.clients.forEach(function each(client) {
      client.send(stringifyPlayersData(playersData));
    });
  });
});

httpServer.listen(3000, '0.0.0.0');
