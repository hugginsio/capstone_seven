import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class NewNetworkGameHostComponent implements OnInit, OnDestroy {
  public firstPlayer: string;
  public boardSeed: string;

  private isHostFirst: boolean;
  public isWaitingForPlayer = false;
  public isSettingUpGame = true;
  public advancedOpts = true;
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
      this.routerService.navigate(['/game']);
    });
  }

  ngOnDestroy(): void {
    if(this.isWaitingForPlayer)
    {
      this.subscription.unsubscribe();
    }
  }

  changeFirstPlayer(): void {
    if (this.firstPlayer === 'Player One Goes First') {
      this.firstPlayer = this.playerTwoFirst;
      this.isHostFirst = false;
      this.storageService.update('isHostFirst', 'false');
    } else {
      this.firstPlayer = this.playerOneFirst;
      this.isHostFirst = true;
    }
  }

  startHosting(): void {
    // Set board seed before hosting begins
    this.storageService.update('isHost', 'true');
    this.storageService.update('board-seed', this.boardSeed);
    this.isWaitingForPlayer = true;
    this.isSettingUpGame = false;

    if(this.isHostFirst)
    {
      this.storageService.update('isHostFirst', 'true');
    }
    else
    {
      this.storageService.update('isHostFirst', 'false');
    }

    // host ye ol game
    // ✨ broadcastify ✨
    const source = interval(1000);
    this.subscription = source.subscribe(val => this.broadcast());
  }

  broadcast(): void {
    this.matchmakingService.broadcastGame();
  }

  cancelHosting(): void {
    this.isWaitingForPlayer = false;
    this.isSettingUpGame = true;
    this.subscription.unsubscribe();
  }

}
