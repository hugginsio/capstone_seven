import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../gamecore/game.class.Player';
import { MonteCarlo } from './ai.class.MonteCarlo';
import { State } from './ai.class.State';


describe('State', () =>{

  describe('Is player', ()=>{
    it('should return true if the current player is the winner', () =>{
      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();


      const state = new State([],gameBoard,1,player1,player2,true);


      const newMonteCarlo = new MonteCarlo(gameBoard, 1.41);
      newMonteCarlo.makeMCTSNode(state);
      const mctsNode = newMonteCarlo.selectMCTSNode(state);
      const childNode = newMonteCarlo.expand(mctsNode);
      const simulationWinner = newMonteCarlo.simulate(mctsNode);
    
      console.log('winner',simulationWinner);

      console.log(mctsNode.state.currentPlayer);
      console.log(mctsNode.state.isPlayer(-simulationWinner));
      console.log(mctsNode.wins);

      console.log(childNode.state.currentPlayer);
      console.log(childNode.state.isPlayer(-simulationWinner));
      console.log(childNode.wins);
    });
  });

});