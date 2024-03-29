import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io } from "socket.io-client";
import { NetworkGameSettings } from "../../../../backend/NetworkGameSettings";

@Injectable({
  providedIn: "root",
})
export class GameNetworkingService {
  private socket: any;
  private isGameSocket = false;

  constructor() {}

  //https://www.youtube.com/watch?v=66T2A2dvplY
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  listenReconnect(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.io.on("reconnect", (data: any) => {
        subscriber.next(data);
      });
    });
  }

  /*
    Things to listen for:
    - UI 'lobby-joined': confirmation you connected to the game server. returns a the board as a string.
    - UI 'disconnecting?': confirmation you disconnected (perhaps unintentionally) form the game server.
    built-in error
    - UI 'disconnect?': someone has disconnected. built-in error
    - UI 'lobby-full': there are already two players here. no data
    - UI 'recieve-chat-message': the opponent has sent a chat message. string 
    - GC 'recieve-move': the opponent has sent a move. string
    - Rematch Handshake (I haven't thought this out yet)
  */

  public createTCPServer(): void {
    this.socket = io("http://localhost:8000");
    console.log("TCP Server Created!");
    this.setListners();
  }

  public setGame(settings: NetworkGameSettings): void {
    this.socket.emit("create-lobby", settings);
  }

  public connectTCPserver(serverIP: string): void {
    this.socket = io("http://" + serverIP + ":8000");
    console.log("Server connection attempted");
    this.setListners();
  }

  private setListners() {
    /*
    this.socket.io.on('reconnect', () => {
      this.socket.emit('reconnection');
      if(this.isGameSocket)
      {
        this.socket.emit('join-room');
      }
    });
    */
  }

  public resetRoom(): void {
    this.socket.emit("reset-lobby");
  }

  public setIsGameSocket(): void {
    this.isGameSocket = true;
    this.socket.emit("join-room");
  }

  public sendMove(move: string): void {
    this.socket.emit("send-move", move);
  }

  public sendChatMessage(message: string): void {
    this.socket.emit("send-chat-message", message);
  }

  public getNetGameSettings(): void {
    this.socket.emit("ask-game-settings");
  }

  public requestJoin(username: string): void {
    this.socket.emit("request-join", username);
  }

  public leaveGame(): void {
    this.socket.emit("leave-game");
  }

  public disconnectSocket(): void {
    this.socket.disconnect();
  }

  public cancelGame(): void {
    this.socket.emit("cancel-game");
    this.socket.disconnect();
  }

  public notifyReconnect(): void {
    this.socket.emit("reconnection");
  }
}
