import { GameBoard, Player } from './game.interfaces';

export interface MonteCarlo {
    gameBoard:GameBoard,
    exploreParameter: number,
    mctsNodes: Map<string,MCTSNode>
}

export interface MCTSNode {
    move:string,
    parent: MCTSNode,
    visits:number,
    wins:number,
    children: Map<string, MCTSNode>,
    unexpandedMoves: String[],
    state: State
}

export interface State {
    moveHistory: String[],
    gameBoard: GameBoard,
    currentPlayer: Player
}