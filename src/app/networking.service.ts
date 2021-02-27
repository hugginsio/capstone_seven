import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkingService {

  constructor() { }

<<<<<<< Updated upstream
=======
  const EventEmitter = require('events');
  const myEmitter = new this.EventEmitter();

  myEmitter.on('event', function firstListener(arg1: number, arg2: number): void {
    console.log("eventListener1 with 2 parameters")
  });

  myEmitter.emit('event', 1, 2);
  // has the match already been made ?

  // if host, send board to p2
  // else, receive board and send as seed to game manager

  // is host p1 always?
  // branches must be sent in the order they were placed

  // send players moves at endTurn
  // endTurn function can send us the move in string form
  // receive string and sent to game manager
  // *** game manager must put in a function to separate out the string
  // *** also maybe a function to set it as a string ?

  // at end of game, option to exit or to have a new game
>>>>>>> Stashed changes
  
}
