let dgram = require('dgram');
let os = require('os');

var netInfo = os.networkInterfaces();
var IP = netInfo.address;

var socket = dgram.createSocket('udp4');
socket.bind(41234, function() {
    socket.addMembership(IP);
    console.log("Your IP is: " + IP);
});