import { NetworkGameSettings } from "./NetworkGameSettings";

const server = require('socket.io')(8000, {
  cors: {
    origin: true,
    credentials: true
  },
});

const users:any = {};
let gameSettings:NetworkGameSettings;

server.on('connection', (socket:any) => {

  //socket.emit("lobby-joined", gameSettings);
  socket.emit('get-gameSettings', gameSettings);

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

  socket.on('create-lobby', (lobbyInfo: NetworkGameSettings) => {
    gameSettings = lobbyInfo;
    socket.broadcast.emit('get-game-settings');
  });

  socket.on('ask-game-settings', () => {
    console.log("settings requested");
    socket.emit('get-game-settings', gameSettings);
  });

  socket.on('request-join', () => {
    //check if lobby full
    //if not full
    socket.broadcast.emit('opponent-connected');
  });
});