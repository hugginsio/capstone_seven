/// <reference lib="webworker" />

import { AiMethods, WorkerPayload } from '../interfaces/worker.interface';
import { AI } from "../classes/ai/ai.class.ai";
import { CoreLogic } from '../util/core-logic.util';
import { State } from '../classes/ai/ai.class.State';

interface PayloadWrapper {
  data: WorkerPayload
}



let ai: AI;
let workers:Array<Worker>;
let currentState:State;
let start:number;

addEventListener('message', ({ data }: PayloadWrapper) => {
  let response: boolean | string;
  
  if (data.method === AiMethods.INIT_SERVICE) {
    response = initAiService(data);
    postMessage(response);
  } else if (data.method === AiMethods.GET_AI_MOVE) {
    start = Date.now();
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
    workers[i].postMessage({method:AiMethods.INIT_SERVICE,data:[ai.mcts,data.data[4]]});
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

  const promises = [];
  const numWorkers = ai.mcts.NUMWORKERS;
  for(let i = 0; i < numWorkers; i++){
    promises.push(new Promise((resolve)=>{
      workers[i].postMessage({method:AiMethods.GET_AI_MOVE, data:[board,player1,player2,payload.data[3],payload.data[4]]});
      workers[i].onmessage = ({data})=>{
        resolve(data);
      };
    }));

    //workers[i].postMessage({method:AiMethods.GET_AI_MOVE, data:[board,player1,player2,payload.data[3],payload.data[4]]});
  }

  Promise.all(promises).then((data) =>{
    console.log('inside promise');
    
    
    const response = getBestMove(data as string[]);
    console.warn(`AI Time = ${Date.now() - start}ms`);
    postMessage(response);
  });
}

function getBestMove(moves:string[]):string{
  console.log(moves);
  const scores = [];
  const len = moves.length;
  const firstMoveState = currentState.cloneState();
  firstMoveState.togglePlayer();
  firstMoveState.applyMove(moves[0]);
  firstMoveState.move = moves[0];
  let maxScore = firstMoveState.getHeuristicValue();
  let maxMove = moves[0];
  scores.push(maxScore);
  for(let i = 1; i < len; i++){
    const moveState = currentState.cloneState();
    moveState.togglePlayer();
    moveState.applyMove(moves[i]);
    moveState.move = moves[i];

    const score = moveState.getHeuristicValue();
    scores.push(score);
    if(moveState.playerNumber === 1){
      if(score >= maxScore){
        maxScore = score;
        maxMove = moves[i];
      }
    }
    else{
      if(score <= maxScore){
        maxScore = score;
        maxMove = moves[i];
      }
    }
  }
  console.log(scores);
  return maxMove;
}
