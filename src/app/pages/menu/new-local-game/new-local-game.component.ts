import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-local-game',
  templateUrl: './new-local-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewLocalGameComponent implements OnInit {
  private versusAi: boolean;
  public gameModeString: string;
  public advancedOpts: boolean;
  public boardSeed: string;

  private readonly pvp = "Player vs. Player";
  private readonly pva = "Player vs. AI";

  constructor() {
    this.versusAi = false;
    this.gameModeString = this.pva;
    this.advancedOpts = false;
  }

  ngOnInit(): void {}

  changeGameMode(): void {
    this.gameModeString = this.gameModeString === this.pvp ? this.pva : this.pvp;
    this.versusAi = this.gameModeString === this.pvp ? false : true;
  }
}
