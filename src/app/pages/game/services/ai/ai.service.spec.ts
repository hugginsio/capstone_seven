import { TestBed } from '@angular/core/testing';
import { GameBoard } from '../../classes/gamecore/game.class.GameBoard';
import { Player } from '../../classes/gamecore/game.class.Player';
import { Owner } from '../../enums/game.enums';

import { AiService } from './ai.service';


describe('AiService', () => {
  const gameBoard = new GameBoard();
  gameBoard.randomizeColorsAndMaxNodes();
  const player1 = new Player();
  const player2 = new Player();

  const ai = new AiService(gameBoard,player1,player2,'easy');

  describe('Play full random Game', ()=>{
    it('should get a move chosen randomly',()=>{
      let weHaveAWinner = false;
      
      while(!weHaveAWinner){
        const chosenMove = ai.randomAIFirstMove();
        console.log(chosenMove);
        if(ai.currentState.player1.currentScore >= 10){
          console.log('Player 1 Wins!');
          weHaveAWinner = true;
        }
        else if(ai.currentState.player2.currentScore >= 10){
          console.log('Player 2 Wins!');
          weHaveAWinner = true;
        }
      }

    });
  });

  describe('get two sequential random moves', ()=>{
    it('should get a move chosen randomly',()=>{
      // const firstMove = ai.randomAIFirstMove();
      // const secondMove = ai.randomAIMove(firstMove);
      // console.log(firstMove, secondMove);

    });
  });

  describe('Get Monte Carlo Move', ()=>{
    it('should get a move chosen by the Monte Carlo Search Tree',()=>{

      // ai.currentState.currentPlayer = -1;
      // const chosenMove = ai.getMove(';3;4');
      // console.log(chosenMove);

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
