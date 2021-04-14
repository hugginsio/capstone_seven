export enum AiMethods {
  INIT_SERVICE,
  GET_AI_MOVE,
  RETURN_AI_MOVE,
}

export interface WorkerPayload {
  method: AiMethods;
  data: Array<any>;
}
