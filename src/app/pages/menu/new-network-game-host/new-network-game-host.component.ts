import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { GameNetworkingService } from '../../networking/game-networking.service';
import { MatchmakingService } from '../../networking/matchmaking.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-new-network-game-host',
  templateUrl: './new-network-game-host.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameHostComponent implements OnInit {
  public firstPlayer: string;
  public boardSeed: string;

  private isHostFirst: boolean;
  private isWaitingForPlayer = false;
  private isSettingUpGame = true;
  private readonly username: string = "Client McGee";
  private subscription: Subscription;

  public readonly playerOneFirst = 'Player One Goes First';
  public readonly playerTwoFirst = 'Player Two Goes First';
  
  constructor(
    private readonly storageService: LocalStorageService,
    private readonly routerService: Router,
    private readonly networkingService: GameNetworkingService,
    private readonly matchmakingService: MatchmakingService
  ) {
    this.firstPlayer = this.playerOneFirst;
    this.isHostFirst = true;

    this.storageService.setContext('game');
    this.storageService.store('firstPlayer', this.firstPlayer);
  }

  ngOnInit(): void {
    this.matchmakingService.initialize(this.username);
    this.networkingService.createTCPServer();

    this.networkingService.listen('opponent-connected').subscribe(() => {
      console.log("A opponent has connected");
      this.isWaitingForPlayer = false;
      this.subscription.unsubscribe();
      //FOR TESTING: CALL IN GAME CORE ONCE BOARD IS MADE
      //this.networkingService.setGame({board : this.boardSeed, background: "BG1", isHostFirst: this.isHostFirst});
      this.routerService.navigate(['/game']);
    });
  }

  changeFirstPlayer(): void {
    if (this.firstPlayer === 'Player One Goes First') {
      this.firstPlayer = this.playerTwoFirst;
      this.isHostFirst = false;
    } else {
      this.firstPlayer = this.playerOneFirst;
      this.isHostFirst = true;
    }

    this.storageService.update('isHostFirst', this.firstPlayer);
  }

  startHosting(): void {
    // Set board seed before hosting begins
    this.storageService.update('isHost', 'true');
    this.storageService.update('board-seed', this.boardSeed);
    this.isWaitingForPlayer = true;
    this.isSettingUpGame = false;

    // host ye ol game
    // ✨ broadcastify ✨
    const source = interval(1000);
    this.subscription = source.subscribe(val => this.broadcast());
  }

  broadcast(): void {
    this.matchmakingService.broadcastGame();
  }

}
