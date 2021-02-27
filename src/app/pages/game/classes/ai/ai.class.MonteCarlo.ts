import { GameBoard } from '../gamecore/game.class.GameBoard';
import { MCTSNode } from './ai.class.MCTSNode';
import { State } from './ai.class.State';
import { CoreLogic } from '../../util/core-logic.util';
import { state } from '@angular/animations';

interface GameStatistics {
  runtime: number,
  simulations: number
}


export class MonteCarlo {
  
}