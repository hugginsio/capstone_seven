import { TestBed } from '@angular/core/testing';
import { BrowserWindow } from 'electron';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { Owner } from '../../enums/game.enums';
import { CoreLogic } from '../../util/core-logic.util';

import { AiService } from './ai.service';



xdescribe('AiService', () => {
  // const gameBoard = new GameBoard();
  // gameBoard.randomizeColorsAndMaxNodes();
  // const player1 = new Player();
  // const player2 = new Player();

  // const ai = new AiService(gameBoard,player1,player2,'easy');

  describe('Play full random Game', ()=>{
    it('should get a move chosen randomly',()=>{

      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();

      const ai = new AiService(gameBoard,player1,player2);

      let weHaveAWinner = false;
      const start = Date.now();
      while(!weHaveAWinner){
        //console.log(ai.currentState.moveHistory);
        const chosenMove = ai.randomAIFirstMove();

        console.log({
          player1:{
            score:ai.currentState.player1.currentScore, 
            nodes:ai.currentState.player1.numNodesPlaced,
            hasLongestNetwork:ai.currentState.player1.hasLongestNetwork,
            playersLongestNetwork:ai.currentState.player1.currentLongest,
            numberOfTilesCaptured:ai.currentState.player1.numTilesCaptured,
            currentRed: ai.currentState.player1.redResources,
            currentBlue: ai.currentState.player1.blueResources,
            currentGreen: ai.currentState.player1.greenResources,
            currenYellow: ai.currentState.player1.yellowResources,
            redPerTurn: ai.currentState.player1.redPerTurn,
            bluePerTurn: ai.currentState.player1.bluePerTurn,
            greenPerTurn: ai.currentState.player1.greenPerTurn,
            yellowPerTurn: ai.currentState.player1.yellowPerTurn},
          player2:{
            score:ai.currentState.player2.currentScore, 
            nodes:ai.currentState.player2.numNodesPlaced,
            hasLongestNetwork:ai.currentState.player2.hasLongestNetwork,
            playersLongestNetwork:ai.currentState.player2.currentLongest,
            numberOfTilesCaptured:ai.currentState.player2.numTilesCaptured,
            currentRed: ai.currentState.player2.redResources,
            currentBlue: ai.currentState.player2.blueResources,
            currentGreen: ai.currentState.player2.greenResources,
            currenYellow: ai.currentState.player2.yellowResources,
            redPerTurn: ai.currentState.player2.redPerTurn,
            bluePerTurn: ai.currentState.player2.bluePerTurn,
            greenPerTurn: ai.currentState.player2.greenPerTurn,
            yellowPerTurn: ai.currentState.player2.yellowPerTurn},
          moveJustplayed:chosenMove,
          nextPlayer:ai.currentState.currentPlayer});
        
      
        const winner = CoreLogic.determineIfWinner(ai.currentState);
        console.log(`current winner state ${winner}`);

        if(winner === 1){
          console.log('Player 1 Wins!');
          weHaveAWinner = true;
        }
        else if(winner === -1){
          console.log('Player 2 Wins!');
          weHaveAWinner = true;
        }

      }

      console.log(`TIME: ${Date.now() - start}ms`);

    });
  });

  describe('get two sequential random moves', ()=>{
    it('should get a move chosen randomly',()=>{
      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();

      const ai = new AiService(gameBoard,player1,player2);

      const firstMove = ai.randomAIFirstMove();
      const secondMove = ai.randomAIFirstMove();
      console.log(firstMove, secondMove);
      console.log(player1);
      console.log(ai.currentState.player1);
      console.log(player2);
      console.log(ai.currentState.player2);

    });
  });

  describe('Get First Monte Carlo Move', ()=>{
    it('should get a move chosen by the Monte Carlo Search Tree for the first move',()=>{

      

      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();

      const ai = new AiService(gameBoard,player1,player2);

      const start = Date.now();
      const chosenMove = ai.getAIFirstMove();
      console.log(`TIME: ${Date.now() - start}ms`);
      console.log('chosen move ', chosenMove);

      console.warn(ai.currentState.player1);
      console.log(ai.currentState.player2);

    });
  });

  describe('Get Monte Carlo Move', ()=>{
    it('should get a move chosen by the Monte Carlo Search Tree',()=>{

      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();

      const ai = new AiService(gameBoard,player1,player2);

      //ai.currentState.currentPlayer = -1;
      ai.currentState.player2.redResources = 1;
      ai.currentState.player2.blueResources = 1;
      ai.currentState.player2.greenResources = 2;
      ai.currentState.player2.yellowResources = 2;
      ai.currentState.currentPlayer = -1;
      const start = Date.now();
      const chosenMove = ai.getAIMove(';3;4');
      console.log(Date.now() - start);
      console.log(chosenMove);
      console.log(ai.currentState.player1);
      console.log(ai.currentState.player2);

    });
  });

  describe('Play Monte Carlo Game', ()=>{
    it('should through an entire game using Monte Carlo chosen moves',()=>{

      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      const player1 = new Player();
      const player2 = new Player();

      const ai = new AiService(gameBoard,player1,player2);

      let weHaveAWinner = false;
      const start = Date.now();
      while(!weHaveAWinner){
        //console.log(ai.currentState.moveHistory);
        const chosenMove = ai.getAIFirstMove();

        console.log({
          player1:{
            score:player1.currentScore, 
            nodes:player1.numNodesPlaced,
            hasLongestNetwork:player1.hasLongestNetwork,
            playersLongestNetwork:player1.currentLongest,
            numberOfTilesCaptured:player1.numTilesCaptured},
          player2:{
            score:player2.currentScore, 
            nodes:player2.numNodesPlaced,
            hasLongestNetwork:player2.hasLongestNetwork,
            playersLongestNetwork:player2.currentLongest,
            numberOfTilesCaptured:player2.numTilesCaptured},
          moveJustplayed:chosenMove});
        
      

        if(ai.currentState.player1.currentScore >= 10){
          console.log('Player 1 Wins!');
          weHaveAWinner = true;
        }
        else if(ai.currentState.player2.currentScore >= 10){
          console.log('Player 2 Wins!');
          weHaveAWinner = true;
        }
      }

      console.log('time elapsed',Date.now() - start);


    });
  });

  // beforeEach(() => {
  //   TestBed.configureTestingModule({});
  //   ai = TestBed.inject(AiService);
  // });

  // it('should be created', () => {
  //   expect(ai).toBeTruthy();
  // });



});
