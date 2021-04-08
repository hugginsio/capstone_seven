"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchmakingServer = void 0;
var UDPWrapper_1 = require("./UDPWrapper");
var MatchmakingServer = (function () {
    function MatchmakingServer() {
        var _this = this;
        console.log('Launching matchmaking server...');
        this.io = require('socket.io')(3000, {
            cors: {
                origin: true,
                credentials: true
            },
        });
        this.udp = new UDPWrapper_1.UDPWrapper();
        this.io.on('connection', function (socket) {
            socket.on('disconnect', function () {
                socket.emit('user-disconnected');
            });
            socket.on('set-username', function (username) {
                _this.udp.setUsername(username);
                socket.emit("you-connected");
            });
            socket.on('broadcast-game', function () {
                _this.udp.broadcastGame();
            });
        });
        this.udp.gameFound = function (username, oppAddress) {
            console.log(username + " is hosting a game at: " + oppAddress);
            _this.io.emit('game-found', { username: username, oppAddress: oppAddress });
        };
    }
    return MatchmakingServer;
}());
exports.MatchmakingServer = MatchmakingServer;
//# sourceMappingURL=MatchmakingServer.js.map