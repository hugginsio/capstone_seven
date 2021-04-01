"use strict";
exports.__esModule = true;
//import socketIO from 'socket.io';
var UDPWrapper_1 = require("./UDPWrapper");
var io = require('socket.io')(3000, {
    cors: {
        origin: true,
        credentials: true
    }
});
var udp = new UDPWrapper_1.UDPWrapper();
io.on('connection', function (socket) {
    socket.on('disconnect', function () {
        socket.emit('user-disconnected');
    });
    socket.on('set-username', function (username) {
        udp.setUsername(username);
        socket.emit("you-connected");
    });
    socket.on('broadcast-game', function () {
        udp.broadcastGame();
    });
});
udp.gameFound = function (username, oppAddress) {
    console.log(username + " is hosting a game at: " + oppAddress);
    io.emit('game-found', { username: username, oppAddress: oppAddress });
};
