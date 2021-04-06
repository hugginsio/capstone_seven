import { MonteCarlo } from '../..//classes/ai/ai.class.MonteCarlo';
import { State } from '../../classes/ai/ai.class.State';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { CoreLogic } from '../../util/core-logic.util';
import { MCTSNode } from './ai.class.MCTSNode';



interface Resources{
  red:number,
  blue:number,
  green:number,
  yellow:number,
}

export class AI {
  
  mcts: MonteCarlo;
  
  constructor(gameBoard:GameBoard, player1:Player,player2:Player,explorationParameter:number) {
    this.mcts = new MonteCarlo(gameBoard, player1, player2,explorationParameter); 
  }

  getAIMove(gameboard:GameBoard,player1:Player,player2:Player,previousPlayerNo:number,pastMoveString:string):string{

    const start = Date.now();
    const newState = new State(gameboard,player1, player2);
    newState.playerNumber = previousPlayerNo;
    newState.move = pastMoveString;

    const result = this.mcts.findNextMove(newState,5900);
    //const result = this.runGreedy(newState);

    //const result = newState.heuristicPlay();

    console.warn(`Time for AI move = ${Date.now() - start}ms`);
    return result;
  }

  runGreedy(state:State){
    const states = state.getAllPossibleStates();
    const len = states.length;

    let maxScore = states[0].getHeuristicValue();
    let maxIndex = 0;

    for(let i = 1; i < len; i++){
      const score = states[i].getHeuristicValue();
      if(score >= maxScore){
        maxScore = score;
        maxIndex = i;
      }
    }

    return states[maxIndex].getMove();
    
  }

//  minimax(node, depth, maximizingPlayer) is
//   if depth = 0 or node is a terminal node then
//       return the heuristic value of node
//   if maximizingPlayer then
//       value := −∞
//       for each child of node do
//           value := max(value, minimax(child, depth − 1, FALSE))
//       return value
//   else (* minimizing player *)
//       value := +∞
//       for each child of node do
//           value := min(value, minimax(child, depth − 1, TRUE))
//       return value
}