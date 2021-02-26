import { MonteCarlo } from './ai.class.MonteCarlo';
import { MCTSNode } from './ai.class.MCTSNode';
import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../gamecore/game.class.Player';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';


describe('MCTS', () =>{

  fdescribe('Monte Carlo expand', ()=>{
    it('should get all legal moves for the first turn',()=>{

      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();
      const explorationParameter = 1.41;
      const mcts = new MonteCarlo(gameBoard, explorationParameter);
  
      const currentState = CoreLogic.getStartingState(player1, player2,gameBoard,1);

      const chosenMove =  mcts.selectMove(currentState, 2);
      console.log(`chosen move: ${chosenMove}`);

    });
  });

});