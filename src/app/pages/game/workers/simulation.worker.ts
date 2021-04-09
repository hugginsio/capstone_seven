/// <reference lib="webworker" />

import { MCTSNode, Tree } from "../classes/ai/ai.class.MCTSNode";
import { MonteCarlo } from "../classes/ai/ai.class.MonteCarlo";
import { State } from "../classes/ai/ai.class.State";
import { AiMethods, WorkerPayload } from "../interfaces/worker.interface";
import { CoreLogic } from "../util/core-logic.util";

interface PayloadWrapper {
  data: WorkerPayload
}
let mcts:MonteCarlo;
let timeToRun:number;

addEventListener('message', ({ data }: PayloadWrapper) => {

  if(data.method === AiMethods.INIT_SERVICE){
    mcts = workerCloneMonteCarlo(data.data[0]);
    timeToRun = data.data[1];
    console.log('Initialized worker mcts');
  }
  else{

    const board = data.data[0];
    const player1 = data.data[2];
    const player2 = data.data[2];

    const newBoard = CoreLogic.workerCloneGameBoard(board);
    const newPlayer1 = CoreLogic.workerClonePlayer(player1);
    const newPlayer2 = CoreLogic.workerClonePlayer(player2);

    const newState = new State(newBoard, newPlayer1, newPlayer2);
    newState.playerNumber = data.data[4];
    newState.move = data.data[5];

    const move = mcts.findNextMove(newState,timeToRun);
      
    postMessage(move);
  }
});

function workerCloneMonteCarlo(mcts:MonteCarlo):MonteCarlo{
  const newTree = workerCloneTree(mcts.tree);
  const newMCTS = new MonteCarlo(newTree.root.state.board, newTree.root.state.player1, newTree.root.state.player2,mcts.explorationParameter); 
  return newMCTS;
}

function workerCloneTree(tree:Tree):Tree{
  const newTree = new Tree();
  newTree.setRoot(workerCloneMCTSNode(tree.root));
  return newTree;
}

function workerCloneMCTSNode(node:MCTSNode):MCTSNode{
  const newState = workerCloneState(node.state);
  const newNode = new MCTSNode(newState);
  newNode.parent = node.parent;
  if(node.childArray.length > 0){
    for(const child of node.childArray){
      newNode.childArray.push(workerCloneMCTSNode(child));
    }
  }
  return newNode;
}

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