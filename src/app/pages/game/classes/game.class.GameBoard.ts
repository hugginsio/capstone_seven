import { Tile } from './game.class.Tile';
import { Branch } from './game.class.Branch';

  export class GameBoard {
    tiles: Tile[];
    nodes: Node[];
    branches: Branch[];

    constructor() {
      this.tiles = new Array<Tile>(13);
      this.nodes = new Array<Node>(24);
      this.branches = new Array<Branch>(36);
    }
  }
  