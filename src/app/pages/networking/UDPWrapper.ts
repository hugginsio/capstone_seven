import * as dgram from 'dgram';
import * as os from 'os';
import * as broadcastAddress from 'broadcast-address';

export class UDPWrapper {

  //private netInfo: any;
  //private IP: string;
  private broadcastIP: string;
  private username: string;
  //private broadcast: string;
  private server: any;
  private netInterface: string;

  public gameFound?: (msg: string, oppAddress: string) => void;

  constructor() {
    this.server = dgram.createSocket('udp4');
    this.server.bind(41234);
    //this.netInfo = os.networkInterfaces();
    //this.IP = this.netInfo['Wi-Fi'][3].address;
    this.netInterface = this.getNetworkInterface();
    this.broadcastIP = broadcastAddress(this.netInterface);
    //this.broadcast = "This is a test broadcast, please remain calm.";
    this.username = 'Person McHuman';

    this.server.on('error', (err: any) => {
      console.log(`server error:\n${err.stack}`);
      this.server.close();
    });

    this.server.on('message', (msg: any, rinfo: any) => {
      this.gameFound!(msg.toString(), rinfo.address);
      //console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    });

    this.server.on("listening", () => {
      this.server.setBroadcast(true);
      const address = this.server.address();
      console.log(`server listening ${address.address}:${address.port}`);

    });
  }

  public broadcastGame(): void {
    this.server.send(this.username, 0, this.username.length, 41234, this.broadcastIP);
  }

  public setUsername(name: string): void {
    this.username = name;
  }

  private getNetworkInterface(): string {
    const netInfo = os.networkInterfaces();
    const interfaces = Object.keys(netInfo);
    const platform = os.platform();
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
  }
}