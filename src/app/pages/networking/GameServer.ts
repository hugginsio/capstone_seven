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
      socket.broadcast.emit('opponent-disconnected');
    }
  });

  socket.on('create-lobby', (lobbyInfo: NetworkGameSettings) => {
    gameSettings = lobbyInfo;
    users = [];
    users.push(socket.id);
    socket.join("game");
    socket.broadcast.emit('get-game-settings', gameSettings);
  });

  //socket.on('ask-game-settings', () => {
  //  console.log("settings requested");
  //  socket.emit('get-game-settings', gameSettings);
  //});

  socket.on('request-join', () => {
    if(users.length >= 2)
    {
      socket.emit('lobby-full');
    }
    else
    {
      users.push(socket.id);
      socket.join("game");
      socket.broadcast.emit('opponent-connected');
    }
  });

  socket.on('reconnection', () => {
    if(isDisconnected)
    {
      isDisconnected = false;
      socket.emit('user-reconnected');
      socket.broadcast.emit('opponent-reconnected');
    }
  });

  socket.on('join-room', () => {
    socket.join("game");
  });
});