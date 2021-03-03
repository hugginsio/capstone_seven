//import socketIO from 'socket.io';
import {UDPWrapper} from "./UDPwrapper.js";
const io = require('socket.io')(3000, {
  cors: {
    origin: "*",
  },
});
const udp = new UDPWrapper();

io.on('connection', socket => {
  socket.emit("you-connceted");

  socket.on('disconnect', () => {
    socket.emit('user-disconnected');
  });

  socket.on('set-username', username => {
    udp.setUsername(username);
  });

  socket.on('broadcast-game', () => {
    udp.broadcastGame();
  });
});

udp.gameFound = (username:string, oppAddress:string) => {
  console.log(`${username} is hosting a game at: ${oppAddress}`);
  io.emit('game-found', { username: username, oppAddress: oppAddress});
};