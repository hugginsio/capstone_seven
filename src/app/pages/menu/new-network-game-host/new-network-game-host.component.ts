import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { GameNetworkingService } from '../../networking/game-networking.service';

@Component({
  selector: 'app-new-network-game-host',
  templateUrl: './new-network-game-host.component.html',
  styleUrls: ['../menu-common.scss']
})
export class NewNetworkGameHostComponent {
  public firstPlayer: string;
  public boardSeed: string;

  private isWaitingForPlayer = false;
  private isSettingUpGame = true;

  public readonly playerOneFirst = 'Player One Goes First';
  public readonly playerTwoFirst = 'Player Two Goes First';
  
  constructor(
    private readonly storageService: LocalStorageService,
    private readonly routerService: Router,
    private readonly networkingService: GameNetworkingService
  ) {
    this.firstPlayer = this.playerOneFirst;

    this.storageService.setContext('network');
    this.storageService.store('firstPlayer', this.firstPlayer);
  }

  changeFirstPlayer(): void {
    if (this.firstPlayer === 'Player One Goes First') {
      this.firstPlayer = this.playerTwoFirst;
    } else {
      this.firstPlayer = this.playerOneFirst;
    }

    this.storageService.update('firstPlayer', this.firstPlayer);
  }

  startHosting(): void {
    // Set board seed before hosting begins
    this.storageService.update('board-seed', this.boardSeed);
    this.isWaitingForPlayer = true;
    this.isSettingUpGame = false;

    // host ye ol game
    // ✨ broadcastify ✨
  }

}
