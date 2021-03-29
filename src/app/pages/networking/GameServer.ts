import { NetworkGameSettings } from "./NetworkGameSettings";

const server = require('socket.io')(8000, {
  cors: {
    origin: true,
    credentials: true
  },
});

let users:any = [];
let gameSettings:NetworkGameSettings;

server.on('connection', (socket:any) => {

  //users.forEach(user => {
  //  if(user === socket.id)
  //  {
  //    socket.broadcast.emit('opponent-reconnected');
  //    socket.emit('reconnect');
  //  }
  //});

  socket.on('reconnect', () => {
    socket.broadcast.emit('opponent-reconnected');
    socket.emit('user-reconnected');
  });

  socket.on('send-move', (move:string) => {
    socket.broadcast.emit("recieve-move", move);
  });

  socket.on('send-chat-message', (message:string) => {
    socket.broadcast.emit("recieve-chat-message", message);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('opponent-disconnected');
    //delete users[socket.id];
  });

  socket.on('create-lobby', (lobbyInfo: NetworkGameSettings) => {
    gameSettings = lobbyInfo;
    users = [];
    users.push(socket.id);
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
      socket.broadcast.emit('opponent-connected');
    }
  });
});