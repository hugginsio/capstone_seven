import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {

  private socket: any;
  private username: string;

  constructor() {}

  initialize(name: string): void {
    console.log("UDP connection attempted");
    this.socket = io("http://localhost:3000");
    this.username = name;

    this.socket.on('you-connected', () => {
      console.log("Yep, it's listen() that's broken, not the socket.");
    });

    this.socket.emit('set-username', this.username);
  }

  //https://www.youtube.com/watch?v=66T2A2dvplY
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }
  /*
    Must Listen for:
    - 'you-connected': confirmation you connected to your UDP server. returns a string
    - 'you-disconnected': confirmation you disconnected (perhaps unintentionally) form your UDP server.
    returns string
    - 'game-found': someone is broadcasting. returns a Game/User object (Name, IP, ID?).
  */

  broadcastGame(): void {
    this.socket.emit('broadcast-game');
  }
}
