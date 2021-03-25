/// <reference lib="webworker" />

import { AiMethods, WorkerPayload } from '../interfaces/worker.interface';
// import { AiService } from '../services/ai/ai.service';

interface PayloadWrapper {
  data: WorkerPayload
}

// const aiService: AiService;

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
  // aiService = new AiService();
  return true;
}

function getAiMove(data: WorkerPayload): string {
  // get the ol move hereabouts
  // aiService.getAIMove();
  return 'no';
}