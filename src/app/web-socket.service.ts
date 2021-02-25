import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs/Rx';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

// websocket service will handle direct communication with the socket
export class WebSocketService {

  // out socket connection that connects to our socket.io server 
  private socket;

  constructor() { }

  // connect method, takes in nothing and returns an RX.Subject
  connect(){

    // setting socket as the websocket url -- local host in example
    this.socket = io(environment.SOCKET_ENDPOINT);

    // observables either can be observed or they emit some values
    // observers catch those values, an observer subscribes to an observable 
    // to receive and react to the events emmitted by the observable 

    // observable observes any incoming messages from socket.io server
    // new Observable creates a stream 
    let observable = new Observable(observer => {
      this.socket.io('message', (data) => {
        console.log("Received message from webSocket Server")
        // next is used to emit the next value from the observable
        // i guess this is like a send back to whoever we are talking to ?
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });


    // observable will listen to messages from other components
    // and send back to our socket server whenever the next method is called
    let observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    // return this subject which is a combo of observer and observable 
    // return Rx.Subject.create(observer,observable);
  }

}


// socket.on
// eventEmitter **** listeners!!
// socket.onopen