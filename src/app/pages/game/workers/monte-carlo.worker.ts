/// <reference lib="webworker" />

import { AiMethods, WorkerPayload } from '../interfaces/worker.interface';
import { AI } from "../classes/ai/ai.class.ai";
import { CoreLogic } from '../util/core-logic.util';

interface PayloadWrapper {
  data: WorkerPayload
}

let ai: AI;

addEventListener('message', ({ data }: PayloadWrapper) => {
  let response: boolean | string;
  if (data.method === AiMethods.INIT_SERVICE) {
    response = initAiService(data);
  } else if (data.method === AiMethods.GET_AI_MOVE) {
    response = getAiMove(data);
  } else {
    response = false;
  }

  postMessage(response);
});

function initAiService(data: WorkerPayload): boolean {
  const gameBoard = CoreLogic.workerCloneGameBoard(data.data[0]);
  const player1 = CoreLogic.workerClonePlayer(data.data[1]);
  const player2 = CoreLogic.workerClonePlayer(data.data[2]);

  ai = new AI(gameBoard, player1, player2, data.data[3]);
  return true;
}

function getAiMove(data: WorkerPayload): string {
  // get the ol move hereabouts
  const gameBoard = CoreLogic.workerCloneGameBoard(data.data[0]);
  const player1 = CoreLogic.workerClonePlayer(data.data[1]);
  const player2 = CoreLogic.workerClonePlayer(data.data[2]);
  return ai.getAIMove(gameBoard, player1, player2, data.data[3], data.data[4]);

}
