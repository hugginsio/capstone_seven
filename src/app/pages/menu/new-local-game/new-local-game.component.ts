import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-new-local-game',
  templateUrl: './new-local-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewLocalGameComponent implements OnInit {
  public gameModeString: string;
  public aiDifficultyString: string;
  public advancedOpts: boolean;
  public boardSeed: string;
  public guidedTutorial: boolean;
  public selectedLocation: number;

  public readonly pvp = "Player vs. Player";
  public readonly pva = "Player vs. AI";
  public readonly aiEasy = "Easy";
  public readonly aiMedium = "Medium";

  constructor(
    private readonly storageService: LocalStorageService,
    private readonly routerService: Router
  ) {
    // Initialize datastore to game context
    storageService.setContext('game');

    this.gameModeString = this.storageService.fetch('mode') === 'pvp' ? this.pvp : this.pva;
    this.aiDifficultyString = this.storageService.fetch('ai-difficulty') === 'easy' ? this.aiEasy : this.aiMedium;
    this.advancedOpts = false;
    this.guidedTutorial = false;

    const storedLocation =  this.storageService.fetch('location');
    if (storedLocation === 'bg3') {
      this.selectedLocation = 3;
    } else if (storedLocation === 'bg2') {
      this.selectedLocation = 2;
    } else {
      this.selectedLocation = 1;
    }
  }

  ngOnInit(): void {}

  changeGameMode(): void {
    // Update UI
    this.gameModeString = this.gameModeString === this.pvp ? this.pva : this.pvp;

    // Update datastore
    this.gameModeString === this.pvp ? this.storageService.update('mode', 'pvp') : this.storageService.update('mode', 'pva');

    if (this.gameModeString === this.pva) {
      this.guidedTutorial = false;
      this.storageService.update('guided-tutorial', 'false');
    }
  }

  changeAiDifficulty(): void {
    // Update UI
    this.aiDifficultyString = this.aiDifficultyString === this.aiEasy ? this.aiMedium : this.aiEasy;

    // Update datastore
    this.storageService.update('ai-difficulty', this.aiDifficultyString.toLowerCase());
  }

  changeTutorialSetting(): void {
    // Update UI
    this.guidedTutorial = !this.guidedTutorial;

    // Update datastore
    this.storageService.update('guided-tutorial', this.guidedTutorial.toString());
  }

  startGame(): void {
    // Set board seed before routing
    this.storageService.update('board-seed', this.boardSeed);
    this.routerService.navigate(['/game']);
  }

  selectLocation(clicked: number): void {
    console.log(clicked);
    this.selectedLocation = clicked;
    this.storageService.update('location', `bg${clicked}`);
  }

  isLocSelected(button: number): string {
    if (this.selectedLocation === button) {
      return 'border-gray-300';
    } else {
      return 'border-gray-900';
    }
  }
}
