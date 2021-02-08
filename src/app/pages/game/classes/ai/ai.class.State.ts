import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../gamecore/game.class.Player';

export class State {
    
  moveHistory:string[];
  gameBoard:GameBoard;
  currentPlayer:number;

  constructor(moveHistory:string[], gameBoard:GameBoard, player:number) {
    this.moveHistory = moveHistory;
    this.gameBoard = gameBoard;
    this.currentPlayer = player;
  }

  isPlayer(player:number):boolean {
    return (player === this.currentPlayer);
  }

  hash():string {
    return JSON.stringify(this.moveHistory);
  }
}