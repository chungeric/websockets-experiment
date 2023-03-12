const { Server } = require("socket.io");
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const port = 3000;
const io = new Server(server);
const Player = require('./Player');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

server.listen(port, '0.0.0.0');

// Player data store { <websocket_id>: <data> }
// const playersData = {};
const store = {
  playersData: {},
  foodPos: { x: Math.random(), y: Math.random() },
};
let foodEaten = false;

io.on('connection', (socket) => {
  console.log('connected', socket.id);
  store.playersData[socket.id] = new Player();
  io.emit('updated-data', store.playersData);
  io.emit('update-scoreboard');
  io.emit('food-spawned', store.foodPos);
  
  // update loop
  function update() {
    store.playersData[socket.id]?.update();
    io.emit('updated-data', store.playersData);
  }
  setInterval(() => update(), 32);

  // socket event listeners
  socket.on('move', ({ x: newX, y: newY }) => {
    store.playersData[socket.id].update(newX, newY);
    io.emit('updated-data', store.playersData);
  });
  socket.on('food-eaten', () => {
    if (!foodEaten) {
      foodEaten = true;
      store.playersData[socket.id].addToScore();
      store.foodPos = { x: Math.random(), y: Math.random() };
      io.emit('updated-data', store.playersData);
      io.emit('update-scoreboard');
      io.emit('food-spawned', store.foodPos);
      foodEaten = false;
    }
  })
  socket.on("disconnect", () => {
    delete store.playersData[socket.id];
    console.log('disconnected', socket.id);
    io.emit('updated-data', store.playersData);
    io.emit('update-scoreboard');
  });
});
