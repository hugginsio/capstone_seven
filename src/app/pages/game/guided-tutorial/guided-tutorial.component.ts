import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalStorageService } from '../../../shared/services/local-storage/local-storage.service';
import { Player } from '../classes/gamecore/game.class.Player';
//import { GuidedTutorialInterface } from '../interfaces/game.enum';
import { ClickEvent, GuidedTutorialInterface } from '../interfaces/game.interface';
import { ManagerService } from '../services/gamecore/manager.service';
import { TradingModel } from '../models/trading.model';
import { SnackbarService } from '../../../shared/components/snackbar/services/snackbar.service';

@Component({
  selector: 'app-guided-tutorial',
  templateUrl: './guided-tutorial.component.html',
  styleUrls: ['./guided-tutorial.component.scss']
})
export class GuidedTutorialComponent implements OnInit {

  public readonly GT = new Subject<GuidedTutorialInterface>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService
  ){ 
    this.storageService.setContext('game');
  }

  ngOnInit(): void {

    if(this.storageService.fetch('guided-tutorial') === 'true' 
      && this.storageService.fetch('mode') === 'pva'
      && this.storageService.fetch('ai-difficulty') === 'easy') {

      // Subscribe to own communications link
      //this.GT.subscribe(message => {
        //const status = message.message;

        // human is player1
        if(this.storageService.fetch('firstplayer') === 'one') {
          // message 1, start tutorial
          this.snackbarService.add({ message: 'Welcome in to the mines!' });
          this.snackbarService.add({ message: 'Let’s walk you through a few steps to get y’all on the right foot with this here duel in the mines.' });
          // click next

          // message 2
          //this.snackbarService.add({ message: 'Learn some mining lingo before we get going: Pickaxes and Drills are what we call "Mining Markers"' });
          //this.snackbarService.add({ message: 'Tracks get you from place to place, and these here squares here are mining sites.' });
          //this.snackbarService.add({ message: 'These sites have gems in ‘em that hold the type and number of gem you can mine from there.' });
          // click next

          // message 3
          //this.snackbarService.add({ message: 'Start the competition by puttin\' down a pickaxe and a connectin\' track anywhere in the mine'});
          this.snackbarService.add({ message: 'Click the indicated marker and track to make your move' });
          // moves after pieces have been clicked

          // message 4
         // this.snackbarService.add({ message: 'You get gems based on the corners of the minin\' sites you have your pickaxe touchin\'' });
          //this.snackbarService.add({ message: 'You gotta have gems in the future to get more pickaxes and tracks down the road' });
          //this.snackbarService.add({ message: 'Don\'t like where you clicked? Click the "Undo" button' });
          //this.snackbarService.add({ message: 'Settled on your move? Click the "End Turn" button to keep the game movin\'' });
          // moves when "End Turn" is clicked


        }
        //this.snackbarService.add({ message: 'You cannot trade right now.' });


      // Check which player sent the message before we run player-centric commands
      /*if (this.gameManager.getCurrentPlayer() === message.player) {
        if (status === CommCode.IS_TRADING) {
          const currentPlayer = this.gameManager.getCurrentPlayer();
          if (currentPlayer.numNodesPlaced < 2 || currentPlayer.ownedBranches.length < 2) {
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
    //});

    }

    this.snackbarService.add({ message: 'Click the indicated marker and track to make your move' });
    
  }



}
