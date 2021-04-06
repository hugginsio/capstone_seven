"use strict";
exports.__esModule = true;
var server = require('socket.io')(8000, {
    cors: {
        origin: true,
        credentials: true
    },
    pingTimeout: 1000,
    pingInterval: 1500
});
var users = [];
var gameSettings;
var isDisconnected = false;
var isCancelled = false;
server.on('connection', function (socket) {
    socket.on('send-move', function (move) {
        socket.to("game").emit("recieve-move", move);
    });
    socket.on('send-chat-message', function (message) {
        socket.broadcast.emit("recieve-chat-message", message);
    });
    socket.on('disconnecting', function () {
        if (!isDisconnected) {
            isDisconnected = true;
            socket.broadcast.emit('opponent-disconnected');
        }
    });
    socket.on('create-lobby', function (lobbyInfo) {
        isCancelled = false;
        gameSettings = lobbyInfo;
        users = [];
        users.push(socket.id);
        socket.join("game");
        socket.broadcast.emit('get-game-settings', gameSettings);
    });
    socket.on('request-join', function (username) {
        if (users.length >= 2) {
            socket.emit('lobby-full');
        }
        else if (isCancelled) {
            socket.emit('game-cancelled');
        }
        else {
            users.push(socket.id);
            socket.join("game");
            socket.broadcast.emit('opponent-connected', username);
        }
    });
    socket.on('reconnection', function () {
        if (isDisconnected) {
            isDisconnected = false;
            socket.emit('user-reconnected');
            socket.broadcast.emit('opponent-reconnected');
        }
    });
    socket.on('join-room', function () {
        socket.join("game");
    });
    socket.on('leave-game', function () {
        socket.broadcast.emit('opponent-quit');
    });
    socket.on('cancel-game', function () {
        isCancelled = true;
    });
});
