import * as dgram from 'dgram';
import * as os from 'os';
import * as broadcastAddress from 'broadcast-address';

export class UDPWrapper {

    private netInfo: any;
    private IP: string;
    private broadcastIP: string;
    private username: string;
    private broadcast: string;
    private server: any;

    public gameFound?: (msg:string, oppAddress:string) => void;

    constructor(name:string) {
        this.server = dgram.createSocket('udp4');
        this.server.bind(41234);
        this.netInfo = os.networkInterfaces();
        this.IP = this.netInfo['Wi-Fi'][3].address;
        this.broadcastIP = broadcastAddress('Wi-Fi');
        this.broadcast = "This is a test broadcast, please remain calm.";
        this.username = name;

        this.server.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            this.server.close();
        });
        
        this.server.on('message', (msg, rinfo) => {
            this.gameFound(msg, rinfo.address);
            //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        });
        
        this.server.on("listening", () => {
            this.server.setBroadcast(true);
            const address = this.server.address();
            console.log(`server listening ${address.address}:${address.port}`);
            
        });
    }
    
    /**
     * broadcastGame
     */
    public broadcastGame() {
        this.server.send(this.broadcast, 0, this.broadcast.length, 41234, this.broadcastIP);
    }

    private sendChallenge(oppIP:string) {
        let challenge:string = "It's time to D-D-DUUUEEEELLL!!!";
        this.server.send(challenge, 0, challenge.length, 41234, oppIP);
    }
    
}