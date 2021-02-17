import { State } from '../classes/ai/ai.class.State';
import { GameBoard } from '../classes/gamecore/game.class.GameBoard';
import { Player } from '../classes/gamecore/game.class.Player';
import { Owner } from '../enums/game.enums';
import { CoreLogic } from './core-logic.util';

describe('CoreLogic', () => {
  //let utility: CoreLogic;

  describe('move to string',()=>{
    it('should convert a move to the proper string format', ()=>{
      const answer = CoreLogic.moveToString({tradedIn:['R','B','B'],received:'G',nodesPlaced:[5,4,3],branchesPlaced:[12,4,16]});

      expect(answer).toEqual('R,B,B,G;5,4,3;12,4,16');
    });
  });

  describe('move to string empty trade',()=>{
    it('should convert a move to the proper string format', ()=>{
      const answer = CoreLogic.moveToString({tradedIn:[],received:'',nodesPlaced:[5,4,3],branchesPlaced:[12,4,16]});

      expect(answer).toEqual(';5,4,3;12,4,16');
    });
  });

  describe('move to string empty nodes',()=>{
    it('should convert a move to the proper string format', ()=>{
      const answer = CoreLogic.moveToString({tradedIn:['R','B','B'],received:'G',nodesPlaced:[],branchesPlaced:[12,4,16]});

      expect(answer).toEqual('R,B,B,G;;12,4,16');
    });
  });

  describe('move to string empty branches',()=>{
    it('should convert a move to the proper string format', ()=>{
      const answer = CoreLogic.moveToString({tradedIn:['R','B','B'],received:'G',nodesPlaced:[5,4,3],branchesPlaced:[]});

      expect(answer).toEqual('R,B,B,G;5,4,3;');
    });
  });

  describe('string to move', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove('R,B,B,G;5,4,3;12,4,16');
      expect(answer).toEqual({tradedIn:['R','B','B'],received:'G',nodesPlaced:[5,4,3],branchesPlaced:[12,4,16]});
    });
  });

  describe('string to move no trade', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove(';5,4,3;12,4,16');
      expect(answer).toEqual({tradedIn:[],received:'',nodesPlaced:[5,4,3],branchesPlaced:[12,4,16]});
    });
  });

  describe('string to move no nodes', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove('R,B,B,G;;12,4,16');
      expect(answer).toEqual({tradedIn:['R','B','B'],received:'G',nodesPlaced:[],branchesPlaced:[12,4,16]});
    });
  });

  describe('string to move no branches', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove('R,B,B,G;5,4,3;');
      expect(answer).toEqual({tradedIn:['R','B','B'],received:'G',nodesPlaced:[5,4,3],branchesPlaced:[]});
    });
  });

  describe('kStringCombinations for red', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const resources = ['B','G','Y'];
      const result = CoreLogic.kStringCombinations(resources, 3);

      expect(result).toContain(['B','G','Y']);
    });
  });

  describe('kStringCombinations for blue', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const resources = ['R','R','G','Y'];
      const result = CoreLogic.kStringCombinations(resources, 3);

      expect(result).toContain(['R','R','Y']);
      expect(result).toContain(['R','R','G']);
      expect(result).toContain(['R','G','Y']);
    });
  });

  describe('kStringCombinations for green', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const resources = ['R','R','B','Y'];
      const result = CoreLogic.kStringCombinations(resources, 3);

      expect(result).toContain(['R','R','Y']);
      expect(result).toContain(['R','R','B']);
      expect(result).toContain(['R','B','Y']);
    });
  });

  describe('kStringCombinations for yellow', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const resources = ['R','R','B','G'];
      const result = CoreLogic.kStringCombinations(resources, 3);

      expect(result).toContain(['R','R','G']);
      expect(result).toContain(['R','R','B']);
      expect(result).toContain(['R','B','G']);
    });
  });

  describe('kNumberCombinations', ()=>{
    it('should output combinations of k number from an array of strings', ()=>{
      const numbers = [3,14,27];
      const result = CoreLogic.kNumberCombinations(numbers, 2);

      expect(result).toContain([14,27]);
      expect(result).toContain([3,27]);
      expect(result).toContain([3,14]);
    });
  });


  //Check for captures test
  describe('check for 1 capture', ()=>{
    it('should identify that the tile has been captured',()=>{
      const gameBoard = new GameBoard();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);
      gameBoard.branches[17].setOwner(Owner.PLAYERONE);
      gameBoard.branches[18].setOwner(Owner.PLAYERONE);
      gameBoard.branches[23].setOwner(Owner.PLAYERONE);

      const player1 = new Player();
      const player2 = new Player();
      
      const state = new State([],gameBoard,1,player1,player2, false);

      const answer = CoreLogic.checkForCaptures(state,player1,6);

      expect(answer).toBeTrue();
      
    });
  });

  describe('check for 2 captures', ()=>{
    it('should identify that the tiles have been captured',()=>{
      const gameBoard = new GameBoard();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);
      gameBoard.branches[17].setOwner(Owner.PLAYERONE);
      gameBoard.branches[13].setOwner(Owner.PLAYERONE);
      gameBoard.branches[19].setOwner(Owner.PLAYERONE);
      gameBoard.branches[24].setOwner(Owner.PLAYERONE);
      gameBoard.branches[23].setOwner(Owner.PLAYERONE);

      const player1 = new Player();
      const player2 = new Player();
      
      const state = new State([],gameBoard,1,player1,player2, false);

      const answer1 = CoreLogic.checkForCaptures(state,player1,6);
      const answer2 = CoreLogic.checkForCaptures(state,player1,7);

      expect(answer1).toBeTrue();
      expect(answer2).toBeTrue();
      
    });
  });

  // describe('check for longest network', ()=>{
  //   it('should identify that player 1 has the longest network',()=>{
  //     const gameBoard = new GameBoard();
  //     gameBoard.branches[12].setOwner(Owner.PLAYERONE);
  //     gameBoard.branches[17].setOwner(Owner.PLAYERONE);
  //     gameBoard.branches[13].setOwner(Owner.PLAYERONE);
  //     gameBoard.branches[19].setOwner(Owner.PLAYERONE);
  //     gameBoard.branches[23].setOwner(Owner.PLAYERONE);
  //     gameBoard.branches[28].setOwner(Owner.PLAYERONE);

  //     const player1 = new Player();
  //     const player2 = new Player();
      
  //     player1.ownedBranches.push(12);
  //     player1.ownedBranches.push(13);
  //     player1.ownedBranches.push(17);
  //     player1.ownedBranches.push(19);
  //     player1.ownedBranches.push(23);
  //     player1.ownedBranches.push(28);



  //     const state = new State([],gameBoard,1,player1,player2, false);

      

  //     for (let i = 0; i < state.player1.ownedBranches.length; i++) {
  //       CoreLogic.checkForLongest(state,state.player1, state.player1.ownedBranches[i]);
  //     }

  //     expect(state.player1.hasLongestNetwork).toBeTrue();
  //     expect(state.player1.currentLongest).toEqual(7);
      
  //   });
  // });

  describe('detemine if winner', ()=>{
    it('should identify that player 1 is the winner',()=>{
      const gameBoard = new GameBoard();
      

      const player1 = new Player();
      const player2 = new Player();

      player1.currentScore = 10;
      player2.currentScore = 6;

      const state = new State([],gameBoard,1,player1,player2, false);

      const answer = CoreLogic.determineIfWinner(state);

      expect(answer).toEqual(1);
      
    });
  });

  describe('detemine if winner', ()=>{
    it('should identify that player 2 is the winner',()=>{
      const gameBoard = new GameBoard();
      

      const player1 = new Player();
      const player2 = new Player();

      player1.currentScore = 4;
      player2.currentScore = 12;

      const state = new State([],gameBoard,-1,player1,player2, false);

      const answer = CoreLogic.determineIfWinner(state);

      expect(answer).toEqual(-1);
      
    });
  });

  describe('detemine if winner', ()=>{
    it('should identify that the game is not over yet',()=>{
      const gameBoard = new GameBoard();
      

      const player1 = new Player();
      const player2 = new Player();

      player1.currentScore = 4;
      player2.currentScore = 6;

      const state = new State([],gameBoard,1,player1,player2, false);

      const answer = CoreLogic.determineIfWinner(state);

      expect(answer).toEqual(-Infinity);
      
    });
  });

  describe('detemine valid branch indices', ()=>{
    it('should identify the indices of valid branch placements',()=>{
      const gameBoard = new GameBoard();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);

      const answer = CoreLogic.getValidBranchIndices(Owner.PLAYERONE,gameBoard);

      expect(answer).toContain(7);
      expect(answer).toContain(8);
      expect(answer).toContain(11);
      expect(answer).toContain(17);
      expect(answer).toContain(13);
      expect(answer).toContain(18);
      
    });
  });

  describe('detemine valid node indices', ()=>{
    it('should identify the indices of valid node placements',()=>{
      const gameBoard = new GameBoard();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);
      gameBoard.branches[13].setOwner(Owner.PLAYERONE);

      const answer = CoreLogic.getValidNodeIndices(Owner.PLAYERONE,gameBoard);

      
      expect(answer).toContain(8);
      expect(answer).toContain(9);
      expect(answer).toContain(10);

    });
  });

  // describe('tile exhaustion', ()=>{
  //   it('determines if the top right tile is exhausted',()=>{
  //     const gameBoard = new GameBoard();

  //     const player1 = new Player();
  //     const player2 = new Player();


  //     const state = new State([],gameBoard,1,player1,player2, false);

  //     const nodesPlaced = [];

  //   });
  // });

});
