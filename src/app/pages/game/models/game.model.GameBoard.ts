import { Tile } from './game.model.Tile';
import { Branch } from './game.model.Branch';

  export interface GameBoard {
    tiles: Tile[],
    nodes: Node[],
    branches: Branch[]
  }
  