import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkingService {

  constructor() { }

  const EventEmitter = require('events');
  const myEmitter = new this.EventEmitter();

  myEmitter.on('event', function firstListener(arg1: number, arg2: number): void {
    console.log("eventListener1 with 2 parameters")
  });

  myEmitter.emit('event', 1, 2);
  
}
