import { MonteCarlo } from './ai.class.MonteCarlo';
import { MCTSNode } from './ai.class.MCTSNode';
import { GameBoard } from '../gamecore/game.class.GameBoard';
import { Player } from '../gamecore/game.class.Player';
import { State } from './ai.class.State';


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
    fit('Should expand a node', ()=>{
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
      console.log(mctsNode.childrenValues);
      console.log(childNode.move);
      console.log(childNode.childrenKeys);
      console.log(childNode.childrenValues);
      

    });
  });

});