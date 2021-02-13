import { Component, OnInit } from '@angular/core';
import { ClickEvent } from './interfaces/game.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public gamePaused: boolean;

  constructor() {
    this.gamePaused = false;
  }

  ngOnInit(): void { }

  clickPiece(event: ClickEvent): void {
    const pieceClass = event.target.className.split(' ');
    const pieceId = event.target.id.slice(1);
    const pieceType = event.target.id.slice(0, 1) === 'T' ? 'tile' : event.target.id.slice(0, 1) === 'B' ? 'branch' : 'node';
    if (pieceClass.indexOf('unavailable') !== -1) {
      // Ignore click event
      console.log(`Clicked ${pieceType} ${pieceId}, but piece is unavailable.`);
    } else if (pieceClass.indexOf('available') !== -1) {
      // Valid click event
      console.log(`Clicked available ${pieceType} ${pieceId}.`);
    } else {
      console.warn(`Click event on ${pieceType} ${pieceId} failed.`);
      console.warn('Piece class data:', event.target.className);
    }
  }

  togglePaused(): void {
    // Normally would do this in-template but we might need to put more functionality in later.
    this.gamePaused = !this.gamePaused;
  }
}
