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

  // describe('Get First Monte Carlo Move', ()=>{
  //   it('should get a move chosen by the Monte Carlo Search Tree for the first move',()=>{

  //     const gameBoard = new GameBoard();
  //     gameBoard.randomizeColorsAndMaxNodes();
  //     const player1 = new Player();
  //     const player2 = new Player();

  //     const newMonteCarlo = new MonteCarlo(gameBoard, 1.41);
      
  //     let currentState = CoreLogic.getStartingState(player1, player2,gameBoard,1);

  //     const start = Date.now();
  //     const stats = newMonteCarlo.runSearch(currentState, 5.95);

  //     //console.log(this.currentState);
      
  //     console.log(stats);
  //     const chosenMove = newMonteCarlo.calculateBestMove(currentState,'max');
  
      
  
  //     currentState = CoreLogic.nextState(currentState, chosenMove);
  //     console.log(`TIME: ${Date.now() - start}ms`);
  //     console.log(`chosenmove: ${chosenMove}`);

  //     console.warn(currentState.player1);
  //     console.log(currentState.player2);

  //   });
  // });

});