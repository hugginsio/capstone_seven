const server = require('socket.io')(8000, {
  cors: {
    origin: "*",
  },
});

const users = {};
let gameboard:string;
let isHostPlayer1:boolean;

server.on('connection', socket => {

  socket.emit("lobby-joined", {gameboard, isHostPlayer1});

  socket.on('new-user', username => {
    users[socket.id] = username;
    socket.broadcast.emit("player-join", "A new player has joined");
  });

  socket.on('send-move', move => {
    socket.broadcast.emit("recieve-move", move);
  });

  socket.on('send-chat-message', message => {
    socket.broadcast.emit("recieve-chat-message", message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });

  socket.on('create-lobby', lobbyInfo => {
    gameboard = lobbyInfo.gameboard;
    isHostPlayer1 = lobbyInfo.isPlayer1;
  });
});