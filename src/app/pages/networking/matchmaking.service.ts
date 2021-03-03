import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
@Injectable({
  providedIn: 'root'
})
export class MatchmakingService {

  socket: any;
  username: string;

  constructor(name:string) 
  { 
    this.socket = io("http://localhost:3000");
    this.username = name;
    this.socket.emit('set-username');
  }

  //https://www.youtube.com/watch?v=66T2A2dvplY
  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    });
  }
  /*
    Must Listen for:
    - 'you-connected': confirmation you connected to your UDP server. returns a string
    - 'you-disconnected': confirmation you disconnected (perhaps unintentionally) form your UDP server.
    returns string
    - 'game-found': someone is broadcasting. returns a Game/User object (Name, IP, ID?).
  */

  broadcastGame()
  {
    this.socket.emit('broadcast-game');
  }
}
