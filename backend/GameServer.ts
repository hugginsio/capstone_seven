import { NetworkGameSettings } from "./NetworkGameSettings";

export class GameServer {
  
  private server:any;
  private users:any;
  private gameSettings:NetworkGameSettings;
  private isDisconnected = false;
  private isCancelled = false;

  constructor() {
    console.log('Launching game server...');

    this.server = require('socket.io')(8000, {
      cors: {
        origin: true,
        credentials: true
      },
      pingTimeout: 1000,
      pingInterval: 1500
    });
    
    this.users = [];

    this.server.on('connection', (socket:any) => {

      socket.on('send-move', (move:string) => {
        socket.broadcast.emit("recieve-move", move);
      });
    
      socket.on('send-chat-message', (message:string) => {
        socket.broadcast.emit("recieve-chat-message", message);
      });
    
      socket.on('disconnecting', () => {
        if(!this.isDisconnected)
        {
          this.isDisconnected = true;
          this.server.emit('user-disconnected');
        }
      });

      socket.on('reset-lobby', () => {
        this.isCancelled = false;
        this.users = [];
        this.users.push(socket.id);
      });
    
      socket.on('create-lobby', (lobbyInfo: NetworkGameSettings) => {
        
        this.gameSettings = lobbyInfo;
        socket.join("game");
        socket.broadcast.emit('get-game-settings', this.gameSettings);
      });
    
      socket.on('request-join', (username:string) => {
        if(this.users.length >= 2)
        {
          socket.emit('lobby-full');
        }
        else if(this.isCancelled)
        {
          socket.emit('game-cancelled');
        }
        else
        {
          this.users.push(socket.id);
          socket.join("game");
          socket.broadcast.emit('opponent-connected', username);
        }
      });
    
      socket.on('reconnect', () => {
        if(this.isDisconnected)
        {
          this.isDisconnected = false;
          this.server.emit('user-reconnected');
          //socket.emit('user-reconnected');
          //socket.broadcast.emit('opponent-reconnected');
        }
      });
    
      socket.on('join-room', () => {
        socket.join("game");
      });
    
      socket.on('leave-game', () => {
        socket.broadcast.emit('opponent-quit');
      });
    
      socket.on('cancel-game', () => {
        this.isCancelled = true;
      });
    });
  }
}