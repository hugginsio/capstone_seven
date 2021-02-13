import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-local-game',
  templateUrl: './new-local-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewLocalGameComponent implements OnInit {
  private versusAi: boolean;
  public gameModeString: string;
  public aiDifficultyString: string;
  public advancedOpts: boolean;
  public boardSeed: string;
  public guidedTutorial: boolean;

  public readonly pvp = "Player vs. Player";
  public readonly pva = "Player vs. AI";
  public readonly aiEasy = "Easy";
  public readonly aiMedium = "Medium";

  constructor() {
    this.versusAi = false;
    this.gameModeString = this.pva;
    this.aiDifficultyString = this.aiEasy;
    this.advancedOpts = false;
    this.guidedTutorial = false;
  }

  ngOnInit(): void {}

  changeGameMode(): void {
    this.gameModeString = this.gameModeString === this.pvp ? this.pva : this.pvp;
    this.versusAi = this.gameModeString === this.pvp ? false : true;
  }

  changeAiDifficulty(): void {
    this.aiDifficultyString = this.aiDifficultyString === this.aiEasy ? this.aiMedium : this.aiEasy;
  }
}
