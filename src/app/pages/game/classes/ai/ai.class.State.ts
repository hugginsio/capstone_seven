import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';

export class State {
    
  moveHistory:string[];
  gameBoard:GameBoard;
  currentPlayer:number;
  player1:Player;
  player2:Player;

  inInitialMoves:boolean;
  

  constructor(moveHistory:string[], gameBoard:GameBoard, player:number, player1:Player, player2:Player, inInitialMoves:boolean) {
    this.moveHistory = moveHistory;
    this.gameBoard = gameBoard;
    this.currentPlayer = player;
    this.player1 = player1;
    this.player2 = player2;
    this.inInitialMoves = inInitialMoves;
  }

  isPlayer(player:number):boolean {
    return (player === this.currentPlayer);
  }

  hash():string {
    return JSON.stringify(this.moveHistory);
  }
}