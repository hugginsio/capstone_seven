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

  describe('string to move empty', ()=>{
    it('should convert a string representation of a move to an object',()=>{
      const answer = CoreLogic.stringToMove(';;');
      expect(answer).toEqual({tradedIn:[],received:'',nodesPlaced:[],branchesPlaced:[]});
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
  describe('check for 0 captures', ()=>{
    it('should identify that no tile has been captured',()=>{
      const gameBoard = new GameBoard();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);
      gameBoard.branches[13].setOwner(Owner.PLAYERONE);
      gameBoard.nodes[9].setOwner(Owner.PLAYERONE);
      gameBoard.branches[19].setOwner(Owner.PLAYERTWO);
      gameBoard.branches[8].setOwner(Owner.PLAYERONE);
      gameBoard.branches[18].setOwner(Owner.PLAYERONE);

      const player1 = new Player();
      const player2 = new Player();
      
      const state = new State([],gameBoard,1,player1,player2, false);


      const answer = CoreLogic.checkForCaptures(state,state.player1, 12); 
      expect(answer).toBeFalse();  
      
      
      
    });
  });

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

      const answer = CoreLogic.checkForCaptures(state,state.player1,6);

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

      const answer1 = CoreLogic.checkForCaptures(state,state.player1,6);
      const answer2 = CoreLogic.checkForCaptures(state,state.player1,7);

      expect(answer1).toBeTrue();
      expect(answer2).toBeTrue();
      
    });
  });

  describe('check for longest network', ()=>{
    it('should identify that player 1 has the longest network',()=>{
      const gameBoard = new GameBoard();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);

      gameBoard.branches[13].setOwner(Owner.PLAYERONE);
      gameBoard.branches[19].setOwner(Owner.PLAYERONE);
      gameBoard.branches[23].setOwner(Owner.PLAYERONE);
      gameBoard.branches[28].setOwner(Owner.PLAYERONE);

      gameBoard.branches[17].setOwner(Owner.PLAYERTWO);
      gameBoard.branches[22].setOwner(Owner.PLAYERTWO);
      gameBoard.branches[29].setOwner(Owner.PLAYERTWO);

      const player1 = new Player();
      const player2 = new Player();
      
      player1.ownedBranches.push(12);
      player1.ownedBranches.push(13);
      player1.ownedBranches.push(19);
      player1.ownedBranches.push(23);
      player1.ownedBranches.push(28);

      player2.ownedBranches.push(17);
      player2.ownedBranches.push(22);
      player2.ownedBranches.push(29);



      const state = new State([],gameBoard,1,player1,player2, false);

      const affectedPlayer = state.player1;

      for (let i = 0; i < state.player1.ownedBranches.length; i++) {
        state.player1.currentLength = 0;
        CoreLogic.checkForLongest(state,affectedPlayer, affectedPlayer.ownedBranches[i]);
      }


    
      if ((state.player1.currentLongest > state.player2.currentLongest) && state.player1.hasLongestNetwork === false) {
        state.player1.hasLongestNetwork = true;
        state.player1.currentScore += 2;
        if (state.player2.hasLongestNetwork === true) {
          state.player2.hasLongestNetwork = false;
          state.player2.currentScore -= 2;
        }
      }
  
      else if ((state.player2.currentLongest > state.player1.currentLongest) && state.player2.hasLongestNetwork === false) {
        state.player2.hasLongestNetwork = true;
        state.player2.currentScore += 2;
        if (state.player1.hasLongestNetwork === true) {
          state.player1.hasLongestNetwork = false;
          state.player1.currentScore -= 2;
        }
      }
      else if(state.player1.currentLongest === state.player2.currentLongest){
        if(state.player1.hasLongestNetwork){
          state.player1.hasLongestNetwork = false;
          state.player1.currentScore -= 2;
        }
        if(state.player2.hasLongestNetwork){
          state.player2.hasLongestNetwork = false;
          state.player2.currentScore -= 2;
        }
      }
      

      expect(state.player1.hasLongestNetwork).toBeTrue();
      expect(state.player1.currentLongest).toEqual(3);
      console.log(state.player1.ownedBranches);
      
    });
  });

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

      expect(answer).toEqual(0);
      
    });
  });

  describe('detemine valid branch indices', ()=>{
    it('should identify the indices of valid branch placements',()=>{
      const gameBoard = new GameBoard();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);
      const player1 = new Player();
      const player2 = new Player();
      const state = new State([],gameBoard,1,player1,player2,true);

      const answer = CoreLogic.getValidBranchIndices(state,Owner.PLAYERONE,gameBoard);

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

  describe('Apply move', ()=>{
    it('should apply move string to current state',()=>{
      console.log('Apply Move');

      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);
      gameBoard.branches[13].setOwner(Owner.PLAYERONE);
      gameBoard.nodes[9].setOwner(Owner.PLAYERONE);
      gameBoard.branches[19].setOwner(Owner.PLAYERTWO);

      const player1 = new Player();
      const player2 = new Player();

      // player1.redPerTurn = 2;
      // player1.bluePerTurn = 2;
      // player1.greenPerTurn = 2;
      // player2.yellowPerTurn = 2;

      player1.redResources = 1;
      player1.blueResources = 2;
      player1.greenResources = 2;
      player1.yellowResources = 5;

      player1.ownedBranches = [12,13,9];

      player1.currentScore++;

      const moveString = 'Y,Y,Y,R;8;8,18';

      const state = new State(['','','',''],gameBoard,1,player1,player2,false);

      CoreLogic.applyMove(moveString,state,state.player1,Owner.PLAYERONE);

      expect(state.gameBoard.nodes[8].getOwner()).toEqual(Owner.PLAYERONE);
      expect(state.gameBoard.branches[8].getOwner()).toEqual(Owner.PLAYERONE);
      expect(state.gameBoard.branches[18].getOwner()).toEqual(Owner.PLAYERONE);
      expect(state.player1.currentScore).toEqual(4);
      expect(state.player1.numTilesCaptured).toEqual(0);
      console.log(state.player1.redPerTurn,state.player1.bluePerTurn,state.player1.greenPerTurn,state.player1.yellowPerTurn);

      
    });
  });

  describe('Apply move with capture and longest network', ()=>{
    it('should apply move string to current state',()=>{
      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();
      gameBoard.branches[12].setOwner(Owner.PLAYERONE);
      gameBoard.branches[13].setOwner(Owner.PLAYERONE);
      gameBoard.branches[23].setOwner(Owner.PLAYERONE);
      gameBoard.branches[18].setOwner(Owner.PLAYERONE);

      
      gameBoard.nodes[9].setOwner(Owner.PLAYERONE);
      gameBoard.branches[19].setOwner(Owner.PLAYERTWO);

      const player1 = new Player();
      const player2 = new Player();

      player1.redPerTurn = 2;
      player1.bluePerTurn = 2;
      player1.greenPerTurn = 2;
      player2.yellowPerTurn = 2;

      player1.redResources = 1;
      player1.blueResources = 2;
      player1.greenResources = 2;
      player2.yellowResources = 5;

      player1.ownedBranches = [12,13,18,23];

      player1.currentScore++;

      const moveString = 'Y,Y,Y,R;8;8,17';

      const state = new State([],gameBoard,1,player1,player2,false);

      CoreLogic.applyMove(moveString,state,state.player1,Owner.PLAYERONE);

      expect(state.gameBoard.nodes[8].getOwner()).toEqual(Owner.PLAYERONE);
      expect(state.gameBoard.branches[8].getOwner()).toEqual(Owner.PLAYERONE);
      expect(state.gameBoard.branches[18].getOwner()).toEqual(Owner.PLAYERONE);
      expect(state.player1.currentScore).toEqual(5);
      expect(state.player1.numTilesCaptured).toEqual(1);
      expect(state.player1.hasLongestNetwork).toBeTrue();
      expect(state.player1.currentLongest).toEqual(6);


      
    });
  });

  describe('Next State Initial Moves', ()=>{
    it('should progress the state through the four initial moves',()=>{
      console.log('Next State Initital Moves');
      const gameBoard = new GameBoard();
      const player1 = new Player();
      const player2 = new Player();

      const turn1 = new State([],gameBoard,1,player1,player2,true);
      const firstMoveString = ';9;18';

      const turn2 = CoreLogic.nextState(turn1,firstMoveString);

      expect(turn2.gameBoard.nodes[9].getOwner()).toEqual(Owner.PLAYERONE);
      expect(turn2.gameBoard.branches[18].getOwner()).toEqual(Owner.PLAYERONE);
      expect(turn2.currentPlayer).toEqual(-1);

      const secondMoveString = ';14;23';

      const turn3 = CoreLogic.nextState(turn2,secondMoveString);

      expect(turn3.gameBoard.nodes[14].getOwner()).toEqual(Owner.PLAYERTWO);
      expect(turn3.gameBoard.branches[23].getOwner()).toEqual(Owner.PLAYERTWO);
      expect(turn3.currentPlayer).toEqual(-1);

      const thirdMoveString = ';4;4';

      const turn4 = CoreLogic.nextState(turn3,thirdMoveString);

      expect(turn4.gameBoard.nodes[4].getOwner()).toEqual(Owner.PLAYERTWO);
      expect(turn4.gameBoard.branches[4].getOwner()).toEqual(Owner.PLAYERTWO);
      expect(turn4.currentPlayer).toEqual(1);

      const fourthMoveString = ';16;24';

      const afterFinalInitialTurn = CoreLogic.nextState(turn4,fourthMoveString);

      //console.log(afterFinalInitialTurn.player1.ownedBranches);
      //console.log(afterFinalInitialTurn.gameBoard.branches[18].getOwner());
      //console.log(afterFinalInitialTurn.gameBoard.branches[24].getOwner());

      expect(afterFinalInitialTurn.gameBoard.nodes[16].getOwner()).toEqual(Owner.PLAYERONE);
      expect(afterFinalInitialTurn.gameBoard.branches[24].getOwner()).toEqual(Owner.PLAYERONE);
      expect(afterFinalInitialTurn.currentPlayer).toEqual(-1);
      expect(afterFinalInitialTurn.inInitialMoves).toBeFalse();
      expect(afterFinalInitialTurn.player1.hasLongestNetwork).toBeTrue();
      expect(afterFinalInitialTurn.player1.currentLongest).toEqual(2);
      expect(afterFinalInitialTurn.player2.currentLongest).toEqual(1);


      console.log(player1);
      console.log(afterFinalInitialTurn.player1);
      console.log(player2);
      console.log(afterFinalInitialTurn.player2);


    });
  });

  describe('Next State conventional moves', ()=>{
    it('should progress the state through conventional moves',()=>{

      const gameBoard = new GameBoard();
      const player1 = new Player();
      const player2 = new Player();

      player1.redResources = 2;
      player1.blueResources = 1;
      player1.greenResources = 3;
      player1.yellowResources = 4;
      //const startTime = Date.now();

      const start = new State(['G,Y,Y,B;9;18,28','G,Y,Y,B;9;18,28','G,Y,Y,B;9;18,28','G,Y,Y,B;9;18,28'],gameBoard,1,player1,player2,false);
      const firstMoveString = 'G,Y,Y,B;9;18,28';

      const turn1 = CoreLogic.nextState(start,firstMoveString);

      expect(turn1.gameBoard.nodes[9].getOwner()).toEqual(Owner.PLAYERONE);
      expect(turn1.gameBoard.branches[18].getOwner()).toEqual(Owner.PLAYERONE);
      expect(turn1.gameBoard.branches[28].getOwner()).toEqual(Owner.PLAYERONE);
      expect(turn1.currentPlayer).toEqual(-1);
      expect(turn1.player1.ownedBranches).toContain(18);
      

      turn1.player2.redResources = 2;
      turn1.player2.blueResources = 1;
      turn1.player2.greenResources = 4;
      turn1.player2.yellowResources = 1;

      const secondMoveString = 'G,G,R,Y;14;23';

      const turn2 = CoreLogic.nextState(turn1,secondMoveString);
      //const endTime = Date.now() - startTime;
      //console.log('next state',endTime);

      expect(turn2.gameBoard.nodes[14].getOwner()).toEqual(Owner.PLAYERTWO);
      expect(turn2.gameBoard.branches[23].getOwner()).toEqual(Owner.PLAYERTWO);
      expect(turn2.currentPlayer).toEqual(1);

      console.log(player1);
      console.log(turn1.player1);
      console.log(turn2.player1);

      console.log(player2);
      console.log(turn1.player2);
      console.log(turn2.player2);

    });
  });

  describe('Get legal moves for initial turn', ()=>{
    it('should get all legal moves for the first turn',()=>{

      const gameBoard = new GameBoard();
      const player1 = new Player();
      const player2 = new Player();

      const state = new State([],gameBoard,1,player1,player2,true);

      const start = Date.now();
      const moves = CoreLogic.getLegalMoves(state);
      console.log(`TIME: ${Date.now() - start}`);
      console.log(moves);


    });
  });

  describe('Get legal moves for initial turn 2', ()=>{
    it('should get all legal moves for the second turn',()=>{

      const gameBoard = new GameBoard();
      const player1 = new Player();
      const player2 = new Player();
      gameBoard.nodes[3].setOwner(Owner.PLAYERONE);
      gameBoard.branches[4].setOwner(Owner.PLAYERONE);


      const state = new State([],gameBoard,-1,player1,player2,true);

      const moves = CoreLogic.getLegalMoves(state);
      //console.log(moves);


    });
  });

  describe('Get legal moves for regular turn', ()=>{
    it('should get all legal moves for a regular turn',()=>{

      const gameBoard = new GameBoard();
      const player1 = new Player();
      const player2 = new Player();
      gameBoard.nodes[3].setOwner(Owner.PLAYERONE);
      gameBoard.branches[4].setOwner(Owner.PLAYERONE);

      gameBoard.nodes[8].setOwner(Owner.PLAYERTWO);
      gameBoard.branches[12].setOwner(Owner.PLAYERTWO);
      gameBoard.nodes[14].setOwner(Owner.PLAYERTWO);
      gameBoard.branches[17].setOwner(Owner.PLAYERTWO);

      gameBoard.nodes[15].setOwner(Owner.PLAYERONE);
      gameBoard.branches[24].setOwner(Owner.PLAYERONE);

      player2.redResources = 2;
      player2.blueResources = 2;
      player2.greenResources = 4;
      player2.yellowResources = 1;

      const state = new State([],gameBoard,-1,player1,player2,false);

      const start = Date.now();

      const moves = CoreLogic.getLegalMoves(state);
      //console.log(moves);
      //console.log(moves.length);
      const end = Date.now() - start;
      console.log('get moves',end);

    });
  });

  describe('Get starting state', ()=>{
    it('should set and return the state for the start of the game',()=>{

      const gameBoard = new GameBoard();
      const player1 = new Player();
      const player2 = new Player();

      const startingState = CoreLogic.getStartingState(player1,player2,gameBoard,1);

      //console.log(startingState);
    });
  });

  describe('Clone GameBoard', ()=>{
    it('should Clone the gameboard',()=>{

      const gameBoard = new GameBoard();
      gameBoard.randomizeColorsAndMaxNodes();

      // const clonedGameBoard = CoreLogic.cloneGameBoard(gameBoard);

      // gameBoard.nodes[0].setOwner(Owner.PLAYERONE);

      // expect(gameBoard.nodes[0]).not.toEqual(clonedGameBoard.nodes[0]);
      // expect(gameBoard.nodes[1]).toEqual(clonedGameBoard.nodes[1]);


      // console.log(gameBoard.nodes);
      // console.log(clonedGameBoard.nodes);

      //console.log(startingState);
    });
  });

});
