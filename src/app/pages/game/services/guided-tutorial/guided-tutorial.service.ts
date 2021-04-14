import { Injectable } from '@angular/core';
import { SnackbarService } from '../../../../shared/components/snackbar/services/snackbar.service';
import { ManagerService } from './../../services/gamecore/manager.service';
import { LocalStorageService } from '../../../../shared/services/local-storage/local-storage.service';


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
  public playerShardBtn: string;
  //private btnToHighlight: string;

  constructor(
    public readonly gameManager: ManagerService,
    private readonly storageService: LocalStorageService,
    private readonly snackbarService: SnackbarService,
    //private readonly gameComp: GameComponent
  ) { 
    this.humanPlayer = '1';
    this.stepNum = 1;
    this.moveNum = 1;
    this.playerShardBtn = '';
    //this.btnToHighlight = '';
    this.freezeNext = false;
    this.maxMove = 26;
    this.maxStep = 26;
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
  resetStepAndMoveNum():void {
    this.stepNum = 1;
    this.moveNum = 1;
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
    const message = this.messageOne();
    return message;
  }

  highlightNext():void {
    const pieceID = document.getElementById('GT-Next');
    if (pieceID !== null)
    {
      pieceID.style.border = "4px solid white";
    }
  }

  unhighlightNext():void{
    const pieceID = document.getElementById('GT-Next');
    if (pieceID !== null)
    {
      pieceID.style.border = "4px solid rgb(17, 24, 39)";
    }
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
      case 25:
        message = this.messageTwentyFive();
        break;
      case 26: 
        message = "end of tutorial";
        break;

      default:
        console.log('something went wrong, tutorialManager switch');
    }

    return message;
  }

  highlightManager():void {
    const m = this.moveNum;
    let piece = "no selected piece";
    if(this.humanPlayer === '1'){
      switch(m){
        case 1: piece = "N9";
          break;
        case 2: piece = "B13";
          break;
        case 3: piece = "endTurnBtn";
          break;
        case 4: piece = "N8";
          break;
        case 5: piece = "B12";
          break;
        case 6: piece = "undoBtn";
          break;
        case 7: piece = "undoBtn";
          break;
        case 8: piece = "N16";
          break;
        case 9: piece = "B19";
          break;
        case 10: piece = "endTurnBtn";
          break;
        case 11: piece = "B8";
          break;
        case 12: piece = "endTurnBtn";
          break;
        case 13: piece = "N4";
          break;
        case 14: piece = "tradeBtn";
          break;
        case 15: piece = "4"; // yellow trade
          break;
        case 16: piece = "1"; // yellow trade
          break;
        case 17: piece = "4"; // red trade
          break;
        case 18: piece = "blue"; 
          break;
        case 19: piece = "confirmTrade"; 
          break;
        case 20: piece = "B4"; 
          break;
        case 21: piece = "B3";
          break;
        case 22: piece = "endTurnBtn";
          break;
        case 23: piece = "B5";
          break;
        case 24: piece = "B9";
          break;
        case 25: piece = "endTurnBtn";
          break;
        case 26: piece = "Pause";
          break;
        default:
          console.log("highlightManager error");
      }
    }
    // change border and change back after move has been made
    if(piece !== "no selected piece") {
      const pieceID = document.getElementById(piece);
      if (pieceID !== null)
      {
        if (piece === '4' || piece === '1' || piece === 'blue')
        {
          pieceID.style.border = "4px solid white";
        }
        else if (piece === 'endTurnBtn' || piece === 'undoBtn' || piece === 'tradeBtn' || piece === 'Pause')
        {
          this.playerShardBtn = piece;
        }
        else {
          pieceID.style.border = "2px solid white";
        }
      }
        
    }
      
  }


  // whenever need to have a next button, unfreeze next
  moveManager(piece: string):boolean {
    const m = this.moveNum;
    const s = this.stepNum;
    let validMove = true; 
    let ifButton = false;
    let tradeScreenButton = false;
    this.playerShardBtn = '';


    if (this.humanPlayer === '1'){
      if(m === 1 && s === 4 && piece ==='N9') {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 2 && s === 4 && piece === 'B13'){
        this.moveNum++;
        // call to output message 4 
        this.freezeNext = false;
        this.highlightNext();
      }
      else if(m === 3 && s === 5 && piece === 'endTurnBtn'){
        // end turn
        this.moveNum++;
        this.freezeNext = false;
        this.highlightNext();
        ifButton = true;
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
        this.highlightNext();
      }
      else if(m === 6 && s === 9 && piece === 'undoBtn')
      {
        this.moveNum++;
        this.highlightManager();
        ifButton = true;
      }
      else if(m === 7 && s === 9 && piece === 'undoBtn')
      {
        this.moveNum++;
        this.highlightManager();
        ifButton = true;
      }
      else if(m === 8 && s === 9 && piece === 'N16')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 9 && s === 9 && piece === 'B19')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 10 && s === 9 && piece === 'endTurnBtn')
      {
        this.moveNum++;
        this.freezeNext = false;
        this.highlightNext();
        ifButton = true;
      }

      else if(m === 11 && s === 14 && piece === 'B8')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 12 && s === 14 && piece === 'endTurnBtn')
      {
        this.moveNum++;
        this.freezeNext = false;
        this.highlightNext();
        ifButton = true;
      }

      else if(m === 13 && s === 18 && piece === 'N4')
      {
        this.moveNum++;
        this.freezeNext = false;
        this.highlightNext();
      }
      else if(m === 14 && s === 19 && piece === 'tradeBtn')
      {
        this.moveNum++;
        this.highlightManager();
        ifButton = true;
      }
      else if(m === 15 && s === 19 && piece === '4')
      {
        this.moveNum++;
        this.highlightManager();
        tradeScreenButton = true;
      }
      else if(m === 16 && s === 19 && piece === '1')
      {
        this.moveNum++;
        this.highlightManager();
        tradeScreenButton = true;
      }
      else if(m === 17 && s === 19 && piece === '4')
      {
        this.moveNum++;
        this.highlightManager();
        tradeScreenButton = true;
      }
      else if(m === 18 && s === 19 && piece === 'blue')
      {
        this.moveNum++;
        this.highlightManager();
        // to keep the white highlight there after selecting it 
        ifButton = true;
      }
      else if(m === 19 && s === 19 && piece === 'confirmTrade')
      {
        this.moveNum++;
        this.highlightManager();
        tradeScreenButton = true;
      }
      else if(m === 20 && s === 19 && piece === 'B4')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 21 && s === 19 && piece === 'B3')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 22 && s === 19 && piece === 'endTurnBtn')
      {
        this.moveNum++;
        this.freezeNext = false;
        this.highlightNext();
        ifButton = true;
      }
      else if(m === 23 && s === 23 && piece === 'B5')
      {
        this.moveNum++;
        this.highlightManager();
      }
      else if(m === 24 && s === 23 && piece === 'B9')
      {
        this.moveNum++;
        this.freezeNext = false;
        this.highlightNext();
        //this.highlightManager();
      }
      /*else if(m === 25 && s === 23 && piece === 'endTurnBtn')
      {
        this.moveNum++;
        this.freezeNext = false;
        this.highlightNext();
        ifButton = true;
      }*/

      else {
        this.snackbarService.add({ message: 'Now don\'t be clickin\' just anywhere! Please follow these here instructions.' });
        validMove = false;
      }
    }

    // unhighlight if needed
    if(validMove && ifButton){
      const pieceID = document.getElementById(piece);
      if(pieceID !== null) {
        if(piece === 'blue')
        {
          pieceID.style.border = "4px solid rgb(37, 99, 235)";
        }
      }
      
    }
    else if(validMove && tradeScreenButton){
      const pieceID = document.getElementById(piece);
      if(pieceID !== null) {
        pieceID.style.border = "4px solid rgb(75, 85, 99)";
      }
    }
    else if(validMove){
      const pieceID = document.getElementById(piece);
      if(pieceID !== null) {
        pieceID.style.border = "0px";
      }
    }
    return validMove;
  }

  messageOne():string{
    const message = "Welcome to the mines! <br><br> Let’s walk you through a few steps to get y’all on the right foot with this here underground duel.<br><br>Click the \"Next\" button to start the tutorial.";
    // message 1, start tutorial

    this.highlightNext();
    return message;

    // click next
  }

  messageTwo():string {
    // message 2
    const message = "Learn some minin' lingo before we get going:<br><br>These squares here which make up the mine are called Sites.<br><br>These Sites tell ya which Gems they give and how many Tools they can have on their corners.";
    
    this.highlightNext();

    return message;

    // click next
  }

  messageThree():string {
    const message = "On each corner of a Site is a place for a Pickaxe or Drill which are what we call \"Tools.\"<br><br>Each Tool will give ya one Gem per turn from each of the touchin' Sites.<br><br>These here Paths on the sides of each Site are how ya get around to expandin' your operation."; 

    this.highlightNext();
    
    return message;
  }

  messageFour():string {
    let message = '';
    if(this.humanPlayer === '1') {
      // message 3
      message = 'Start the competition by puttin\' down a Tool and a connectin\' Path anywhere in the mine.<br><br>Click the indicated Tool and Path spaces to make your move.';
      if(this.moveNum === 1){
        this.freezeNext = true; 
        this.highlightManager();
      }
    }
    return message;
  }

  messageFive():string {
    let message = '';
    if(this.humanPlayer === '1') {
      // message 5
      message = 'Settled on your move? Click "End Turn" to keep the game movin\'.<br><br>Then click "Next" to continue.';
      
      if(this.moveNum === 3){
        this.highlightManager();
        this.freezeNext = true;
      }
    }
    return message;
  }

  // this one is pretty long
  messageSix():string {
    let message='';
    // AI's first move
    if(this.humanPlayer === '1') {
      message = 'Now the other Player selects their moves...<br><br>You see these here Gems on each Site? The number of Gems is the maximum amount of Tools the Site can support.<br><br>If you and your opponent’s number of Tools on a Site are more than the maximum, then that Site is "Tuckered Out" and no one\'s gettin’ Gems from it.';
  
      if (this.gameManager.getBoard().nodes[15].getOwner() === 'NONE' && this.gameManager.getBoard().branches[28].getOwner() === 'NONE')
      {
        this.AImove(";15;28");
        this.highlightNext();

      }
      //this.highlightNext();
    }
    return message;
  }

  messageSeven():string {
    let message='';
    // AI's second move
    if(this.humanPlayer === '1') {
      message = 'To keep things fair and square with the turn order, the other Player goes again.';
     
      if (this.gameManager.getBoard().nodes[3].getOwner() === 'NONE' && this.gameManager.getBoard().branches[7].getOwner() === 'NONE')
      {
        this.AImove(";3;7");
        this.highlightNext();

      }

    }
    return message;
  }

  messageEight():string {
    let message='';
    // set up player to learn undo
    if(this.humanPlayer === '1') {
      message = 'Now you\'ll take your other Starting Turn.<br><br>Click the indicated pieces then click "Next."';
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
      message = 'Go ahead and click the "Undo" button twice to take back your last two moves.<br><br>Finish your turn by placin\' the highlighted pieces and clicking "End Turn."<br><br>Then click "Next" to continue.';
      if (this.moveNum === 6) {
        this.highlightManager();
        this.freezeNext = true;
      }
    }
    return message;
  }

  messageTen():string {
    let message='';
    // resource cost
    if(this.humanPlayer === '1') {
      message = 'These Gems ain’t just for lookin’ at. You can expand your operation by buyin\' more Tools and Paths with your Gems.<br><br>Take a gander at the Price Card to remind yourself of their costs.';
      
      const card = document.getElementById('exchangeRate');

      if(card !== null){
        card.style.border = "4px solid white";
      }
      
      this.highlightNext();
     
      // would be cool to display a visual of piece costs
    }
    return message;
  }

  messageEleven():string {
    let message='';
    // talk about trading 
    if(this.humanPlayer === '1') {
      message = 'Lookin’ to trade some Gems?<br>When it’s your turn, you can make a Trade of 3 Gems for 1 Gem of any other type.<br><br>You can only Trade once per turn.<br><br>Gems ya don\'t spend are saved in your stash at the bottom of the screen.';
      
      const card = document.getElementById('exchangeRate');

      if(card !== null){
        card.style.border = "4px solid rgb(75, 85, 99)";
      }
      
      this.highlightNext();
    }
    return message;
  }

  messageTwelve():string {
    let message='';
    // AI move - 2 branches and a trade
    if(this.humanPlayer === '1') {
      message = 'The other Player is up again. They\'re gonna get Gems at the start of each turn from all their Tools. They can make any amount of moves as long as they got the Gems to pay up.<br><br> Your opponent has traded 3 yellow Gems for a blue so they could afford two Paths on this turn.';
     
      if (this.gameManager.getBoard().branches[18].getOwner() === 'NONE' && this.gameManager.getBoard().branches[17].getOwner() === 'NONE')
      {
        this.AImove("Y,Y,Y,B;;17,18");
        this.highlightNext();

      }
    }
    return message;
  }

  messageThirteen():string {
    let message='';
    // start p1 turn
    if(this.humanPlayer === '1') {
      message = 'Now it’s your turn again!<br><br>Take a gander at your stash to see what you can do next.<br><br>Any new Paths or Tools have gotta be connected to one of your other Paths.';
      this.highlightNext();
    }
    return message;
  }

  messageFourteen():string {
    let message='';
    // how to move
    if(this.humanPlayer === '1') {
      message = 'Click on the highlighted Path.<br><br>Then click “End Turn” and "Next" to move on.';
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
      message = 'Now you have the longest Path in the duel. This means you got 2 more points on the way to your goal of 10 to win. <br><br>But beware! This can be snatched right out from under you by your opponent.';
      this.highlightNext();
    
    }
    return message;
  }

  messageSixteen():string {
    let message='';
    // AI move - 2 branches and a trade
    if(this.humanPlayer === '1') {
      message = 'Now it’s the opponent\'s turn to take a crack at it.<br>They connect their two separate Paths into one big one and take those 2 points from you!';
      
      const player1 = document.getElementById("player1");
      const player2 = document.getElementById("player2");

      if(player1 !== null && player2 !== null) 
      {
        player1.style.border = "transparent";
        player2.style.border = "transparent";
      }

      if (this.gameManager.getBoard().branches[12].getOwner() === 'NONE'&& this.gameManager.getBoard().branches[31].getOwner() === 'NONE')
      {
        this.AImove("Y,Y,Y,B;;12,31");
        this.highlightNext();

      }
    }
    return message;
  }

  messageSeventeen():string {
    let message='';
    // show where to see score
    if(this.humanPlayer === '1') {
      message = 'At the bottom of the screen is where you can see the current standings for the duel.<br><br>Both y’all got 1 point for each Tool ya placed, and the opponent’s got 2 more for havin\' the longest Path.';
      const player1 = document.getElementById("player1");
      const player2 = document.getElementById("player2");

      if(player1 !== null && player2 !== null) 
      {
        player1.style.border = "solid white";
        player2.style.border = "solid white";
      }
      this.highlightNext();

    }
    return message;
  }

  messageEighteen():string {
    let message='';
    // player 1 last tutorial move start
    if(this.humanPlayer === '1') {
      
      message = 'Now you got enough Gems to place a Tool!<br><br>Remember, you cain’t just be mining in a place where you don\'t have the Paths to get you there!<br><br>Place a Tool in the highlighted space and earn yourself another point.';
      if (this.moveNum === 13){
        this.highlightManager();
        this.freezeNext = true;
      }

      // reversing border of player shard
      const player1 = document.getElementById("player1");
      const player2 = document.getElementById("player2");

      if(player1 !== null && player2 !== null) 
      {
        player1.style.border = "transparent";
        player2.style.border = "transparent";
      }
      
    }
    return message;
  }

  messageNineteen():string {
    let message='';
    // human makes a trade
    if(this.humanPlayer === '1') {
      message = 'Try your hand at Tradin\' Gems so ya can place two more Paths.<br><br>Click the "Trade" button. Then select 1 yellow, 1 red, and 1 more yellow to trade away. Then select 1 blue to trade for and confirm your trade.<br><br>Go on and place those two highlighted Paths before clickin\' "End Turn" and then "Next".';
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
      message = 'Alright, one last turn for your opponent before we turn y’all loose in the mine to finish up this here friendly competition.';
     
      this.highlightNext();
      
    }
    return message;
  }

  messageTwentyOne():string {
    let message='';
    // explain capture
    if(this.humanPlayer === '1') {
      message = 'See how these Sites changed when the opponent surrounded them with Paths on all sides?<br><br>This is how you can get exclusive mining rights to these Sites!<br><br>These captured Sites are gonna give your opponent 1 point a piece. Plus, only your opponent can get Gems from those Sites now.';
      if (this.gameManager.getBoard().branches[27].getOwner() === 'NONE')
      {
        this.AImove(";;27");
        this.highlightNext();

      }
    }
    return message;
  }

  messageTwentyTwo():string {
    let message='';
    // more capture explaination
    if(this.humanPlayer === '1') {
      message = 'If you had any Tools on a Site that gets claimed by your opponent, you won’t be gettin’ any more Gems from that Site.<br><br>To claim a group of Sites, you cain’t have your opponent\'s Paths inside the group. But once the claimin’s been done, your opponent ain’t gonna be able to put any Paths inside the group either!';
      this.highlightNext();

    }
    return message;
  }

  messageTwentyThree():string {
    let message='';
    // more capture explaination
    if(this.humanPlayer === '1') {
      message = 'Your turn to try your hand at claimin\' a Site! Click on the highlighted Paths to tie up the scores.';

      if(this.moveNum === 23)
      {
        this.highlightManager();
        this.freezeNext = true; 
      }

    }
    return message;
  }

  messageTwentyFour():string {
    let message='';
    // options menu
    if(this.humanPlayer === '1') {
      message = 'Need more help or want to change the settings? Click the "Menu" button in the upper-left corner for more options.';
      this.highlightNext();

    }
    return message;
  }

  messageTwentyFive():string {
    let message='';
    // end of tutorial
    if(this.humanPlayer === '1') {
      message = 'Seems like you’ve got a good handle on how we do things down here in the mine! Time to see how you do on your own.<br><br>First player to 10 points wins gold. Good luck, Prospector!<br><br>Click "Next" to end the Tutorial then go on an\' click "End Turn" when you\'re ready.';
      this.highlightNext();

    }
    return message;
  }

  AImove(move: string):void {
    this.gameManager.GTApplyMove(move);
  }

}