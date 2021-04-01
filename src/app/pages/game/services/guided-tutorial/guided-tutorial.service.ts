import { Injectable } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SnackbarService } from '../../../../shared/components/snackbar/services/snackbar.service';
import { ManagerService } from './../../services/gamecore/manager.service';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';
import { preserveWhitespacesDefault } from '@angular/compiler';
//import { Message } from '@angular/compiler/src/i18n/i18n_ast';
//import { GameComponent } from '../../game.component';



@Injectable({
  providedIn: 'root'
})
export class GuidedTutorialService {

  // could be 1 instead of one 
  private humanPlayer: string;
  private stepNum: number;
  private moveNum: number;
  private freezeNext: boolean;
  private maxMove: number;
  private maxStep: number;

  constructor(
    public readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService,
    //private readonly gameComp: GameComponent
  ) { 
    this.humanPlayer = this.storageService.fetch('firstplayer');
    this.stepNum = 1;
    this.moveNum = 1;
    this.freezeNext = false;
    if (this.humanPlayer === '1') {
      this.maxMove = 18;
    }
    else {
      this.maxMove = 22;
    }
  }

  getstepNum():number {
    return this.stepNum;
  }
  incrementStepNum():void {
    this.stepNum++;
  }
  decrementStepNum():void {
    this.stepNum--;
  }

  getMoveNum():number {
    return this.moveNum;
  }
  incrementMoveNum():void {
    this.moveNum++;
  }
  decrementMoveNumForUndoOnly():void {
    this.moveNum--;
  }

  getFreezeNext():boolean{
    return this.freezeNext;
  }
  falseFreezeNext():void {
    this.freezeNext = false;
  }

  setTutorialBoard():void {
    this.gameManager.createBoard(false, "R2,Y2,B3,G3,G2,00,G1,Y3,R1,B2,Y1,R3,B1");
  }

  startTutorial():string {
    let message = this.messageOne();
    return message;
  }

  tutorialManager():string{
    let message = "no message found";
    switch (this.stepNum)
    {
      case 1:
        message = this.messageOne();
        break;
      case 2:
        message = this.messageTwo();
        break;
      case 3:
        message = this.messageThree();
        break;
      case 4:
        message = this.messageFour();
        break;
      case 5: 
        message = this.messageFive();
        break;
      default:
        console.log('something went wrong, tutorialManager switch');
    }

    return message;
  }

  // learn how to actually highlight one haha 
  highlightManager():void {
    const m = this.moveNum;
    let piece = "no selected piece";
    // maybe just assign the piece as a string then send to a "highlight" function?? 
    // just change the piece to have a boarder then remove the boarder when it is 
    // a correct placement in moveManager
    if(this.humanPlayer === '1'){
      switch(m){
        case 1: piece = "N9";
          break;
        case 2: piece = "B13"
          break;
        case 3: // END TURN - no highlight
          break;
        case 4: piece = "N8"
          break;
        case 5: piece = "N12"
          break;
        case 6: // UNDO - no highlight
          break;
        case 7: // UNDO - no highlight
          break;
        case 8: piece = "N16"
          break;
        case 9: piece = "B19"
          break;
        case 10: // END TURN - no highlight
          break;
        case 11: piece = "B8"
          break;
        case 12: // END TURN - no highlight
          break;
        case 13: piece = "N4"
          break;
        case 14: piece = "B4"
          break;
        case 15: // TRADE
          break;
        case 16: // VERIFY TRADE ------- ?????
          break;
        case 17: piece = "B3"
          break;
        case 18: // END TURN 
          break;
        default:
          console.log("highlightManager error");
      }
    }
    else {
      switch(m){
        case 1: // highlight this piece - N15
          break;
        case 2: // highlight this piece - B28
          break;
        case 3: // END TURN
          break;
        case 4: // N8
          break;
        case 5: // N12
          break;
        case 6: // UNDO
          break;
        case 7: // UNDO
          break;
        case 8: // N3
          break;
        case 9: // B7
          break;
        case 10: // END TURN
          break;
        case 11: // B18
          break;
        case 12: // TRADE
          break;
        case 13: // HOW TO VERIFY A TRADE ???? could be one click for each or verifying the whole trade
          break;
        case 14: // B17
          break;
        case 15: // END TURN
          break;
        case 16: // B31
          break;
        case 17: // TRADE
          break;
        case 18: // HOW TO VERIFY A TRADE ???? 
          break;
        case 19: // B12
          break;
        case 20: // END TURN
          break;
        case 21: // B27
          break;
        case 22: // END TURN
          break;
        default:
          console.log("highlightManager error");
    }
    
  }
      // change border and change back after move has been made
      if(piece !== "no selected piece") {
        let pieceID = document.getElementById(piece);
        if (pieceID !== null)
        {
          pieceID.style.border = "2px solid white";
        }
      }
      
}

