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
      if(this.boardSeed !== undefined){
        const boardString = this.checkBoardSeed();
        if(boardString !== '0') {
          this.storageService.update('board-seed', boardString);
        }
        else {
          // display error message and start the game with a random board
          console.log("boardSeed is invalid");
        }
      }
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

  checkBoardSeed():string {
    const invalidBoard = "0";
    let validSortedBoard = ["00", "B1", "B2", "B3", "G1", "G2", "G3", "R1", "R2", "R3", "Y1", "Y2", "Y3"];
    // https://stackoverflow.com/questions/49145250/how-to-remove-whitespace-from-a-string-in-typescript
    const boardString = this.boardSeed.replace(/\s/g, "");

    let boardArray = boardString.split(",");
    boardArray = boardArray.sort();

    if (boardArray.length !== 13) {
      return invalidBoard;
    }
    for(let i = 0; i < 13; i++) {
      if (boardArray[i] !== validSortedBoard[i]){
        return invalidBoard;
      }
    }
    return boardString;
  }
}
