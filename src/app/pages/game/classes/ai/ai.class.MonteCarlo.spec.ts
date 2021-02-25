import { MonteCarlo } from './ai.class.MonteCarlo';
import { MCTSNode } from './ai.class.MCTSNode';
import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../gamecore/game.class.Player';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';


describe('MCTS', () =>{

  describe('MCTS Constructor', () =>{
    it('Shoule create the Monte Carlo Tree infrastructure', ()=>{
      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();

      const newMonteCarlo = new MonteCarlo(gameBoard, 1.41);

      expect(newMonteCarlo.gameBoard).toEqual(gameBoard);
      expect(newMonteCarlo.mctsNodeKeys.length).toEqual(0);
      expect(newMonteCarlo.mctsNodeValues.length).toEqual(0);
    });
  });

  describe('makeMCTSNode', () =>{
    it('Should create a new node', ()=>{
      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();

      const state = new State([],gameBoard,1,player1,player2,true);


      const newMonteCarlo = new MonteCarlo(gameBoard, 1.41);

      newMonteCarlo.makeMCTSNode(state);


      //console.log(newMonteCarlo.mctsNodeKeys);
      //console.log(newMonteCarlo.mctsNodeValues);

      console.log(newMonteCarlo.mctsNodeValues[0].childrenKeys);
      console.log(newMonteCarlo.mctsNodeValues[0].childrenValues);

    });
  });

  describe('selectMCTSNode', () =>{
    it('Should select a node', ()=>{
      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();

      const state = new State([],gameBoard,1,player1,player2,true);


      const newMonteCarlo = new MonteCarlo(gameBoard, 1.41);
      newMonteCarlo.makeMCTSNode(state);
      const mctsNode = newMonteCarlo.selectMCTSNode(state);


      //console.log(newMonteCarlo.mctsNodeKeys);
      //console.log(newMonteCarlo.mctsNodeValues);

      console.log(mctsNode.move);
      console.log(mctsNode.childrenKeys);
      console.log(mctsNode.childrenValues);
      

    });
  });


  describe('expand', () =>{
    it('Should expand a node', ()=>{
      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();
      

      const state = new State([],gameBoard,1,player1,player2,true);


      const newMonteCarlo = new MonteCarlo(gameBoard, 1.41);
      newMonteCarlo.makeMCTSNode(state);
      const mctsNode = newMonteCarlo.selectMCTSNode(state);
      const childNode = newMonteCarlo.expand(mctsNode);

      //console.log(newMonteCarlo.mctsNodeKeys);
      //console.log(newMonteCarlo.mctsNodeValues);
      //console.log(mctsNode.childrenValues);
      //console.log(childNode.move);
      //console.log(childNode.childrenKeys);
      //console.log(childNode.childrenValues);

      console.log(player1);
      console.log(mctsNode.state.player1);
      console.log(childNode.state.player1);

      console.log(player2);
      console.log(mctsNode.state.player2);
      console.log(childNode.state.player2);
      

    });
  });

  describe('simulate', () =>{
    it('Should simulate a playthrough', ()=>{
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

      //console.log(newMonteCarlo.mctsNodeKeys);
      //console.log(newMonteCarlo.mctsNodeValues);
      //console.log(mctsNode.childrenValues);
      //console.log(childNode.move);
      //console.log(childNode.childrenKeys);
      //console.log(childNode.childrenValues);
      console.log(simulationWinner);
      //console.log(childNode.parent);

      console.log(player1);
      console.log(mctsNode.state.player1);
      console.log(childNode.state.player1);

      console.log(player2);
      console.log(mctsNode.state.player2);
      console.log(childNode.state.player2);

    });
  });

  describe('backpropagate', () =>{
    it('Should backpropagate', ()=>{
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
      newMonteCarlo.backPropagate(childNode,simulationWinner);

      //console.log(newMonteCarlo.mctsNodeKeys);
      //console.log(newMonteCarlo.mctsNodeValues);
      //console.log(mctsNode.childrenValues);
      //console.log(childNode.move);
      //console.log(childNode.childrenKeys);
      //console.log(childNode.childrenValues);
      console.log(simulationWinner);
      //console.log(mctsNode.state.player1);
      //console.log(mctsNode.state.player2);
      //console.log(childNode.state.player1);
      //console.log(childNode.state.player2);
      console.log(mctsNode.state.currentPlayer,mctsNode.wins);
      console.log(childNode.state.currentPlayer,childNode.wins);

      console.log(player1);
      console.log(mctsNode.state.player1);
      console.log(childNode.state.player1);

      console.log(player2);
      console.log(mctsNode.state.player2);
      console.log(childNode.state.player2);

    });
  });

  describe('run search', () =>{
    it('Should run the search', ()=>{
      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();


      const state = new State([],gameBoard,1,player1,player2,true);


      const newMonteCarlo = new MonteCarlo(gameBoard, 1.41);
      const stats = newMonteCarlo.runSearch(state,5.8);
      console.log(stats);

    });
  });

});