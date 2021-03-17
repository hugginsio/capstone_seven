const server = require('socket.io')(8000, {
  cors: {
    origin: true,
    credentials: true
  },
});

const users:any = {};
let gameboard:string;
let isHostPlayer1:boolean;

server.on('connection', (socket:any) => {

  socket.emit("lobby-joined", {gameboard, isHostPlayer1});

  socket.on('new-user', (username:string) => {
    users[socket.id] = username;
    socket.broadcast.emit("player-join", "A new player has joined");
  });

  socket.on('send-move', (move:string) => {
    socket.broadcast.emit("recieve-move", move);
  });

  socket.on('send-chat-message', (message:string) => {
    socket.broadcast.emit("recieve-chat-message", message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });

  socket.on('create-lobby', (lobbyInfo:any) => {
    gameboard = lobbyInfo.gameboard;
    isHostPlayer1 = lobbyInfo.isPlayer1;
  });
});