"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServer = void 0;
var GameServer = (function () {
    function GameServer() {
        var _this = this;
        this.isDisconnected = false;
        this.isCancelled = false;
        console.log('Launching game server...');
        this.server = require('socket.io')(8000, {
            cors: {
                origin: true,
                credentials: true
            },
            pingTimeout: 1000,
            pingInterval: 1500
        });
        this.users = [];
        this.server.on('connection', function (socket) {
            socket.on('send-move', function (move) {
                socket.broadcast.emit("recieve-move", move);
            });
            socket.on('send-chat-message', function (message) {
                socket.broadcast.emit("recieve-chat-message", message);
            });
            socket.on('disconnecting', function () {
                if (!_this.isDisconnected) {
                    _this.isDisconnected = true;
                    _this.server.emit('user-disconnected');
                }
            });
            socket.on('reset-lobby', function () {
                _this.isCancelled = false;
                _this.users = [];
                _this.users.push(socket.id);
            });
            socket.on('create-lobby', function (lobbyInfo) {
                _this.gameSettings = lobbyInfo;
                socket.join("game");
                socket.broadcast.emit('get-game-settings', _this.gameSettings);
            });
            socket.on('request-join', function (username) {
                if (_this.users.length >= 2) {
                    socket.emit('lobby-full');
                }
                else if (_this.isCancelled) {
                    socket.emit('game-cancelled');
                }
                else {
                    _this.users.push(socket.id);
                    socket.join("game");
                    socket.broadcast.emit('opponent-connected', username);
                }
            });
            socket.on('reconnection', function () {
                if (_this.isDisconnected) {
                    _this.isDisconnected = false;
                    socket.broadcast.emit('user-reconnected');
                }
            });
            socket.on('join-room', function () {
                socket.join("game");
            });
            socket.on('leave-game', function () {
                socket.broadcast.emit('opponent-quit');
            });
            socket.on('cancel-game', function () {
                _this.isCancelled = true;
            });
        });
    }
    return GameServer;
}());
exports.GameServer = GameServer;
//# sourceMappingURL=GameServer.js.map