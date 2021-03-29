import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { NetworkGameSettings } from './NetworkGameSettings';

@Injectable({
  providedIn: 'root'
})
export class GameNetworkingService {

  socket: any;

  constructor() {}

  //https://www.youtube.com/watch?v=66T2A2dvplY
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
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
  }

  public setGame(settings: NetworkGameSettings): void {
    this.socket.emit('create-lobby', settings);
  }

  public connectTCPserver(serverIP: string): void {
    this.socket = io("http://" + serverIP + ":8000");
    console.log("Server connection attempted");

    this.socket.on('popup', function(msg:any){
      console.log("hello: ", msg);
    });
    this.socket.on('connection', function() {
      console.log("client connected");
    });

    this.socket.on('connect_error', function(err:any) {
      console.log("client connect_error: ", err);
    });

    this.socket.on('connect_timeout', function(err:any) {
      console.log("client connect_timeout: ", err);
    });
  }

  public sendMove(move: string): void {
    this.socket.emit('send-move', move);
  }

  public sendChatMessage(message: string): void {
    this.socket.emit('send-chat-message', message);
  }

  public getNetGameSettings()
  {
    this.socket.emit('ask-game-settings');
  }

  public requestJoin()
  {
    this.socket.emit('request-join');
  }

}
