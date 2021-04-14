import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { GameNetworkingService } from '../../networking/game-networking.service';
import { MatchmakingService } from '../../networking/matchmaking.service';
import { interval, Subscription } from 'rxjs';
import { ValidInputCheck } from '../valid-input-check';
import { SoundService } from '../../../shared/components/sound-controller/services/sound.service';

@Component({
  selector: 'app-new-network-game-host',
  templateUrl: './new-network-game-host.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameHostComponent implements OnInit, OnDestroy {
  private isHostFirst: boolean;
  private subscription: Subscription;
  private username: string;
  public advancedOpts = false;
  public boardSeed: string;
  public explainationPopUp: boolean;
  public firstPlayer: string;
  public isSettingUpGame = true;
  public isWaitingForPlayer = false;
  public listeners: Array<Subscription>;
  public playerOneTheme: string;
  public selectedLocation: number;
  public validInputCheck: ValidInputCheck;


  public readonly playerOneFirst = 'You Go First';
  public readonly playerThemeOne = 'Host plays as Miner';
  public readonly playerThemeTwo = 'Host plays as Machine';
  public readonly playerTwoFirst = 'Opponent Goes First';

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly networkingService: GameNetworkingService,
    private readonly routerService: Router,
    private readonly soundService: SoundService,
    private readonly storageService: LocalStorageService
  ) {
    this.listeners = new Array<Subscription>();
    this.firstPlayer = this.playerOneFirst;
    this.isHostFirst = true;
    this.validInputCheck = new ValidInputCheck(this.storageService);
    this.explainationPopUp = false;

    this.storageService.setContext('game');
    //this.storageService.store('firstPlayer', this.firstPlayer);
    this.username = this.storageService.fetch('username');
    this.playerOneTheme = this.storageService.fetch('playeronetheme');

    const storedLocation = this.storageService.fetch('location');
    if (storedLocation === 'bg3') {
      this.selectedLocation = 3;
    } else if (storedLocation === 'bg2') {
      this.selectedLocation = 2;
    } else {
      this.selectedLocation = 1;
    }
  }

  ngOnInit(): void {
    this.matchmakingService.initialize(this.username);
    this.networkingService.createTCPServer();

    this.listeners.push(this.networkingService.listen('opponent-connected').subscribe((oppUsername: string) => {
      console.log("A opponent has connected");
      this.storageService.update('oppUsername', oppUsername);
      this.isWaitingForPlayer = false;
      this.subscription.unsubscribe();
      this.soundService.clear();
      this.routerService.navigate(['/game']);
    }));
  }

  ngOnDestroy(): void {
    this.listeners.forEach(listener => listener.unsubscribe());
    if (this.isWaitingForPlayer) {
      this.subscription.unsubscribe();
      this.networkingService.cancelGame();
    }
  }

  changeFirstPlayer(): void {
    if (this.firstPlayer === 'You Go First') {
      this.firstPlayer = this.playerTwoFirst;
      this.isHostFirst = false;
    } else {
      this.firstPlayer = this.playerOneFirst;
      this.isHostFirst = true;
    }

    //this.storageService.update('firstPlayer', this.firstPlayer);
  }

  changePlayerTheme(): void {
    // Update UI
    this.playerOneTheme = this.playerOneTheme === 'miner' ? 'machine' : 'miner';

    // Update datastore
    this.playerOneTheme === 'miner' ? this.storageService.update('playeronetheme', 'miner') : this.storageService.update('playeronetheme', 'machine');
  }

  startHosting(): void {
    // Set board seed before hosting begins
    if (this.boardSeed !== undefined && this.boardSeed !== '') {
      const boardString = this.validInputCheck.checkBoardSeed(this.boardSeed);
      if (boardString !== '0') {
        this.storageService.update('board-seed', boardString);
      }
      else {
        this.boardSeed = '';
        return;
      }
    }
    else
    {
      this.storageService.update('board-seed', this.boardSeed);
    }
    this.storageService.update('isHost', 'true');
    //this.storageService.update('board-seed', this.boardSeed);
    this.isWaitingForPlayer = true;
    this.isSettingUpGame = false;

    this.networkingService.resetRoom();

    if (this.isHostFirst) {
      this.storageService.update('isHostFirst', 'true');
      this.playerOneTheme === 'miner' ? this.storageService.update('playeronetheme', 'miner') : this.storageService.update('playeronetheme', 'machine');
    }
    else {
      this.storageService.update('isHostFirst', 'false');
      this.playerOneTheme === 'miner' ? this.storageService.update('playeronetheme', 'machine') : this.storageService.update('playeronetheme', 'miner');
    }

    // host ye ol game
    // ✨ broadcastify ✨
    const source = interval(1000);
    this.subscription = source.subscribe(() => this.broadcast());
  }

  broadcast(): void {
    this.matchmakingService.broadcastGame();
  }

  cancelHosting(): void {
    this.isWaitingForPlayer = false;
    this.isSettingUpGame = true;
    this.subscription.unsubscribe();
    this.networkingService.cancelGame();
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

  explainBoardSeed(): void {
    this.explainationPopUp = true;
  }

  dynamicClass(): string {
    if (this.validInputCheck.validBoard === false && this.boardSeed === '') {
      return 'boardSeed-error';
    }
    this.validInputCheck.validBoard = true;
    return '';
  }
}
