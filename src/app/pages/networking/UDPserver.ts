//import socketIO from 'socket.io';
import {UDPWrapper} from "./UDPwrapper.js";
const io = require('socket.io')(3000, {
    cors: {
        origin: "*",
    },
})
let users = {};
let udp = new UDPWrapper("Person McHuman");

io.on('connection', socket => {
    socket.emit("you-connceted");
    socket.on('new-user', username => {
        users[socket.id] = username;
        //udp = new UDPWrapper(username);
    });
    socket.on('send-chat-message', message => {
        //udp.broadcastGame();
    });
    socket.on('disconnect', () => {
        socket.emit('user-disconnected');
        delete users[socket.id];
    });
    socket.on('create-lobby', () => {
        udp.broadcastGame();
    });
});

udp.gameFound = (msg:string, oppAddress:string) => {
    console.log(`${oppAddress} is hosting a game: ${msg}`);
    io.emit('game-found', `${oppAddress} is hosting a game.`);
}