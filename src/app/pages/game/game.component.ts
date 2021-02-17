import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage/local-storage.service';
import { ClickEvent } from './interfaces/game.interface';
import { ManagerService } from './services/gamecore/manager.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public gamePaused: boolean;
  public isTrading: boolean;
  public gameOver: boolean;
  public gameOverText: string;

  constructor(
    private readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService
  ) {
    // Set defaults for modal triggers
    this.gamePaused = false;
    this.isTrading = false;
    this.gameOver = false;
    this.gameOverText = "Victory!";

    this.storageService.setContext('game');
  }

  ngOnInit(): void {
    // Fetch the board seed set in memory
    const boardSeed = this.storageService.fetch('board-seed');
    if ( boardSeed === '!random' || boardSeed === 'undefined') {
      this.gameManager.createBoard(true);
      console.log(this.gameManager.getBoard());
    } else {
      // create gameboard with user defined seed
    }
  }

  assemblePieceClass(piece: 'T' | 'N' | 'B', id: number): string {
    let result = '';
    switch (piece) {
      case 'T':
        if (this.gameManager.getBoard().tiles[id].color === "BLANK") {
          result += 'unavailable ';
        }

        result += `tile-${this.gameManager.getBoard().tiles[id].color}`;

        if (this.gameManager.getBoard().tiles[id].isExhausted) {
          result += '-exhausted';
          break;
        }

        if (this.gameManager.getBoard().tiles[id].capturedBy !== 'NONE') {
          result += `-capture-${this.gameManager.getBoard().tiles[id].capturedBy === 'PLAYERONE' ? 'orange' : 'purple'}`;
          break;
        }

        if (this.gameManager.getBoard().tiles[id].maxNodes !== 0) {
          result += `-${this.gameManager.getBoard().tiles[id].maxNodes}`;
        }

        break;

      case 'N':
        if (this.gameManager.getBoard().nodes[id].getOwner() !== 'NONE') {
          result += `node-${this.gameManager.getBoard().nodes[id].getOwner() === 'PLAYERONE' ? 'orange' : 'purple'}`;
        }

        break;
    
      default:
        break;
    }

    result = result.toLowerCase();
    return result;
  }

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

  toggleTrade(): void {
    // Normally would do this in-template but we might need to put more functionality in later.
    this.isTrading = !this.isTrading;
  }

  executeTrade(): void {
    // Communicate trade to game core
    this.isTrading = !this.isTrading;
  }
}
