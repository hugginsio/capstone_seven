import { AfterViewInit, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { LocalStorageService } from '../../shared/services/local-storage/local-storage.service';
import { Player } from './classes/gamecore/game.class.Player';
import { CommCode } from './interfaces/game.enum';
import { ClickEvent, CommPackage } from './interfaces/game.interface';
import { ManagerService } from './services/gamecore/manager.service';
import { TradingModel } from './models/trading.model';
import { SnackbarService } from '../../shared/components/snackbar/services/snackbar.service';
import { SoundService } from '../../shared/components/sound-controller/services/sound.service';
import { SoundEndAction, SoundType } from '../../shared/components/sound-controller/interfaces/sound-controller.interface';
import { GuidedTutorialService } from './services/guided-tutorial/guided-tutorial.service';
import { GameNetworkingService } from '../networking/game-networking.service';
import { Router } from '@angular/router';
import { PlayerTheme, PlayerType } from './enums/game.enums';
import { GameType } from './enums/game.enums';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  public currentTrack: string;
  public gameIntro: boolean;
  public gameOver: boolean;
  public gameOverText: string;
  public gamePaused: boolean;
  public guidedTutorialCheck: boolean;
  public isConnected: boolean;
  public isMuted: boolean;
  public isNetwork: boolean;
  public isTrading: boolean;
  public isTutorial: boolean;
  public listeners: Array<Subscription>;
  public musicVolume: string;
  public oppUsername: string;
  public opponentQuit: boolean;
  public showHelp: boolean;
  public showMusicControls: boolean;
  public tradingModel: TradingModel;
  public username: string;
  public winningPlayer: Player;

  public readonly commLink = new Subject<CommPackage>();

  constructor(
    public readonly gameManager: ManagerService,
    public guidedTutorial: GuidedTutorialService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService,
    private readonly soundService: SoundService,
    private readonly networkingService: GameNetworkingService,
    private readonly routerService: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    // Set defaults for UI triggers
    //this.guidedTutorial = new GuidedTutorialComponent(document, gameManager, storageService, snackbarService);
    this.currentTrack = "";
    this.gameIntro = false;
    this.gameOver = false;
    this.gameOverText = "Victory!";
    this.gamePaused = true;
    this.guidedTutorialCheck = false;
    this.isConnected = true;
    this.isMuted = false;
    this.isNetwork = false;
    this.isTrading = false;
    this.isTutorial = false;
    this.listeners = new Array<Subscription>();
    this.musicVolume = '0';
    this.opponentQuit = false;
    this.showMusicControls = false;
    this.tradingModel = new TradingModel(this.storageService, this.guidedTutorial);

    this.storageService.setContext('game');
  }

  ngOnInit(): void {
    // ✨ ANIMATIONS ✨
    // this.scrollToBottom();

    this.gameManager.Initialize();

    if (this.storageService.fetch('guided-tutorial') === 'true'
      && this.storageService.fetch('mode') === 'pva') {
      // chatbox bool
      this.isTutorial = true;
      // my bool
      this.guidedTutorialCheck = true;
      this.guidedTutorial.setTutorialBoard();
      this.guidedTutorial.resetStepAndMoveNum();
    }

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
            if (this.guidedTutorialCheck) {
              if (this.guidedTutorial.moveManager("tradeBtn")) {
                this.isTrading = true;
                this.toggleTrade();
              }
            }
            else {
              this.isTrading = true;
              this.toggleTrade();
            }
          }
        } else if (status === CommCode.END_TURN) {
          const currentPlayer = this.gameManager.getCurrentPlayer();
          if ((currentPlayer.numNodesPlaced < 2 || currentPlayer.ownedBranches.length < 2) &&
            (currentPlayer.redResources !== 0 || currentPlayer.greenResources !== 0 ||
              currentPlayer.blueResources !== 0 || currentPlayer.yellowResources !== 0)) {
            this.snackbarService.add({ message: 'You must place a node and a branch.' });
          } else {
            // if guided tutorial, check if they are supposed to end their turn
            if (this.guidedTutorialCheck) {
              if (this.guidedTutorial.moveManager("endTurnBtn")) {

                this.gameManager.endTurn(this.gameManager.getCurrentPlayer());
                //this.clearMessage();
                //this.appendMessage(this.guidedTutorial.tutorialManager());
              }
            }
            else {
              this.gameManager.endTurn(this.gameManager.getCurrentPlayer());
            }
          }
        } else if (status === CommCode.END_GAME) {
          this.gameOverText = `${this.gameManager.getCurrentPlayerEnum()} Victorious!`;
          this.winningPlayer = this.gameManager.getCurrentPlayer();
          this.gameOver = true;
        } else if (status === CommCode.UNDO) {
          const gamePiece = this.gameManager.stack.pop();
          if (gamePiece) {
            if (this.guidedTutorialCheck) {
              if (this.guidedTutorial.moveManager("undoBtn")) {
                this.gameManager.undoPlacement(gamePiece[0] as string, gamePiece[1] as number, this.gameManager.getCurrentPlayer());
                this.guidedTutorial.highlightManager();
              }
            }
            else {
              this.gameManager.undoPlacement(gamePiece[0] as string, gamePiece[1] as number, this.gameManager.getCurrentPlayer());
            }
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
      else if (status === CommCode.AI_Move && player) {
        this.changeDetector.detectChanges();
      }
    });

    // Music initialization
    const backgroundString = this.getBackground();
    if (backgroundString === 'bg1') {
      this.soundService.add('/assets/sound/focus.mp3', SoundEndAction.LOOP, SoundType.MUSIC);
      this.currentTrack = 'bg1';
    } else if (backgroundString === 'bg2') {
      this.soundService.add('/assets/sound/focus.mp3', SoundEndAction.LOOP, SoundType.MUSIC);
      this.currentTrack = 'bg2';
    } else if (backgroundString === 'bg3') {
      this.soundService.add('/assets/sound/focus.mp3', SoundEndAction.LOOP, SoundType.MUSIC);
      this.currentTrack = 'bg3';
    }

    if (this.storageService.fetch('mode') === "net") {
      this.isNetwork = true;
      this.username = this.storageService.fetch('username');
      this.oppUsername = this.storageService.fetch('oppUsername');
      if (this.storageService.fetch('isHost') === 'true') {
        this.networkingService.createTCPServer();
      }
      else {
        this.networkingService.connectTCPserver(this.storageService.fetch('oppAddress'));
      }

      this.listeners.push(this.networkingService.listen('recieve-chat-message').subscribe((message: string) => {
        console.log(message);
        this.appendMessage(`${this.oppUsername}: ${message}`);
      }));

      this.listeners.push(this.networkingService.listen('disconnect').subscribe(() => {
        this.appendMessage(`Disconnection... Please Wait`);
        //grey out EndTurn Button
        this.isConnected = false;
      }));

      this.listeners.push(this.networkingService.listen('user-reconnected').subscribe(() => {
        this.appendMessage(`Reconnected`);
        //un-grey out EndTurn Button
        this.isConnected = true;
      }));

      this.listeners.push(this.networkingService.listenReconnect().subscribe(() => {
        this.appendMessage(`Reconnected`);
        this.networkingService.notifyReconnect();
        //un-grey out EndTurn Button
        this.isConnected = true;
      }));

      this.listeners.push(this.networkingService.listen('user-disconnected').subscribe(() => {
        this.appendMessage(`Disconnection... Please Wait`);
        //grey out EndTurn Button
        this.isConnected = false;
      }));

      this.listeners.push(this.networkingService.listen('opponent-quit').subscribe(() => {
        this.opponentQuit = true;
      }));
    }
  }

  ngOnDestroy(): void {
    this.soundService.clear();
    this.listeners.forEach(listener => listener.unsubscribe());
    this.gameManager.unsubListeners();
  }

  ngAfterViewInit(): void {
    if (this.storageService.fetch('guided-tutorial') === 'true') {
      const message = this.guidedTutorial.startTutorial();
      this.appendMessage(message);
      // why is this not showing up?
      //this.snackbarService.add({ message: 'Click the "Next" button to start the tutorial.'});
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
          const tileOwner = this.gameManager.getBoard().tiles[id].capturedBy;
          const tilePlayer = tileOwner === 'PLAYERONE' ? this.gameManager.getPlayerOne() : this.gameManager.getPlayerTwo();
          
          result += `-captured-${tileOwner === 'PLAYERONE' ? 'orange-' : 'purple-'}`;
          result += tilePlayer.theme === PlayerTheme.MINER ? 'miner' : 'machine';

          if (this.gameManager.getBoard().tiles[id].maxNodes !== 0) {
            result += `-${this.gameManager.getBoard().tiles[id].maxNodes.toString()}`;
          }

          break;
        }

        if (this.gameManager.getBoard().tiles[id].isExhausted && this.gameManager.getBoard().tiles[id].color !== "BLANK") {
          result += '-exhausted';
          if (this.gameManager.getBoard().tiles[id].maxNodes !== 0) {
            result += `-${this.gameManager.getBoard().tiles[id].maxNodes.toString()}`;
          }

          break;
        }

        if (this.gameManager.getBoard().tiles[id].maxNodes !== 0) {
          result += `-${this.gameManager.getBoard().tiles[id].maxNodes.toString()}`;
        }

        break;

      case 'N':
        if (this.gameManager.getBoard().nodes[id].getOwner() !== 'NONE') {
          const nodeOwner = this.gameManager.getBoard().nodes[id].getOwner();
          const nodePlayer = nodeOwner === 'PLAYERONE' ? this.gameManager.getPlayerOne() : this.gameManager.getPlayerTwo();

          result += 'node-';
          result += nodeOwner === 'PLAYERONE' ? 'orange-' : 'purple-';
          result += nodePlayer.theme === PlayerTheme.MINER ? 'miner' : 'machine';
        } else {
          result += 'available node-blank';
        }

        break;

      case 'BX':
        if (this.gameManager.getBoard().branches[id].getOwner() !== 'NONE') {
          const branchOwner = this.gameManager.getBoard().branches[id].getOwner();
          const branchPlayer = branchOwner === 'PLAYERONE' ? this.gameManager.getPlayerOne() : this.gameManager.getPlayerTwo();

          result += 'branch-';
          result += `${this.gameManager.getBoard().branches[id].getOwner() === 'PLAYERONE' ? 'orange' : 'purple'}-x-`;
          result += `${branchPlayer.theme === PlayerTheme.MINER ? 'miner' : 'machine'}`;
        } else {
          result += 'available branch-blank-x';
        }

        break;

      case 'BY':
        if (this.gameManager.getBoard().branches[id].getOwner() !== 'NONE') {
          const branchOwner = this.gameManager.getBoard().branches[id].getOwner();
          const branchPlayer = branchOwner === 'PLAYERONE' ? this.gameManager.getPlayerOne() : this.gameManager.getPlayerTwo();

          result += 'branch-';
          result += `${this.gameManager.getBoard().branches[id].getOwner() === 'PLAYERONE' ? 'orange' : 'purple'}-y-`;
          result += `${branchPlayer.theme === PlayerTheme.MINER ? 'miner' : 'machine'}`;
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

    if (this.guidedTutorialCheck === true) {
      const currentMove = event.target.id;
      // if it it not the anticipated guided tutorial move, return from the function
      if (!this.guidedTutorial.moveManager(currentMove)) {
        return;
      }
    }

    if (player.type !== PlayerType.HUMAN) {
      return;
    }

    if (pieceClass.indexOf('unavailable') !== -1) {
      console.warn(`Clicked ${pieceType} ${pieceId}, but piece is unavailable.`);
    } else if (pieceClass.indexOf('available') !== -1) {
      console.log(`Clicked available ${pieceType} ${pieceId}.`);
      if (pieceType === 'node') {
        if (player.numNodesPlaced === 0) {
          this.gameManager.initialNodePlacements(pieceId, player);
          this.playerClickSound('node');
        } else if (player.numNodesPlaced === 1 && player.ownedBranches?.length !== 1) {
          this.snackbarService.add({ message: 'You must place a branch.' });
        } else if (player.numNodesPlaced === 1 && player.ownedBranches.length === 1) {
          this.gameManager.initialNodePlacements(pieceId, player);
          this.playerClickSound('node');
        } else if (player.numNodesPlaced >= 2 && player.ownedBranches.length >= 2) {
          // They have placed initial nodes, place normally
          if (this.gameManager.getCurrentPlayer().greenResources >= 2 && this.gameManager.getCurrentPlayer().yellowResources >= 2) {
            this.playerClickSound('node');
          }

          this.gameManager.generalNodePlacement(pieceId, player);
        }
      } else if (pieceType === 'branch') {
        if (player.numNodesPlaced === 0) {
          this.snackbarService.add({ message: 'You must place a node first.' });
        } else if (player.numNodesPlaced === 1 && player.ownedBranches?.length === 0) {
          let relatedNode = -1;
          this.gameManager.getBoard().nodes.forEach(el => {
            if (el.getOwner() === this.gameManager.getCurrentPlayerEnum()) {
              relatedNode = this.gameManager.getBoard().nodes.indexOf(el);
            }
          });

          this.gameManager.initialBranchPlacements(relatedNode, pieceId, player);
          this.playerClickSound('branch');
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
          this.playerClickSound('branch');
        } else if (player.numNodesPlaced >= 2 && player.ownedBranches.length >= 2) {
          // They have placed their initial branches, place normally
          if (this.gameManager.getCurrentPlayer().redResources >= 1 && this.gameManager.getCurrentPlayer().blueResources >= 1) {
            this.playerClickSound('branch');
          }

          this.gameManager.generalBranchPlacement(pieceId, player);
        }
      }
    } else {
      console.warn(`Click event on ${pieceType} ${pieceId} failed. This may be due to constraints detected by the game manager.`);
      console.warn('Piece class data:', event.target.className);
    }

    // console.warn(this.gameManager.getBoard());
  }

  playerClickSound(type: 'node' | 'branch'): void {
    const playerTheme = this.gameManager.getCurrentPlayer().theme;
    let fxId = 'pickaxe';

    if (playerTheme === PlayerTheme.MINER && type === 'node') {
      fxId = 'pickaxe';
    } else if (playerTheme === PlayerTheme.MINER && type === 'branch') {
      fxId = 'minetrack';
    } else if (playerTheme === PlayerTheme.MACHINE && type === 'node') {
      fxId = 'drill';
    } else if (playerTheme === PlayerTheme.MACHINE && type === 'branch') {
      fxId = 'tank';
    }

    this.soundService.add(`/assets/sound/fx/${fxId}.wav`, SoundEndAction.DIE);
  }

  togglePaused(): void {
    // Normally would do this in-template but we might need to put more functionality in later.
    this.gamePaused = !this.gamePaused;
  }

  toggleMusicControls(): void {
    this.togglePaused();
    this.showMusicControls = !this.showMusicControls;
  }

  toggleMusic(): void {
    this.storageService.setContext('sound');
    if (!this.isMuted) {
      this.musicVolume = this.storageService.fetch('musicvolume');
      this.storageService.update('musicvolume', '0');
      this.soundService.update();
      this.isMuted = !this.isMuted;
    } else {
      this.storageService.update('musicvolume', this.musicVolume.toString());
      this.soundService.update();
      this.isMuted = !this.isMuted;
    }

    this.storageService.setContext('game');
  }

  musicNext(): void {
    switch (this.currentTrack) {
      case 'bg1':
        console.log('bg2');
        this.currentTrack = 'bg2';
        break;
      case 'bg2':
        console.log('bg3');
        this.currentTrack = 'bg3';
        break;
      case 'bg3':
        console.log('bg1');
        this.currentTrack = 'bg1';
        break;
    
      default:
        console.log('bg1');
        this.currentTrack = 'bg1';
        break;
    }
  }

  musicPrev(): void {
    switch (this.currentTrack) {
      case 'bg1':
        console.log('bg3');
        this.currentTrack = 'bg3';
        break;
      case 'bg2':
        console.log('bg1');
        this.currentTrack = 'bg1';
        break;
      case 'bg3':
        console.log('bg2');
        this.currentTrack = 'bg2';
        break;

      default:
        console.log('bg1');
        this.currentTrack = 'bg1';
        break;
    }
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
    if (this.tradingModel.redResources + this.tradingModel.blueResources + this.tradingModel.greenResources + this.tradingModel.yellowResources !== 3) {
      this.snackbarService.add({ message: "Select three resources to trade away." });
    }
    else if (this.tradingModel.selectedResource === 0) {
      this.snackbarService.add({ message: "Select a resource to receive." });
    }
    else if (this.isTutorial) {
      if (!this.guidedTutorial.moveManager('confirmTrade')) {
        return;
      }
      else {
        this.isTrading = false;
        this.gameManager.makeTrade(this.gameManager.getCurrentPlayer(), this.tradingModel.selectedResource, this.tradingModel.getTradeMap());
        this.tradingModel.reset();
      }
    }
    else {
      this.isTrading = false;
      this.gameManager.makeTrade(this.gameManager.getCurrentPlayer(), this.tradingModel.selectedResource, this.tradingModel.getTradeMap());
      this.tradingModel.reset();
    }
  }

  cancelTrading(): void {
    if (this.guidedTutorialCheck) {
      return;
    }
    this.isTrading = false;
    this.tradingModel.reset();
  }

  sendMessage(): void {
    const textbox: any = document.getElementById('chat-input');
    if (textbox === null) {
      console.log("can't find input");
      return;
    }

    const message: string = textbox.value;

    if (message === "")
      return;

    if (!this.isConnected)
      return;

    textbox.value = "";
    this.networkingService.sendChatMessage(message);
    this.appendMessage(`${this.username}: ${message}`);
  }

  appendMessage(message: string): void {
    const container = document.getElementById('chat-container');
    if (container === null) {
      console.log("Can't find container");
      return;
    }

    const element = document.createElement('div');
    element.innerHTML = message;
    container.appendChild(element);
    if (this.isTutorial) {
      container.scrollTop = 0;
    }
    else if (this.isNetwork) {
      container.scrollTop = container.scrollHeight;
    }

  }

  clearMessage(): void {
    const container = document.getElementById('chat-container');
    if (container === null) {
      console.log("Can't find container");
      return;
    }

    container.textContent = '';
  }

  GTBtn(event: ClickEvent): void {
    const button = event.target.id;
    const step = this.guidedTutorial.getstepNum();
    let message = "";

    if (button === 'GT-Back' && step > 1) {
      this.clearMessage();
      this, this.guidedTutorial.falseFreezeNext();
      this.guidedTutorial.decrementStepNum();
      message = this.guidedTutorial.tutorialManager();
      this.appendMessage(message);

    }
    // how many steps we have
    // variable depending on who goes first???
    else if (button === 'GT-Next' && step < this.guidedTutorial.getMaxStep() && this.guidedTutorial.getFreezeNext() === false) {
      this.guidedTutorial.unhighlightNext();
      this.clearMessage();
      this.guidedTutorial.incrementStepNum();
      message = this.guidedTutorial.tutorialManager();
      this.appendMessage(message);

    }
    if (this.guidedTutorial.getstepNum() === this.guidedTutorial.getMaxStep()) {
      this.endTutorial();
    }
  }

  endTutorial(): void {
    this.guidedTutorialCheck = false;
    this.isTutorial = false;
    this.storageService.update("guided-tutorial", "false");
    //this.tradingModel.isTutorial = false;
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
    if (this.isConnected) {
      btnClass = "menu-btn";
    }
    else {
      btnClass = "menu-btn-disabled";
    }
    btnClass += " w-1/3";
    return btnClass;
  }

  dynamicGTBox(): string {
    if (this.isTutorial && this.isTrading) {
      return 'z-inf';
    }

    return '';
  }

  playAgain(): void {
    if (this.isNetwork) {
      this.routerService.navigate(['/menu/new/online']);
    }
    else {
      this.routerService.navigate(['/menu/new/local']);
    }
  }

  getBranchSrc(): string {
    let asset = "/assets/game/branches/Horizontal-Track-";
    if (this.gameManager.getCurrentGameMode() === GameType.HUMAN) {
      if (this.gameManager.getCurrentPlayerEnum() === 'PLAYERONE') {
        asset += "Orange-Miner.png";
      }
      else {
        asset += "Purple-Miner.png";
      }
    }
    else {
      if (this.gameManager.getPlayerOne().type === PlayerType.HUMAN) {
        asset += "Orange-Miner.png";
      }
      else {
        asset += "Purple-Miner.png";
      }
    }
    return asset;
  }

  getNodeSrc(): string {
    let asset = "/assets/game/nodes/";
    if (this.gameManager.getCurrentGameMode() === GameType.HUMAN) {
      if (this.gameManager.getCurrentPlayerEnum() === 'PLAYERONE') {
        asset += "Orange-Node-Pickaxe.png";
      }
      else {
        asset += "Purple-Node-Pickaxe.png";
      }
    }
    else {
      if (this.gameManager.getPlayerOne().type === PlayerType.HUMAN) {
        asset += "Orange-Node-Pickaxe.png";
      }
      else {
        asset += "Purple-Node-Pickaxe.png";
      }
    }
    return asset;
  }

  exitButton(): void {
    if (this.isNetwork) {
      this.networkingService.leaveGame();
    }
    this.routerService.navigate(['/menu/landing']);
  }

  getCanTrade(): boolean {
    if (this.gameManager.getCurrentPlayer().numNodesPlaced < 2 ||
      this.gameManager.getCurrentPlayer().ownedBranches.length < 2) {
      return false;
    }
    else if ((this.gameManager.getCurrentPlayer().blueResources
      + this.gameManager.getCurrentPlayer().redResources
      + this.gameManager.getCurrentPlayer().yellowResources
      + this.gameManager.getCurrentPlayer().greenResources) < 3) {
      return false;
    }
    else if (this.gameManager.getCurrentPlayer().hasTraded) {
      return false;
    }
    else {
      return true;
    }
  }
}
