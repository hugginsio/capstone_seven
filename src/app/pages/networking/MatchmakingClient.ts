//import { socketIO } from 

export class MatchmakingClient {

  private socket: any;

  public gameFound?: (msg:string, oppAddress:string) => void;

  constructor()
  {
    this.socket = io("http://localhost:3000");
    this.setListeners();
  }

  private setListeners()
  {
    this.socket.on('you-connected', () => {
      console.log("Client connected to UDP server");
    });

    this.socket.on('game-found', info => {
      console.log(info);
      this.gameFound(info.msg, info.oppAddress);
    });
  }

  public hostGame() {
    this.socket.emit('create-lobby');
  }
}