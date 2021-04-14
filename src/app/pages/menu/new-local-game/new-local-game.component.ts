import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { SoundService } from "../../../shared/components/sound-controller/services/sound.service";
import { LocalStorageService } from "../../../shared/services/local-storage/local-storage.service";
import { ValidInputCheck } from "../valid-input-check";

@Component({
  selector: "app-new-local-game",
  templateUrl: "./new-local-game.component.html",
  styleUrls: ["../menu-common.scss"],
})
export class NewLocalGameComponent {
  public advancedOpts: boolean;
  public aiDifficultyString: string;
  public boardSeed: string;
  public explainationPopUp: boolean;
  public gameModeString: string;
  public guidedTutorial: boolean;
  public playerOneTheme: string;
  public playerOrder: number;
  public selectedLocation: number;
  public validInputCheck: ValidInputCheck;

  public readonly aiEasy = "Easy";
  public readonly aiHard = "Hard";
  public readonly aiMedium = "Medium";
  public readonly playerOrderOne = "Player Goes First";
  public readonly playerOrderTwo = "AI Goes First";
  public readonly playerThemeOne = "Player One is Miner";
  public readonly playerThemeTwo = "Player One is Machine";
  public readonly pva = "Player vs. AI";
  public readonly pvp = "Player vs. Player";

  constructor(
    private readonly routerService: Router,
    private readonly soundService: SoundService,
    private readonly storageService: LocalStorageService
  ) {
    // Initialize datastore to game context
    storageService.setContext("game");

    this.storageService.update("mode", "pva");
    this.gameModeString = this.storageService.fetch("mode") === "pvp" ? this.pvp : this.pva;
    this.aiDifficultyString = this.storageService.fetch("ai-difficulty") === "easy" ? this.aiEasy : this.aiMedium;
    this.advancedOpts = false;
    this.guidedTutorial = false;
    this.storageService.update("guided-tutorial", "false");
    this.playerOrder = this.storageService.fetch("firstplayer") === "1" ? 1 : 2;
    this.validInputCheck = new ValidInputCheck(this.storageService);
    this.explainationPopUp = false;
    this.playerOneTheme = this.storageService.fetch("playeronetheme");

    const storedLocation = this.storageService.fetch("location");
    if (storedLocation === "bg3") {
      this.selectedLocation = 3;
    } else if (storedLocation === "bg2") {
      this.selectedLocation = 2;
    } else {
      this.selectedLocation = 1;
    }
  }

  changeGameMode(): void {
    // Update UI
    this.gameModeString = this.gameModeString === this.pvp ? this.pva : this.pvp;

    // Update datastore
    this.gameModeString === this.pvp
      ? this.storageService.update("mode", "pvp")
      : this.storageService.update("mode", "pva");

    if (this.gameModeString !== this.pva) {
      this.guidedTutorial = false;
      this.storageService.update("guided-tutorial", "false");

      this.playerOrder = 1;
      this.storageService.update("firstplayer", this.playerOrder.toString());
    }
  }

  changePlayerTheme(): void {
    // Update UI
    this.playerOneTheme = this.playerOneTheme === "miner" ? "machine" : "miner";

    // Update datastore
    this.playerOneTheme === "miner"
      ? this.storageService.update("playeronetheme", "miner")
      : this.storageService.update("playeronetheme", "machine");
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

    // Update datastore
    this.storageService.update("ai-difficulty", this.aiDifficultyString.toLowerCase());
  }

  changeTutorialSetting(): void {
    // Update UI
    this.guidedTutorial = !this.guidedTutorial;

    if (this.guidedTutorial === true && this.storageService.fetch("firstplayer") !== "1") {
      this.storageService.update("firstplayer", "1");
    }

    // Update datastore
    this.storageService.update("guided-tutorial", this.guidedTutorial.toString());

    // Close options pane if it was open
    this.advancedOpts = false;
  }

  startGame(): void {
    // Set board seed before routing if not tutorial
    if (!this.guidedTutorial) {
      if (this.boardSeed !== undefined && this.boardSeed !== "") {
        const boardString = this.validInputCheck.checkBoardSeed(this.boardSeed);
        if (boardString !== "0") {
          this.storageService.update("board-seed", boardString);
        } else {
          this.boardSeed = "";
          return;
        }
      } else {
        this.storageService.update("board-seed", this.boardSeed);
      }
    }

    this.soundService.clear();
    this.routerService.navigate(["/game"]);
  }

  selectLocation(clicked: number): void {
    this.selectedLocation = clicked;
    this.storageService.update("location", `bg${clicked}`);
  }

  isLocSelected(button: number): string {
    if (this.selectedLocation === button) {
      return "border-gray-300";
    } else {
      return "border-gray-900";
    }
  }

  changePlayerOrder(): void {
    this.playerOrder = this.playerOrder === 1 ? 2 : 1;
    this.storageService.update("firstplayer", this.playerOrder.toString());

    if (this.playerOrder === 2) {
      this.guidedTutorial = false;
      this.storageService.update("guided-tutorial", "false");
    }
  }

  explainBoardSeed(): void {
    this.explainationPopUp = true;
  }

  dynamicClass(): string {
    if (this.validInputCheck.validBoard === false && this.boardSeed === "") {
      return "boardSeed-error";
    }
    this.validInputCheck.validBoard = true;
    return "";
  }
}
