import { Injectable } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SnackbarService } from '../../../../shared/components/snackbar/services/snackbar.service';
import { ManagerService } from './../../services/gamecore/manager.service';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';
//import { GameComponent } from '../../game.component';



@Injectable({
  providedIn: 'root'
})
export class GuidedTutorialService {

  private humanPlayer: string;
  private stepNum: number;
  private moveNum: number;
  private freezeNext: boolean;

  constructor(
    public readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService,
    //private readonly gameComp: GameComponent
  ) { 
    this.humanPlayer = this.storageService.fetch('firstplayer');
    this.stepNum = 0;
    this.moveNum = 1;
    this.freezeNext = false;
    this.gameManager.createBoard(false, "R2,Y2,B3,G3,G2,00,G1,Y3,R1,B2,Y1,R3,B1");
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

  message(message:string): void {
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
        //message = this.messageThree();
        break;
      case 4:
        //message = this.messageFour();
        break;
      case 5: 
        //message = this.messageFive();
        break;
      default:
        console.log('something went wrong, tutorialManager switch');
    }

    return message;
  }

  moveManager(piece: string):void {
    const m = this.moveNum;

    if (this.humanPlayer === 'one'){
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
          
        this.moveNum++;
      }
      else {
        this.snackbarService.add({ message: 'Do me a favor and only click where I\'m tellin\' you to.' });
      }
    }
    else if (this.humanPlayer === 'two'){
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
      else {
        this.snackbarService.add({ message: 'Do me a favor and only click where I\'m tellin\' you to.' });
      }
    }
  }

  messageOne():string{
      // message 1, start tutorial
      this.snackbarService.add({ message: 'Welcome in to the mines!' });
      this.snackbarService.add({ message: 'Let’s walk you through a few steps to get y’all on the right foot with this here underground duel.' });
      this.snackbarService.add({ message: 'Click the "Next" button to start the tutorial.'});

      return "Welcome in to the mines!";

      // click next
  }

  messageTwo():string {
    // message 2
    this.snackbarService.add({ message: 'Learn some mining lingo before we get going: Pickaxes and Drills are what we call "Mining Markers"' });
    this.snackbarService.add({ message: 'Tracks get you from place to place, and these here squares here all abouts the mine are mining sites.' });
    this.snackbarService.add({ message: 'These sites have gems in ‘em that hold the type and number of gem you can mine from there.' });

    return "hey it works";

    // click next
  }

  messageThree():void {
    if(this.humanPlayer === 'one') {
      // message 3
      this.snackbarService.add({ message: 'Start the competition by puttin\' down a pickaxe and a connectin\' track anywhere in the mine'});
      this.snackbarService.add({ message: 'Click the indicated marker and track to make your move' });
      this.freezeNext = true; 
      // must click pieces before next
    }

  }

  messageFour():void {
    if(this.humanPlayer === 'one') {
      // message 4
     // this.snackbarService.add({ message: 'You get gems based on the corners of the minin\' sites you have your pickaxe touchin\'' });
      //this.snackbarService.add({ message: 'You gotta have gems in the future to get more pickaxes and tracks down the road' });
      //this.snackbarService.add({ message: 'Don\'t like where you clicked? Click the "Undo" button' });
      //this.snackbarService.add({ message: 'Settled on your move? Click the "End Turn" button to keep the game movin\'' });
      // moves when "End Turn" is clicked
    }
  }

  messageFive():void {

  }
}