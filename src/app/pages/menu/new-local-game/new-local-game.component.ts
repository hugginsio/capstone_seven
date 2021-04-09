import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-new-local-game',
  templateUrl: './new-local-game.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewLocalGameComponent {
  public advancedOpts: boolean;
  public aiDifficultyString: string;
  public boardSeed: string;
  public gameModeString: string;
  public guidedTutorial: boolean;
  public playerOrder: number;
  public selectedLocation: number;

  public readonly aiEasy = "Easy";
  public readonly aiMedium = "Medium";
  public readonly aiHard = "Hard";
  public readonly playerOrderOne = "Player Goes First";
  public readonly playerOrderTwo = "AI Goes First";
  public readonly pva = "Player vs. AI";
  public readonly pvp = "Player vs. Player";

  constructor(
    private readonly storageService: LocalStorageService,
    private readonly routerService: Router
  ) {
    // Initialize datastore to game context
    storageService.setContext('game');

    this.storageService.update('mode', 'pva');
    this.gameModeString = this.storageService.fetch('mode') === 'pvp' ? this.pvp : this.pva;
    this.aiDifficultyString = this.storageService.fetch('ai-difficulty') === 'easy' ? this.aiEasy : this.aiMedium;
    this.advancedOpts = false;
    this.guidedTutorial = false;
    this.playerOrder = this.storageService.fetch('firstplayer') === '1' ? 1 : 2;

    const storedLocation =  this.storageService.fetch('location');
    if (storedLocation === 'bg3') {
      this.selectedLocation = 3;
    } else if (storedLocation === 'bg2') {
      this.selectedLocation = 2;
    } else {
      this.selectedLocation = 1;
    }
  }

  changeGameMode(): void {
    // Update UI
    this.gameModeString = this.gameModeString === this.pvp ? this.pva : this.pvp;

    // Update datastore
    this.gameModeString === this.pvp ? this.storageService.update('mode', 'pvp') : this.storageService.update('mode', 'pva');

    if (this.gameModeString !== this.pva) {
      this.guidedTutorial = false;
      this.storageService.update('guided-tutorial', 'false');
      
      this.playerOrder = 1;
      this.storageService.update('firstplayer', this.playerOrder.toString());
    }
  }

  changeAiDifficulty(): void {
    // Update UI
    if (this.aiDifficultyString === this.aiEasy) {
      this.aiDifficultyString = this.aiMedium;
    } else if (this.aiDifficultyString === this.aiMedium) {
      this.aiDifficultyString = this.aiHard;
    } else {
      this.aiDifficultyString = this.aiEasy;
    }

    if(this.aiDifficultyString !== this.aiEasy) {
      this.guidedTutorial = false;
      this.storageService.update('guided-tutorial', 'false');
    }

    // Update datastore
    this.storageService.update('ai-difficulty', this.aiDifficultyString.toLowerCase());

    // Disable guided tutorial if not PVA && aiEasy
    if (this.aiDifficultyString !== this.aiEasy) {
      this.storageService.update('guided-tutorial', 'false');
    }
  }

  changeTutorialSetting(): void {
    // Update UI
    this.guidedTutorial = !this.guidedTutorial;

    // Update datastore
    this.storageService.update('guided-tutorial', this.guidedTutorial.toString());

    // Close options pane if it was open
    this.advancedOpts = false;
  }

  startGame(): void {
    // Set board seed before routing if not tutorial
    if (!this.guidedTutorial) {
      this.storageService.update('board-seed', this.boardSeed);
    }

    this.routerService.navigate(['/game']);
  }

  selectLocation(clicked: number): void {
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

  changePlayerOrder(): void {
    this.playerOrder = this.playerOrder === 1 ? 2 : 1;
    this.storageService.update('firstplayer', this.playerOrder.toString());
  }
}
