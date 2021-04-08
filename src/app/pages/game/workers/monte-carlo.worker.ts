/// <reference lib="webworker" />

import { AiMethods, WorkerPayload } from '../interfaces/worker.interface';
import { AI } from "../classes/ai/ai.class.ai";
import { CoreLogic } from '../util/core-logic.util';
import { MonteCarlo } from '../classes/ai/ai.class.MonteCarlo';
import { State } from '../classes/ai/ai.class.State';

interface PayloadWrapper {
  data: WorkerPayload
}



let ai: AI;
let workers:Array<Worker>;
let results:Array<string>;
let currentState:State;

addEventListener('message', ({ data }: PayloadWrapper) => {
  let response: boolean | string;
  
  if (data.method === AiMethods.INIT_SERVICE) {
    response = initAiService(data);
    postMessage(response);
  } else if (data.method === AiMethods.GET_AI_MOVE) {
    startAITurn(data);
  }
  else {
    response = false;
    postMessage(response);
  }

  
});

function initAiService(data: WorkerPayload): boolean {
  const gameBoard = CoreLogic.workerCloneGameBoard(data.data[0]);
  const player1 = CoreLogic.workerClonePlayer(data.data[1]);
  const player2 = CoreLogic.workerClonePlayer(data.data[2]);
  
  ai = new AI(gameBoard,player1,player2,data.data[3]);
  const numWorkers = ai.mcts.NUMWORKERS;
  workers = [];
  for(let i = 0; i < numWorkers; i++){
    workers.push(new Worker('./simulation.worker.ts', { type: 'module' }));
    workers[i].postMessage({method:AiMethods.INIT_SERVICE,data:[ai.mcts]});
  }

  return true;
}





function startAITurn(payload:WorkerPayload){
  const board = payload.data[0];
  const player1 = payload.data[1];
  const player2 = payload.data[2];

  const newBoard = CoreLogic.workerCloneGameBoard(board);
  const newPlayer1 = CoreLogic.workerClonePlayer(player1);
  const newPlayer2 = CoreLogic.workerClonePlayer(player2);

  currentState = new State(newBoard, newPlayer1, newPlayer2);
  currentState.playerNumber = payload.data[3];
  currentState.move = payload.data[4];

  results = [];
  const numWorkers = ai.mcts.NUMWORKERS;
  for(let i = 0; i < numWorkers; i++){
    workers[i].onmessage = ({data})=>{
      let response;
      const numWorkers = ai.mcts.NUMWORKERS;
      results.push(data[0]);
      if(results.length === numWorkers){
        response = getBestMove(results);
        postMessage(response);
      }
    };
    workers[i].postMessage({method:AiMethods.GET_AI_MOVE, data:[board,player1,player2,payload.data[3],payload.data[4]]});
  }
}

function getBestMove(moves:string[]):string{
  console.log(moves);
  const len = moves.length;
  const firstMoveState = currentState.cloneState();
  firstMoveState.applyMove(moves[0]);
  let maxScore = Math.abs(firstMoveState.getHeuristicValue());
  let maxMove = moves[0];

  for(let i = 1; i < len; i++){
    const moveState = currentState.cloneState();
    moveState.applyMove(moves[i]);
    const score = Math.abs(moveState.getHeuristicValue());
    if(score >= maxScore){
      maxScore = score;
      maxMove = moves[i];
    }
  }
  return maxMove;
}














