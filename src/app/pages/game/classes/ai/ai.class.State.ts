import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { CoreLogic } from '../../util/core-logic.util';
import { state } from '@angular/animations';

export class State {
  
  move:string;

  board:GameBoard;
  player1:Player;
  player2:Player;

  playerNumber:number;
  turnNumber:number;

  visitCount:number;
  winScore:number;

  constructor(newBoard:GameBoard, player1:Player, player2:Player){
    this.setBoard(newBoard);
    this.setPlayer1(player1);
    this.setPlayer2(player2);

    this.playerNumber = 1;
    this.turnNumber = 0;
    this.visitCount = 0;
    this.winScore = 0;
    this.move = '';

  }


  getAllPossibleStates():Array<State>{
    // constructs a list of all possible states from current state
    const moves = CoreLogic.getLegalMoves(this);

    const states = [];

    for(const move of moves){
      const newState = this.cloneState();
      newState.move = move;
      newState.togglePlayer();
      newState.turnNumber++;

      CoreLogic.applyMove(move,newState);

      states.push(newState);
    }

    return states;
  }

  randomPlay():void{
    /* get a list of all possible positions on the board and 
           play a random move */
    const moves = CoreLogic.getLegalMoves(this);
    const index = Math.floor(Math.random() * moves.length);

    CoreLogic.applyMove(moves[index],this);
    this.turnNumber++;
  }

  setBoard(gameBoard:GameBoard):void{
    this.board = CoreLogic.cloneGameBoard(gameBoard);
  }

  setPlayer1(player:Player):void{
    this.player1 = CoreLogic.clonePlayer(player);
  }

  setPlayer2(player:Player):void{
    this.player2 = CoreLogic.clonePlayer(player);
  }

  getBoard():GameBoard{
    return this.board;
  }

  setPlayerNo(nextPlayer:number):void{
    if(this.turnNumber != 2){
      this.playerNumber = nextPlayer;
    }
  }

  getMove():string{
    return this.move;
  }

  getVisitCount():number{
    return this.visitCount;
  }

  getWinScore():number{
    return this.winScore;
  }

  setWinScore(score:number):void{
    this.winScore = score;
  }

  togglePlayer():void{
    if(this.turnNumber !== 2){
      this.playerNumber = 3 - this.playerNumber;
    }
  }

  incrementVisit():void{
    this.visitCount++;
  }

  setTurnNumber(turnNumber:number):void{
    this.turnNumber = turnNumber;
  }

  getPlayerNo():number{
    return this.playerNumber;
  }

  addScore(score:number):void{
    this.winScore += score;
  }

  getOpponent():number{
    return 3 - this.playerNumber;
  }

  cloneState():State{
    const newState = new State(this.getBoard(), this.player1, this.player2);

    newState.move = this.move;
    newState.playerNumber = this.playerNumber;
    newState.turnNumber = this.turnNumber;
    newState.visitCount = this.visitCount;
    newState.winScore = this.winScore;

    return newState;
  }
}