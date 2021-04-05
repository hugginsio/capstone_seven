import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../../shared/services/local-storage/local-storage.service';
import { Player } from './classes/gamecore/game.class.Player';
import { CommCode } from './interfaces/game.enum';
import { ClickEvent, CommPackage } from './interfaces/game.interface';
import { ManagerService } from './services/gamecore/manager.service';
import { TradingModel } from './models/trading.model';
import { SnackbarService } from '../../shared/components/snackbar/services/snackbar.service';
import { GameNetworkingService } from '../networking/game-networking.service';
import { Router } from '@angular/router';
//import { GameType } from './enums/game.enums';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public gameIntro: boolean;
  public gameOver: boolean;
  public gameOverText: string;
  public gamePaused: boolean;
  public isTrading: boolean;
  public showHelp: boolean;
  public tradingModel: TradingModel;
  public isTutorial: boolean;
  public isNetwork: boolean;
  public winningPlayer: Player;
  public username: string;
  public oppUsername: string;
  public isConnected: boolean;
  public opponentQuit: boolean;

  public readonly commLink = new Subject<CommPackage>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService,
    private readonly networkingService: GameNetworkingService,
    private readonly routerService: Router
  ) {
    // Set defaults for UI triggers
    this.gameIntro = true;
    this.gameOver = false;
    this.gameOverText = "Victory!";
    this.gamePaused = false;
    this.isTrading = false;
    this.tradingModel = new TradingModel();
    this.isNetwork = false;
    this.isTutorial = false;
    this.isConnected = true;
    this.opponentQuit = false;

    this.storageService.setContext('game');
  }

  ngOnInit(): void {
    // Subscribe to own communications link
    this.commLink.subscribe(message => {
      const status = message.code;

      // Check which player sent the message before we run player-centric commands
      if (this.gameManager.getCurrentPlayer() === message.player) {
        if (status === CommCode.IS_TRADING) {
          const currentPlayer = this.gameManager.getCurrentPlayer();
          if (currentPlayer.numNodesPlaced < 2 || currentPlayer.ownedBranches.length < 2) {
            this.snackbarService.add({ message: 'You cannot trade right now.' });
          } else if (currentPlayer.hasTraded) {
            this.snackbarService.add({ message: 'You have already traded this turn.' });
          } else {
            this.isTrading = true;
            this.toggleTrade();
          }
        } else if (status === CommCode.END_TURN) {
          const currentPlayer = this.gameManager.getCurrentPlayer();
          if ((currentPlayer.numNodesPlaced < 2 || currentPlayer.ownedBranches.length < 2) &&
            (currentPlayer.redResources !== 0 || currentPlayer.greenResources !== 0 ||
              currentPlayer.blueResources !== 0 || currentPlayer.yellowResources !== 0)) {
            this.snackbarService.add({ message: 'You must place a node and a branch.' });
          } else {
            this.gameManager.endTurn(this.gameManager.getCurrentPlayer());
          }
        } else if (status === CommCode.END_GAME) {
          this.gameOverText = `${this.gameManager.getCurrentPlayerEnum()} Victorious!`;
          this.winningPlayer = this.gameManager.getCurrentPlayer();
          this.gameOver = true;
        } else if (status === CommCode.UNDO) {
          const gamePiece = this.gameManager.stack.pop();
          if (gamePiece) {
            this.gameManager.undoPlacement(gamePiece[0] as string, gamePiece[1] as number, this.gameManager.getCurrentPlayer());
          } else {
            this.snackbarService.add({ message: 'No moves to undo.' });
          }
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

    if(this.storageService.fetch('mode') === "net")
    {
      this.isNetwork = true;
      this.username = this.storageService.fetch('username');
      this.oppUsername = this.storageService.fetch('oppUsername');
      if(this.storageService.fetch('isHost') === 'true')
      {
        this.networkingService.createTCPServer();
      }
      else
      {
        this.networkingService.connectTCPserver(this.storageService.fetch('oppAddress'));
      }
      this.networkingService.listen('recieve-chat-message').subscribe((message: string) => {
        console.log(message);
        this.appendMessage(`${this.oppUsername}: ${message}`);
      });
      this.networkingService.listen('opponent-disconnected').subscribe( () => {
        this.appendMessage(`${this.oppUsername} Disconnected`);
        //Grey out EndTurn Button
        this.isConnected = false;
      });
      this.networkingService.listen('opponent-reconnected').subscribe( () => {
        this.appendMessage(`${this.oppUsername} Reconnected`);
        //un-grey EndTurn Button
        this.isConnected = true;
      });
      this.networkingService.listen('disconnect').subscribe( () => {
        this.appendMessage(`${this.username} Disconnected`);
        //grey out EndTurn Button
        this.isConnected = false;
      });
      this.networkingService.listen('user-reconnected').subscribe( () => {
        this.appendMessage(`${this.username} Reconnected`);
        //un-grey out EndTurn Button
        this.isConnected = true;
      });
      this.networkingService.listen('opponent-quit').subscribe( () => {
        this.opponentQuit = true;
      });
    }
    
  }

  assemblePieceClass(piece: 'T' | 'N' | 'BX' | 'BY', id: number): string {
    let result = '';
    switch (piece) {
      case 'T':
        if (this.gameManager.getBoard().tiles[id].color === "BLANK") {
          result += `unavailable tile-${this.gameManager.getBoard().tiles[id].color}`;
        } else {
          result += `tile-${this.gameManager.getBoard().tiles[id].color}`;
        }

        if (this.gameManager.getBoard().tiles[id].capturedBy !== 'NONE') {
          result += `-capture-${this.gameManager.getBoard().tiles[id].capturedBy === 'PLAYERONE' ? 'orange' : 'purple'}`;
          break;
        }

        if (this.gameManager.getBoard().tiles[id].isExhausted && this.gameManager.getBoard().tiles[id].color !== "BLANK") {
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
          result += 'available node-blank';
        }

        break;

      case 'BX':
        if (this.gameManager.getBoard().branches[id].getOwner() !== 'NONE') {
          result += `branch-${this.gameManager.getBoard().branches[id].getOwner() === 'PLAYERONE' ? 'orange' : 'purple'}-x`;
        } else {
          result += 'available branch-blank-x';
        }

        break;
    
      case 'BY':
        if (this.gameManager.getBoard().branches[id].getOwner() !== 'NONE') {
          result += `branch-${this.gameManager.getBoard().branches[id].getOwner() === 'PLAYERONE' ? 'orange' : 'purple'}-y`;
        } else {
          result += 'available branch-blank-y';
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
          this.snackbarService.add({ message: 'You must place a branch.' });
        } else if (player.numNodesPlaced === 1 && player.ownedBranches.length === 1) {
          this.gameManager.initialNodePlacements(pieceId, player);
        } else if (player.numNodesPlaced >= 2 && player.ownedBranches.length >= 2) {
          // They have placed initial nodes, place normally
          this.gameManager.generalNodePlacement(pieceId, player);
        }
      } else if (pieceType === 'branch') {
        if (player.numNodesPlaced === 0) {
          this.snackbarService.add({message: 'You must place a node first.'});
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
    if (!this.gameManager.getCurrentPlayer().hasTraded) {
      // TODO: make a canTrade bool for the player shard
      this.tradingModel.setCurrentResources({
        red: this.gameManager.getCurrentPlayer().redResources,
        green: this.gameManager.getCurrentPlayer().greenResources,
        blue: this.gameManager.getCurrentPlayer().blueResources,
        yellow: this.gameManager.getCurrentPlayer().yellowResources
      });
    } else {
      this.isTrading = false;
    }
  }

  executeTrade(): void {
    if (!this.tradingModel.selectedResource) {
      this.snackbarService.add({ message: "Select a resource to receive." });
    } else {
      this.isTrading = false;
      this.gameManager.makeTrade(this.gameManager.getCurrentPlayer(), this.tradingModel.selectedResource, this.tradingModel.getTradeMap());
      this.tradingModel.reset();
    }
  }

  scrollToBottom(): void {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop; // TODO: find bottom variables
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      } else if (currentScroll === 0) {
        // fade to black
        console.log('fade');
      }
    })();
  }

  cancelTrading(): void {
    this.isTrading = false;
    this.tradingModel.reset();
  }

  sendMessage(): void {
    const textbox:any = document.getElementById('chat-input');
    if(textbox === null)
    {
      console.log("can't find input");
      return;
    }
      
    const message:string = textbox.value;

    if(message === "")
      return;

    if(!this.isConnected)
      return;

    textbox.value = "";
    this.networkingService.sendChatMessage(message);
    this.appendMessage(`${this.username}: ${message}`);
  }

  appendMessage(message:string): void {
    const container = document.getElementById('chat-container');
    if(container === null)
    {
      console.log("Can't find container");
      return;
    }

    const element = document.createElement('div');
    element.innerHTML = message;
    container.appendChild(element);
  }
  copyBoardSeed(): void {
    const boardSeed = this.gameManager.boardString;
    const temporarySelectBox = document.createElement('textarea');
    console.log(`Board seed: ${boardSeed}`);
    temporarySelectBox.style.position = 'fixed';
    temporarySelectBox.style.opacity = '0';
    temporarySelectBox.value = boardSeed;
    document.body.appendChild(temporarySelectBox);
    temporarySelectBox.focus();
    temporarySelectBox.select();
    document.execCommand('copy');
    document.body.removeChild(temporarySelectBox);
    this.snackbarService.add({ message: "Copied to clipboard." });
  }

  getBackground(): string {
    const selectedBackground = this.storageService.fetch('location');
    if (selectedBackground === 'bg3') {
      return selectedBackground;
    } else if (selectedBackground === 'bg2') {
      return selectedBackground;
    } else {
      return 'bg1';
    }
  }

  introEnded(): void {
    console.log('Intro video ended');
    this.gameIntro = false;
  }
  
  toggleHelp(): void {
    this.togglePaused();
    this.showHelp = !this.showHelp;
  }

  dynamicChatButton(): string {
    let btnClass = "";
    if(this.isConnected)
    {
      btnClass = "menu-btn";
    }
    else
    {
      btnClass = "menu-btn-disabled";
    }
    btnClass += " w-1/3";
    return btnClass;
  }

  playAgain(): void {
    if(this.isNetwork)
    {
      this.routerService.navigate(['/menu/new/online']);
    }
    else
    {
      this.routerService.navigate(['/menu/new/local']);
    }
  }

  exitButton(): void {
    if(this.isNetwork)
    {
      this.networkingService.leaveGame();
    }
    this.routerService.navigate(['/menu/landing']);
  }
}
