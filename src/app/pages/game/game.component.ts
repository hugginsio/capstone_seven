import { Component, OnInit } from '@angular/core';

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

  ngOnInit(): void {
  }

  clickTile(event: MouseEvent): void {
    console.log(event);
    // event.target && console.log(`Clicked tile with ID: ${event.target.id as number}`);
  }

  togglePaused(): void {
    // Normally would do this in-template but we might need to put more functionality in later.
    this.gamePaused = !this.gamePaused;
  }
}
