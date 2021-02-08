import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  clickTile(event: MouseEvent): void {
    console.log(event);
    // event.target && console.log(`Clicked tile with ID: ${event.target.id as number}`);
  }

}
