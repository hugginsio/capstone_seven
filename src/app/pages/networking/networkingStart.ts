export class networking {
    constructor() {}

    initialize(): void {
        let dgram = require('dgram');
        let os = require('os');
        let subInfo = require('subnet-info');

        var netInfo = os.networkInterfaces();
        var IP = netInfo.address;
        var CIDR = netInfo.CIDR;
        var subnetInfo = new subInfo(CIDR);
        var broadcastAddress = subnetInfo.broadcastAddress;

        var socket = dgram.createSocket('udp4');
        socket.bind(41234, function () {
            socket.addMembership(IP);
            console.log("Your IP is: " + IP);
        });

        socket.on("listening", function () {
            socket.send("string", 0, 6, 41234, broadcastAddress);
            //server.emit("blah blah")
        });

        socket.on("message", function (msg, rinfo) {
            console.log("Message :" + msg + " From :" + rinfo.address);
        })



        socket.setBroadcast(true);

        //tsc networkingStart.ts
        //node networkingStart.ts
    }
}