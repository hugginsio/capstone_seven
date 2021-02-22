import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../../shared/services/local-storage/local-storage.service';
import { Player } from './classes/gamecore/game.class.Player';
import { CommCode } from './interfaces/game.enum';
import { ClickEvent, CommPackage } from './interfaces/game.interface';
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
  private winningPlayer: Player;

  private readonly commLink = new Subject<CommPackage>();

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
    if (boardSeed === '!random' || boardSeed === 'undefined') {
      this.gameManager.createBoard(true);
      console.log(this.gameManager.getBoard());
    } else {
      // create gameboard with user defined seed
      this.gameManager.createBoard(true);
    }

    // Subscribe to own communications link
    this.commLink.subscribe(message => {
      const status = message.code;

      // Check which player sent the message before we run player-centric commands
      if (this.gameManager.getCurrentPlayer() === message.player) {
        if (status === CommCode.IS_TRADING) {
          this.isTrading = true;
        } else if (status === CommCode.END_TURN) {
          this.gameManager.endTurn(this.gameManager.getCurrentPlayer());
        } else if (status === CommCode.END_GAME) {
          this.gameOverText = `${this.gameManager.getCurrentPlayerEnum()} Won!`;
          this.gameOver = true;
        }
      }
    });

    // Subscribe to gamemanager commlink
    this.gameManager.commLink.subscribe(message => {
      const status = message.code;
      const player = message.player;
      const magic = message.magic;

      if (status === CommCode.END_GAME && player && magic) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        this.gameOverText = `${magic} Won!`;
        this.winningPlayer = player;
        this.gameOver = true;
      }
    });
  }

  assemblePieceClass(piece: 'T' | 'N' | 'BX' | 'BY', id: number): string {
    let result = '';
    switch (piece) {
      case 'T':
        if (this.gameManager.getBoard().tiles[id].color === "BLANK") {
          result += `unavailable tile-${this.gameManager.getBoard().tiles[id].color}`;
          break;
        } else {
          result += `tile-${this.gameManager.getBoard().tiles[id].color}`;
        }

        if (this.gameManager.getBoard().tiles[id].capturedBy !== 'NONE') {
          result += `-capture-${this.gameManager.getBoard().tiles[id].capturedBy === 'PLAYERONE' ? 'orange' : 'purple'}`;
          break;
        }

        if (this.gameManager.getBoard().tiles[id].isExhausted) {
          result += '-exhausted';
          break;
        }

        if (this.gameManager.getBoard().tiles[id].maxNodes !== 0) {
          result += `-${this.gameManager.getBoard().tiles[id].maxNodes.toString()}`;
        }

        break;

      case 'N':
        if (this.gameManager.getBoard().nodes[id].getOwner() !== 'NONE') {
          result += `node-${this.gameManager.getBoard().nodes[id].getOwner() === 'PLAYERONE' ? 'orange' : 'purple'}`;
        } else {
          result += 'available';
        }

        break;

      case 'BX':
        if (this.gameManager.getBoard().branches[id].getOwner() !== 'NONE') {
          result += `branch-${this.gameManager.getBoard().branches[id].getOwner() === 'PLAYERONE' ? 'orange' : 'purple'}-x`;
        } else {
          result += 'available';
        }

        break;
    
      case 'BY':
        if (this.gameManager.getBoard().branches[id].getOwner() !== 'NONE') {
          result += `branch-${this.gameManager.getBoard().branches[id].getOwner() === 'PLAYERONE' ? 'orange' : 'purple'}-y`;
        } else {
          result += 'available';
        }

        break;
    
      default:
        break;
    }

    result = result.toLowerCase();
    return result;
  }

  clickPiece(event: ClickEvent): void {
    const player = this.gameManager.getCurrentPlayer();
    const pieceClass = event.target.className.split(' ');
    const pieceId = +event.target.id.slice(1);
    const pieceType = event.target.id.slice(0, 1) === 'T' ? 'tile' : event.target.id.slice(0, 1) === 'B' ? 'branch' : 'node';
    
    if (pieceClass.indexOf('unavailable') !== -1) {
      console.warn(`Clicked ${pieceType} ${pieceId}, but piece is unavailable.`);
    } else if (pieceClass.indexOf('available') !== -1) {
      console.log(`Clicked available ${pieceType} ${pieceId}.`);
      if (pieceType === 'node') {
        if (player.numNodesPlaced === 0) {
          this.gameManager.initialNodePlacements(pieceId, player);
        } else if (player.numNodesPlaced === 1 && player.ownedBranches?.length !== 1) {
          console.warn('place a branch');
        } else if (player.numNodesPlaced === 1 && player.ownedBranches.length === 1) {
          this.gameManager.initialNodePlacements(pieceId, player);
        } else if (player.numNodesPlaced >= 2 && player.ownedBranches.length >= 2) {
          // They have placed initial nodes, place normally
          this.gameManager.generalNodePlacement(pieceId, player);
        }
      } else if (pieceType === 'branch') {
        if (player.numNodesPlaced === 0) {
          console.warn('place a node first');
        } else if (player.numNodesPlaced === 1 && player.ownedBranches?.length === 0) {
          let relatedNode = -1;
          this.gameManager.getBoard().nodes.forEach(el => {
            if (el.getOwner() === this.gameManager.getCurrentPlayerEnum()) {
              relatedNode = this.gameManager.getBoard().nodes.indexOf(el);
            }
          });

          this.gameManager.initialBranchPlacements(relatedNode, pieceId, player);
          // they finished their first initial placement, next player's turn
        } else if (player.numNodesPlaced === 2 && player.ownedBranches.length === 1) {
          let relatedNode = -1;
          this.gameManager.getBoard().nodes.forEach(el => {
            // Need to double check that we're verifying the correct node here prior to placement
            // Possible defect: allows placing next to original node
            if (el.getOwner() === this.gameManager.getCurrentPlayerEnum()) {
              if (el.getTopBranch() === pieceId || el.getRightBranch() === pieceId || el.getBottomBranch() === pieceId || el.getLeftBranch() === pieceId) {
                relatedNode = this.gameManager.getBoard().nodes.indexOf(el);
                return;
              }
            }
          });

          this.gameManager.initialBranchPlacements(relatedNode, pieceId, player);
        } else if (player.numNodesPlaced >= 2 && player.ownedBranches.length >= 2) {
          // They have placed their initial branches, place normally
          this.gameManager.generalBranchPlacement(pieceId, player);
        }
      }
    } else {
      console.warn(`Click event on ${pieceType} ${pieceId} failed. This may be due to constraints detected by the game manager.`);
      console.warn('Piece class data:', event.target.className);
    }

    // console.warn(this.gameManager.getBoard());
  }

  togglePaused(): void {
    // Normally would do this in-template but we might need to put more functionality in later.
    this.gamePaused = !this.gamePaused;
  }

  toggleTrade(): void {
    this.isTrading = false;
  }

  executeTrade(): void {
    // Communicate trade to game core
    this.isTrading = false;
  }
}