  // whenever need to have a next button, unfreeze next
  moveManager(piece: string):boolean {
    const m = this.moveNum;
    const s = this.stepNum;
    let validMove = true; 

    if (this.humanPlayer === '1'){
      if(m === 1 && s === 3 && piece ==='N9') {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 2 && s === 3 && piece === 'B13'){
        this.moveNum++;
        // call to output message 4 
        this.stepNum++;
        this.tutorialManager();
      }
      else if(m === 3 && s === 4 && piece === 'ENDTURN'){
        // end turn
        this.freezeNext = false;
        this.moveNum++;
      }
      else {
        this.snackbarService.add({ message: 'Now don\'t be clickin\' just anywhere! Please follow these here instructions.' });
        validMove = false;
      }
    }
    else if (this.humanPlayer === '2'){
      // place all moves for when the human is player 2
      if(m === 1 && piece ==='') {
        // place node
        // call in game manager
        this.moveNum++;
      }
      else if(m === 2 && piece === ''){
        // place branch
        // call in game manager
        this.moveNum++;
      }
      else if(m === 3 && piece === ''){
        // end move
        this.moveNum++;
      }
      else {this.snackbarService.add({ message:'Now don\'t be clickin\' just anywhere! Please follow these here instructions.'});
        validMove = false;
      }
    }

    // unhighlight if needed
    if(validMove){
      let pieceID = document.getElementById(piece);
      if(pieceID !== null) {
        pieceID.style.border = "0px";
      }
    }
    return validMove;
  }

  messageOne():string{
    let message = "Welcome in to the mines! <br><br> Let’s walk you through a few steps to get y’all on the right foot with this here underground duel.<br><br>Click the \"Next\" button to start the tutorial.";
      // message 1, start tutorial
      //this.snackbarService.add({ message: 'Welcome in to the mines!' });
      //this.snackbarService.add({ message: 'Let’s walk you through a few steps to get y’all on the right foot with this here underground duel.' });
    //this.snackbarService.add({ message: 'Click the "Next" button to start the tutorial.'});
      return message;

      // click next
  }

  messageTwo():string {
    // message 2
    let message = "Learn some mining lingo before we get going:<br><br>Pickaxes and Drills are what we call \"Mining Markers\"<br><br>Tracks get you from place to place, and these here squares here all abouts the mine are mining sites.<br><br>These sites have gems in ‘em that hold the type and number of gem you can mine from there.";

    //this.snackbarService.add({ message: 'Learn some mining lingo before we get going' });
    //this.snackbarService.add({ message: 'Tracks get you from place to place, and these here squares here all abouts the mine are mining sites.' });
    //this.snackbarService.add({ message: 'These sites have gems in ‘em that hold the type and number of gem you can mine from there.' });

    return message;

    // click next
  }

  messageThree():string {
    let message = '';
    if(this.humanPlayer === '1') {
      // message 3
      message = 'Start the competition by puttin\' down a pickaxe and a connectin\' track anywhere in the mine<br><br>Click the indicated marker and track to make your move.';
      // if we want to have the action items as pop ups in the snack bar it has to stay around 
      //this.snackbarService.add({ message: 'Click the indicated marker and track to make your move.' });
      if(this.moveNum === 1){
        this.freezeNext = true; 
        this.highlightManager();
      }
      // must click pieces before next
    }
    return message;
  }

  messageFour():string {
    let message = '';
    if(this.humanPlayer === '1') {
      // message 4
      message = 'You get gems based on the corners of the minin\' sites you have your pickaxe touchin\'<br><br>You gotta have gems in the future to get more pickaxes and tracks down the road<br><br>Settled on your move? Click the "End Turn" button to keep the game movin\'';

                      // put these in later ones --- or maybe not? how does it work for being triggered by things other than buttons?? also putting action into snack bar only 
                  // this.snackbarService.add({ message: 'You get gems based on the corners of the minin\' sites you have your pickaxe touchin\'' });
                  //this.snackbarService.add({ message: 'You gotta have gems in the future to get more pickaxes and tracks down the road' });
                  //this.snackbarService.add({ message: 'Don\'t like where you clicked? Click the "Undo" button' });
      //this.snackbarService.add({ message: 'Settled on your move? Click the "End Turn" button to keep the game movin\'' });
      // moves when "End Turn" is clicked
    }
    return message;
  }

  messageFive():string {
    let message='';
    // AI's first move
    if(this.humanPlayer === '1') {
      message = 'Now the Machine selects its moves...<br><br>You see these here gems on each site? Those show the maximum amount of gems this site can give according to the law here in the mines.<br><br>Now if yours and you opponent’s number of mining markers on a site are more than the allotted gems then y’all exhausted that site and neither y’all will be gettin’ gems from the site.';
      if (this.moveNum === 4)
      {
        this.gameManager.applyMove(";N15;B28");
      }
    }
    return message;
  }
}