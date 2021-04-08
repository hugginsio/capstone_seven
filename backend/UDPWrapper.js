"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UDPWrapper = void 0;
var dgram = require("dgram");
var os = require("os");
var broadcastAddress = require("broadcast-address");
var UDPWrapper = (function () {
    function UDPWrapper() {
        var _this = this;
        this.server = dgram.createSocket('udp4');
        this.server.bind(41234);
        this.netInterface = this.getNetworkInterface();
        this.broadcastIP = broadcastAddress(this.netInterface);
        this.username = 'Person McHuman';
        this.server.on('error', function (err) {
            console.log("server error:\n" + err.stack);
            _this.server.close();
        });
        this.server.on('message', function (msg, rinfo) {
            _this.gameFound(msg.toString(), rinfo.address);
        });
        this.server.on("listening", function () {
            _this.server.setBroadcast(true);
            var address = _this.server.address();
            console.log("server listening " + address.address + ":" + address.port);
        });
    }
    UDPWrapper.prototype.broadcastGame = function () {
        this.server.send(this.username, 0, this.username.length, 41234, this.broadcastIP);
    };
    UDPWrapper.prototype.setUsername = function (name) {
        this.username = name;
    };
    UDPWrapper.prototype.getNetworkInterface = function () {
        var netInfo = os.networkInterfaces();
        var interfaces = Object.keys(netInfo);
        var platform = os.platform();
        console.log(netInfo);
        if (platform === 'win32') {
            if (interfaces.includes('Ethernet')) {
                return 'Ethernet';
            }
            else if (interfaces.includes('Wi-Fi')) {
                return 'Wi-Fi';
            }
        }
        else if (platform === 'darwin') {
            if (interfaces.includes('Ethernet')) {
                return 'Ethernet';
            }
            else if (interfaces.includes('Wi-Fi')) {
                return 'Wi-Fi';
            }
            else if (interfaces.includes('en0')) {
                return 'en0';
            }
            else if (interfaces.includes('en9')) {
                return 'en9';
            }
        }
        else {
            console.error("No viable OS found.");
        }
        console.error("No viable interfaces found.");
        return '';
    };
    return UDPWrapper;
}());
exports.UDPWrapper = UDPWrapper;
//# sourceMappingURL=UDPWrapper.js.map