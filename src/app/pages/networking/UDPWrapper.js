"use strict";
exports.__esModule = true;
exports.UDPWrapper = void 0;
var dgram = require("dgram");
var os = require("os");
var broadcastAddress = require("broadcast-address");
var UDPWrapper = /** @class */ (function () {
    function UDPWrapper() {
        var _this = this;
        this.server = dgram.createSocket('udp4');
        this.server.bind(41234);
        //this.netInfo = os.networkInterfaces();
        //this.IP = this.netInfo['Wi-Fi'][3].address;
        this.netInterface = this.getNetworkInterface();
        this.broadcastIP = broadcastAddress(this.netInterface);
        //this.broadcast = "This is a test broadcast, please remain calm.";
        this.username = 'Person McHuman';
        this.server.on('error', function (err) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            console.log("server error:\n" + err.stack);
            _this.server.close();
        });
        this.server.on('message', function (msg, rinfo) {
            _this.gameFound(msg.toString(), rinfo.address);
            //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        });
        this.server.on("listening", function () {
            _this.server.setBroadcast(true);
            var address = _this.server.address();
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
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
