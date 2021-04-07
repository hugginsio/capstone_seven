import { NetworkGameSettings } from "./NetworkGameSettings";

const server = require('socket.io')(8000, {
  cors: {
    origin: true,
    credentials: true
  },
  pingTimeout: 1000,
  pingInterval: 1500
});


let users:any = [];
let gameSettings:NetworkGameSettings;
let isDisconnected = false;
let isCancelled = false;

server.on('connection', (socket:any) => {

  socket.on('send-move', (move:string) => {
    socket.to("game").emit("recieve-move", move);
  });

  socket.on('send-chat-message', (message:string) => {
    socket.broadcast.emit("recieve-chat-message", message);
  });

  socket.on('disconnecting', () => {
    if(!isDisconnected)
    {
      isDisconnected = true;
      server.emit('user-disconnected');
    }
  });

  socket.on('create-lobby', (lobbyInfo: NetworkGameSettings) => {
    isCancelled = false;
    gameSettings = lobbyInfo;
    users = [];
    users.push(socket.id);
    socket.join("game");
    socket.broadcast.emit('get-game-settings', gameSettings);
  });

  socket.on('request-join', (username:string) => {
    if(users.length >= 2)
    {
      socket.emit('lobby-full');
    }
    else if(isCancelled)
    {
      socket.emit('game-cancelled');
    }
    else
    {
      users.push(socket.id);
      socket.join("game");
      socket.broadcast.emit('opponent-connected', username);
    }
  });

  socket.on('reconnection', () => {
    if(isDisconnected)
    {
      isDisconnected = false;
      server.emit('user-reconnected');
      //socket.emit('user-reconnected');
      //socket.broadcast.emit('opponent-reconnected');
    }
  });

  socket.on('join-room', () => {
    socket.join("game");
  });

  socket.on('leave-game', () => {
    socket.broadcast.emit('opponent-quit');
  });

  socket.on('cancel-game', () => {
    isCancelled = true;
  });
});