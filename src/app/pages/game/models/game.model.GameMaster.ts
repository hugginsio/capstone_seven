import { GameType } from '../interfaces/game.interfaces';
import { GameBoard } from './game.model.GameBoard';

  export interface GameMaster {
    gameBoard: GameBoard,
    gameType: GameType
  }