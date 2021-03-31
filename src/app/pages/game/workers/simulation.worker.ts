/// <reference lib="webworker" />

import { State } from "../classes/ai/ai.class.State";
import { CoreLogic } from "../util/core-logic.util";

interface PayloadWrapper {
    data: State
  }


addEventListener('message', ({ data }: PayloadWrapper) => {

    const clonedState = workerCloneState(data);
    const response = runSimulation(clonedState);
    
    postMessage(response);
});


function workerCloneState(state:State):State{

    const newBoard = CoreLogic.workerCloneGameBoard(state.board);
    const newPlayer1 = CoreLogic.workerClonePlayer(state.player1);
    const newPlayer2 = CoreLogic.workerClonePlayer(state.player2);

    const newState = new State(newBoard, newPlayer1, newPlayer2);

    newState.move = state.move;
    newState.playerNumber = state.playerNumber;
    newState.visitCount = state.visitCount;
    newState.winScore = state.winScore;
    newState.tilesBeingChecked = state.tilesBeingChecked.slice();

    return newState;
  }


function runSimulation(state:State):number{
    let boardStatus = 0;
    let counter = 0; //decrease counter and assign winner based on score if game not finished
    while (boardStatus === 0 && counter < 15) {
      if(state.player1.numNodesPlaced === 1 && state.playerNumber === 1){
        state.player1.redResources = 1;
        state.player1.blueResources = 1;
        state.player1.greenResources = 2;
        state.player1.yellowResources = 2;
      }
      state.randomPlay();
      //state.heuristicPlay();
      boardStatus = CoreLogic.getWinner(state);
      state.togglePlayer();
      //console.log(`Inside simulation: count = ${counter}`);
      counter++;
    }

    if(boardStatus === 0){
      if(state.getHeuristicValue() > 0){
        boardStatus = 1;
      }
      else{
        boardStatus = 2;
      }
    }

    
    return boardStatus;
}