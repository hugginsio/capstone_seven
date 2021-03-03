//please work

export class GameClient {

  private socket: any;

  public gameJoined? : (msg:string) => void;

  constructor()
  {
        
  }

  public createTCPServer() {
    console.log("TCP Server Created!");
    this.socket = io("http://localhost:8000");
    this.listenTCP();
    this.socket.emit('create-lobby');
  }

  public connectTCPserver(serverIP: string) {
    console.log("Server connection attempted");
    this.socket = io("http://" + serverIP + ":8000");
    this.listenTCP();
  }

  private listenTCP() {
    this.socket.on('message', data => {
      //Process Message
    });

    this.socket.on('connected', data => {
      this.gameJoined(data);
    });
  }
}