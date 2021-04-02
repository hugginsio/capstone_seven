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
      this.maxMove = 21;
      this.maxStep = 25;
    }
    else {
      this.maxMove = 22;
      this.maxStep = 22;
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

  getMaxStep():number{
    return this.maxStep;
  }
  getMaxMove():number{
    return this.maxMove;
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
      case 6:
        message = this.messageSix();
        break;
      case 7: 
        message = this.messageSeven();
        break;
      case 8: 
        message = this.messageEight();
        break;
      case 9: 
        message = this.messageNine();
        break;
      case 10: 
        message = this.messageTen();
        break;
      case 11:
        message = this.messageEleven();
        break;
      case 12:
        message = this.messageTwelve();
        break;
      case 13:
        message = this.messageThirteen();
        break;
      case 14:
        message = this.messageFourteen();
        break;
      case 15: 
        message = this.messageFifteen();
        break;
      case 16:
        message = this.messageSixteen();
        break;
      case 17: 
        message = this.messageSeventeen();
        break;
      case 18: 
        message = this.messageEighteen();
        break;
      case 19: 
        message = this.messageNineteen();
        break;
      case 20: 
        message = this.messageTwenty();
        break;
      case 21:
        message = this.messageTwentyOne();
        break;
      case 22:
        message = this.messageTwentyTwo();
        break;
      case 23:
        message = this.messageTwentyThree();
        break;
      case 24:
        message = this.messageTwentyFour();
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
        case 2: piece = "B13";
          break;
        case 3: // END TURN - no highlight
          break;
        case 4: piece = "N8";
          break;
        case 5: piece = "B12";
          break;
        case 6: // UNDO - no highlight
          break;
        case 7: // UNDO - no highlight
          break;
        case 8: piece = "N16";
          break;
        case 9: piece = "B19";
          break;
        case 10: // END TURN - no highlight
          break;
        case 11: piece = "B8";
          break;
        case 12: // END TURN - no highlight
          break;
        case 13: piece = "N4";
          break;
        case 14: piece = "tradeBtn";
          break;
        /*case 15: piece = "4"; // yellow trade
          break;
        case 16: piece = "1"; // yellow trade
          break;
        case 17: piece = "4"; // red trade
          break;
        case 18: piece = "confirmTrade"; 
          break;*/
        case 19: piece = "B4"; 
          break;
        case 20: piece = "B3";
          break;
        case 20: piece = "ENDTURN";
          break;
        case 21: piece = "Pause";
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
      if(m === 1 && s === 4 && piece ==='N9') {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 2 && s === 4 && piece === 'B13'){
        this.moveNum++;
        // call to output message 4 
        this.freezeNext = false;
      }
      else if(m === 3 && s === 5 && piece === 'ENDTURN'){
        // end turn
        this.moveNum++;
        this.freezeNext = false;
      }

      else if(m === 4 && s === 8 && piece === 'N8')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 5 && s === 8 && piece === 'B12')
      {
        this.moveNum++;
        this.freezeNext = false;
      }
      else if(m === 6 && s === 9 && piece === 'UNDO')
      {
        this.moveNum++;
      }
      else if(m === 7 && s === 9 && piece === 'UNDO')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 8 && s === 9 && piece === 'N16')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 9 && s === 9 && piece === 'B19')
      {
        this.moveNum++;
      }
      else if(m === 10 && s === 9 && piece === 'ENDTURN')
      {
        this.moveNum++;
        this.freezeNext = false;
      }

      else if(m === 11 && s === 14 && piece === 'B8')
      {
        this.moveNum++;
      }
      else if(m === 12 && s === 14 && piece === 'ENDTURN')
      {
        this.moveNum++;
        this.freezeNext = false;
      }

      else if(m === 13 && s === 18 && piece === 'N4')
      {
        this.moveNum++;
        this.freezeNext = false;
      }
      else if(m === 14 && s === 19 && piece === 'tradeBtn')
      {
        this.moveNum++;
        this.moveNum++;
        this.moveNum++;
        this.moveNum++;
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 19 && s === 19 && piece === 'B4')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 20 && s === 19 && piece === 'B3')
      {
        this.moveNum++;
      }
      else if(m === 21 && s === 19 && piece === 'ENDTURN')
      {
        this.moveNum++;
        this.freezeNext = false;
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
    let message = "Learn some mining lingo before we get going:<br><br>Pickaxes and Drills are what we call \"Mining Markers.\"<br><br>These here Tracks get you from place to place down in the depths of the mine."; 

    /*let nodes = document.getElementsByClassName("node");
    let branchY = document.getElementsByClassName("branch-y");
    let branchX = document.getElementsByClassName("branch-x");
    
    if(nodes !== null && branchY !== null && branchX !== null){
      nodes.style.border = "1px solid white";
      branchY.style.border = "1px solid yellow";
      branchX.style.border = "1px solid yellow";
    }*/
    //this.snackbarService.add({ message: 'Learn some mining lingo before we get going' });
    //this.snackbarService.add({ message: 'Tracks get you from place to place, and these here squares here all abouts the mine are mining sites.' });
    //this.snackbarService.add({ message: 'These sites have gems in ‘em that hold the type and number of gem you can mine from there.' });

    return message;

    // click next
  }

  messageThree():string {
    let message = "These squares here all abouts the mine are mining sites.<br><br>These sites have gems in ‘em that hold the type and number of gem you can mine from there.";
    return message;
  }

  messageFour():string {
    let message = '';
    if(this.humanPlayer === '1') {
      // message 3
      message = 'Start the competition by puttin\' down a pickaxe and a connectin\' track anywhere in the mine.<br><br>Click the indicated marker and track to make your move.';
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

  messageFive():string {
    let message = '';
    if(this.humanPlayer === '1') {
      // message 5
      message = 'You get gems based on the corners of the minin\' sites you have your pickaxe touchin\'.<br><br>You gotta be collectin\' gems to get more pickaxes and tracks down the road<br><br>Settled on your move? Click "End Turn" and then "Next" to keep the game movin\'.';
      
      if(this.moveNum === 3){
        this.freezeNext = true;
      }
                      // put these in later ones --- or maybe not? how does it work for being triggered by things other than buttons?? also putting action into snack bar only 
                  // this.snackbarService.add({ message: 'You get gems based on the corners of the minin\' sites you have your pickaxe touchin\'' });
                  //this.snackbarService.add({ message: 'You gotta have gems in the future to get more pickaxes and tracks down the road' });
                  //this.snackbarService.add({ message: 'Don\'t like where you clicked? Click the "Undo" button' });
      //this.snackbarService.add({ message: 'Settled on your move? Click the "End Turn" button to keep the game movin\'' });
      // moves when "End Turn" is clicked
    }
    return message;
  }

  // this one is pretty long
  messageSix():string {
    let message='';
    // AI's first move
    if(this.humanPlayer === '1') {
      message = 'Now the Machine selects its moves...<br><br>You see these here gems on each site? Those show the maximum amount of gems this site can give according to the law here in the mines.<br><br>If yours and you opponent’s number of mining markers on a site are more than the allotted gems then y’all exhausted that site and neither y’all will be gettin’ gems from the site.';
     
      if (this.gameManager.getBoard().nodes[15].getOwner() === 'NONE')
      {
        this.gameManager.applyMove(";15;28");
      }
    }
    return message;
  }

  messageSeven():string {
    let message='';
    // AI's second move
    if(this.humanPlayer === '1') {
      message = 'To keep things fair and square with the turn order, the Machine goes again.';
     
      if (this.gameManager.getBoard().nodes[3].getOwner() === 'NONE')
      {
        this.gameManager.applyMove(";3;7");
      }
    }
    return message;
  }

  messageEight():string {
    let message='';
    // set up player to learn undo
    if(this.humanPlayer === '1') {
      message = 'One last time for your starting picks.<br><br>Click the indicated pieces then click "Next."';
      if (this.moveNum === 4){
        this.highlightManager();
        this.freezeNext = true;
      }
      
    }
    return message;
  }

  messageNine():string {
    let message='';
    // teaching undo 
    if(this.humanPlayer === '1') {
      message = 'Don’t like where you clicked? Click the undo button twice to reverse your past two moves.<br><br>Finish your turn by clicking the new indicated pieces and then "End Turn."<br><br>Click "Next" to continue.';
      if (this.moveNum === 6) {
        this.freezeNext = true;
      }
    }
    return message;
  }

  messageTen():string {
    let message='';
    // resource cost
    if(this.humanPlayer === '1') {
      message = 'These gems ain’t just for lookin’ at. You can keep building your operation by buying mining markers and tracks with the gems.<br><br>We in the mine charge a fair price of 2 yellow and 2 green gems for 1 mining marker and a track costs 1 red and 1 blue gem.';
     
      // would be cool to display a visual of piece costs
    }
    return message;
  }

  messageEleven():string {
    let message='';
    // talk about trading 
    if(this.humanPlayer === '1') {
      message = 'Lookin’ to trade some gems?<br>When it’s on your turn, you can make a trade of gems 3-->1 OR you can end your turn and wait to get more.<br><br>Gems get saved in your stash shown for each miner at the bottom of the screen at the end of each round.';
    }
    return message;
  }

  messageTwelve():string {
    let message='';
    // AI move - 2 branches and a trade
    if(this.humanPlayer === '1') {
      message = 'The Machine is up again and gets resources to make any amount of moves it can afford.<br><br>Y\'all see the machine tradin’ 3 yellow gems for a blue to be able to buy and put two tracks on this turn.';
     
      if (this.gameManager.getBoard().branches[18].getOwner() === 'NONE')
      {
        this.gameManager.applyMove("Y,Y,Y,B;;17,18");
      }
    }
    return message;
  }

  messageThirteen():string {
    let message='';
    // start p1 turn
    if(this.humanPlayer === '1') {
      message = 'Now it’s your turn again! -- Take a gander at your inventory to see what you could do next.<br><br>Any new tracks or pickaxes have gotta be connected to one of your other tracks. Cain’t have any off railing in these here parts.';
    }
    return message;
  }

  messageFourteen():string {
    let message='';
    // how to move
    if(this.humanPlayer === '1') {
      message = 'Just click the axe or rail in the mine to buy it!<br><br>Click here to place a rail track.<br><br>Click “End Turn” when you’re done and "Next" to move on.';
      if (this.moveNum === 11){
        this.highlightManager();
        this.freezeNext=true;
      }
      
    }
    return message;
  }

  messageFifteen():string {
    let message='';
    // explain longest net
    if(this.humanPlayer === '1') {
      message = 'Now you have the longest connected mining rail network in the duel. This means you get +2 points on your way to the goal of 10 to win. But beware, this can be snatched right out from under you by your opponent.';
    }
    return message;
  }

  messageSixteen():string {
    let message='';
    // AI move - 2 branches and a trade
    if(this.humanPlayer === '1') {
      message = 'Now it’s the Machine’s turn to take a crack at it.<br>He brings his two separate rail networks into one big one and takes those two points from you!';
      if (this.gameManager.getBoard().branches[12].getOwner() === 'NONE')
      {
        this.gameManager.applyMove("Y,Y,Y,B;;12,31");
      }
    }
    return message;
  }

  messageSeventeen():string {
    let message='';
    // show where to see score
    if(this.humanPlayer === '1') {
      message = 'Here at the bottom of the your screen is where you can see the current standings for the duel.<br><br>Both y’all got one point for each mining marker you placed. Now the machine’s got 2 more for the longest set of tracks.';
      let player1 = document.getElementById("player1");
      let player2 = document.getElementById("player2");
      // i want to put a border around the player shard 
      if(player1 !== null && player2 !== null) 
      {
        player1.style.border = "2px solid white";
        player2.style.border = '2px solid white';
      }
    }
    return message;
  }

  messageEighteen():string {
    let message='';
    // player 1 last tutorial move start
    if(this.humanPlayer === '1') {
      // reversing border of player shard
      let player1 = document.getElementById("player1");
      let player2 = document.getElementById("player2");
      // i want to put a border around the player shard 
      if(player1 !== null && player2 !== null) 
      {
        player1.style.border = "0px";
        player2.style.border = '0px';
      }
      message = 'Now you got enough gems to put a pickaxe.<br><br>Remember, you cain’t just be mining in a place where you don\'t have the tracks to get you there! It’s just common sense!<br><br>Now, place one here and get another point in the competition.';
      if (this.moveNum === 13){
        this.highlightManager();
        this.freezeNext = true;
      }
      
    }
    return message;
  }

  messageNineteen():string {
    let message='';
    // human makes a trade
    if(this.humanPlayer === '1') {
      message = 'Try your hand at makin’ a trade for the right gems to lay two more tracks.<br><br>Click the trade button, select two yellow and a red to trade for one blue and confirm your trade!<br><br>Go on and pick those two indicated tracks before clickin\' "End Turn" and then the "Next" button.';
      if(this.moveNum === 14)
      {
        this.highlightManager();
        this.freezeNext = true; 
      }
    }
    return message;
  }

  messageTwenty():string {
    let message='';
    // last AI turn 
    if(this.humanPlayer === '1') {
      message = 'Alright, one last turn for the Machine before we turn y’all loose in the mine to finish up this here “friendly” competition.';
     
      
    }
    return message;
  }

  messageTwentyOne():string {
    let message='';
    // explain capture
    if(this.humanPlayer === '1') {
      message = 'See here these minin’ sites changed when all the rails surroundin’ them belonged to the Machine.<br><br>Well this is how either miner gets exclusive minin’ rights to these sites.<br><br>These captured sites give the Machine 1 point for each captured site AND can get as many gems of these colors as it has mining markers on the captured sites before each turn.<br><br>See also that only the Machine can now get gems from the site that was exhausted just before.';
      if (this.gameManager.getBoard().branches[27].getOwner() === 'NONE')
      {
        this.gameManager.applyMove(";;27");
      }
    }
    return message;
  }

  messageTwentyTwo():string {
    let message='';
    // more capture explaination
    if(this.humanPlayer === '1') {
      message = 'If you had any or put a pickaxe touchin\' a captured site later you won’t be gettin’ any more gems from that site at the beginning of your turn.<br><br>Now remember to capture a group of sites, you cain’t have your opponents rails inside the group, but once the claiming’s been done your opponent ain’t gonna be able to put any rails inside that captured set either!';

    }
    return message;
  }

  messageTwentyThree():string {
    let message='';
    // options menu
    if(this.humanPlayer === '1') {
      message = 'Need more help or want to change the settings? Click here for options';
      let pause = document.getElementById("Pause");
        if (pause !== null)
        {
          pause.style.border = "2px solid white";
        }
    }
    return message;
  }

  messageTwentyFour():string {
    let message='';
    // options menu
    if(this.humanPlayer === '1') {
      let pause = document.getElementById("Pause");
        if (pause !== null)
        {
          pause.style.border = "0px";
        }
      message = 'Seems like you’ve got a good handle on how we do things down here in the mine. Time to see how you do on your own.<br><br>First player to 10 points wins gold. Good luck, Prospector!<br><br>Click "Next" to end the tutorial.';
    }
    return message;
  }

  

}