/// <reference lib="webworker" />

import { AiMethods, WorkerPayload } from '../interfaces/worker.interface';
import { AI } from "../classes/ai/ai.class.ai";

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
  console.log(data);
  //ai = new AI();
  return true;
}

function getAiMove(data: WorkerPayload): string {
  // get the ol move hereabouts
  // ai.getAIMove();
  return 'no';
}