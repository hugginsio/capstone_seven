import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { Player } from '../classes/gamecore/game.class.Player';
import { CommCode } from '../interfaces/game.enum';
import { ClickEvent, CommPackage } from '../interfaces/game.interface';
import { ManagerService } from '../services/gamecore/manager.service';
import { TradingModel } from '../models/trading.model';
import { SnackbarService } from '../../../shared/components/snackbar/services/snackbar.service';

@Component({
  selector: 'app-guided-tutorial',
  templateUrl: './guided-tutorial.component.html',
  styleUrls: ['./guided-tutorial.component.scss']
})
export class GuidedTutorialComponent implements OnInit {

  public readonly commLink = new Subject<CommPackage>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService
  ){ 
    this.storageService.setContext('game');
  }

  ngOnInit(): void {
    // Subscribe to own communications link
    this.commLink.subscribe(message => {
      const status = message.code;

      // Check which player sent the message before we run player-centric commands
      /*if (this.gameManager.getCurrentPlayer() === message.player) {
        if (status === CommCode.IS_TRADING) {
          const currentPlayer = this.gameManager.getCurrentPlayer();
          if (currentPlayer.numNodesPlaced < 2 || currentPlayer.ownedBranches.length < 2) {*/
            this.snackbarService.add({ message: 'You cannot trade right now.' });
          /*} else {
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
      }*/
    });
  }

}
