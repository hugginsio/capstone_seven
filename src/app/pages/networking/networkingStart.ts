// const dgram = require('dgram');
// const os = require('os');
// const subInfo = require('subnet-info');

export class Networking {
  constructor() {}

  initialize(): void {
    const netInfo = os.networkInterfaces();
    const IP = netInfo.address;
    const CIDR = netInfo.CIDR;
    const subnetInfo = new subInfo(CIDR);
    const broadcastAddress = subnetInfo.broadcastAddress;

    const socket = dgram.createSocket('udp4');
    socket.bind(41234, function () {
      socket.addMembership(IP);
      console.log("Your IP is: ", IP);
    });

    socket.on("listening", function () {
      socket.send("string", 0, 6, 41234, broadcastAddress);
      //server.emit("blah blah")
    });

    socket.on("message", function (msg: any, rinfo: any) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      console.log(`Message: ${msg} from ${rinfo.address}`);
    });



    socket.setBroadcast(true);

    //tsc networkingStart.ts
    //node networkingStart.ts
  }
}