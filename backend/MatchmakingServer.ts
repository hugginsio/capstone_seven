//import socketIO from 'socket.io';
import { UDPWrapper } from "./UDPWrapper";

export class MatchmakingServer {

  private io:any;
  private udp:UDPWrapper;

  constructor() {
    console.log('Launching matchmaking server...');

    try {
      this.udp = new UDPWrapper();
    } catch (error) {
      console.error("No Viable Network Interface");
      return;
    }

    this.io = require('socket.io')(3000, {
      cors: {
        origin: true,
        credentials: true
      },
    });

    

    this.io.on('connection', (socket: any) => {

      socket.on('disconnect', () => {
        socket.emit('user-disconnected');
      });

      socket.on('set-username', (username: string) => {
        this.udp.setUsername(username);
        socket.emit("you-connected");
      });

      socket.on('broadcast-game', () => {
        this.udp.broadcastGame();
      });
    });

    this.udp.gameFound = (username: string, oppAddress: string) => {
      console.log(`${username} is hosting a game at: ${oppAddress}`);
      this.io.emit('game-found', { username: username, oppAddress: oppAddress });
    };
  }
}
