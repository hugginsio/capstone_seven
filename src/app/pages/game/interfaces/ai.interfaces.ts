import { GameBoard, Player } from './game.interfaces';

export interface MonteCarlo {
  gameBoard:GameBoard,
  exploreParameter: number,
  mctsNodes: Map<string,MCTSNode>
}

export interface MCTSNodePlaceHolder {
  move:string,
  node:MCTSNode
}

export interface MCTSNode {
  move:string,
  parent: MCTSNode,
  visits:number,
  wins:number,
  children: Map<string, MCTSNodePlaceHolder>,
  unexpandedMoves: string[],
  state: State
}

export interface State {
  moveHistory: string[],
  gameBoard: GameBoard,
  currentPlayer: Player
}