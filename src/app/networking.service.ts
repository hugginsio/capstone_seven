import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkingService {

  constructor() { }

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
  
  // should there be a newgame button on the main screen so they dont
  // have to loose connection if they tie ??
}
