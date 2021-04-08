//import socketIO from 'socket.io';
import {UDPWrapper} from "./UDPWrapper";

console.log('Launching matchmaking server...');

const io = require('socket.io')(3000, {
  cors: {
    origin: true,
    credentials: true
  },
});
const udp = new UDPWrapper();

io.on('connection', (socket:any) => {

  socket.on('disconnect', () => {
    socket.emit('user-disconnected');
  });

  socket.on('set-username', (username:string) => {
    udp.setUsername(username);
    socket.emit("you-connected");
  });

  socket.on('broadcast-game', () => {
    udp.broadcastGame();
  });
});

udp.gameFound = (username:string, oppAddress:string) => {
  console.log(`${username} is hosting a game at: ${oppAddress}`);
  io.emit('game-found', { username: username, oppAddress: oppAddress});
};