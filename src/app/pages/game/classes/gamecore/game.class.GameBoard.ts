import { Tile } from './game.class.Tile';
import { Branch } from './game.class.Branch';
import { Node } from './game.class.Node';
import { TileColor} from '../../enums/game.enums';

export class GameBoard {
  tiles: Tile[];
  nodes: Node[];
  branches: Branch[];


  randomizeColorsAndMaxNodes(): void { 
    const tileColorsAndMax = this.getTileColorsAndMax();
    this.shuffleArray(tileColorsAndMax);
    
    for (let i = 0; i < 13; i++) {
      this.tiles[i].color = tileColorsAndMax[i].color;
      this.tiles[i].maxNodes = tileColorsAndMax[i].maxNodes;
    }
  }

  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  shuffleArray(array: Array<any>): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  getTileColorsAndMax(): Array<Tile>{
    const colorTilesAndMax = Array<Tile>(13);

    colorTilesAndMax[0].maxNodes = 1;
    colorTilesAndMax[0].color = TileColor.RED;

    colorTilesAndMax[1].maxNodes = 2;
    colorTilesAndMax[1].color = TileColor.RED;

    colorTilesAndMax[2].maxNodes = 3;
    colorTilesAndMax[2].color = TileColor.RED;

    //

    colorTilesAndMax[3].maxNodes = 1;
    colorTilesAndMax[3].color = TileColor.BLUE;

    colorTilesAndMax[4].maxNodes = 2;
    colorTilesAndMax[4].color = TileColor.BLUE;

    colorTilesAndMax[5].maxNodes = 3;
    colorTilesAndMax[5].color = TileColor.BLUE;

    //

    colorTilesAndMax[6].maxNodes = 1;
    colorTilesAndMax[6].color = TileColor.GREEN;

    colorTilesAndMax[7].maxNodes = 2;
    colorTilesAndMax[7].color = TileColor.GREEN;

    colorTilesAndMax[8].maxNodes = 3;
    colorTilesAndMax[8].color = TileColor.GREEN;

    //

    colorTilesAndMax[9].maxNodes = 1;
    colorTilesAndMax[9].color = TileColor.YELLOW;

    colorTilesAndMax[10].maxNodes = 2;
    colorTilesAndMax[10].color = TileColor.YELLOW;

    colorTilesAndMax[11].maxNodes = 3;
    colorTilesAndMax[11].color = TileColor.YELLOW;

    //
      
    colorTilesAndMax[12].maxNodes = 0;
    colorTilesAndMax[12].color = TileColor.BLANK;

    return colorTilesAndMax;
  }

  constructor() {
    this.tiles = new Array<Tile>(13);
    this.nodes = new Array<Node>(24);
    this.branches = new Array<Branch>(36);

    for (let i = 0; i < 36; i++) {
      this.branches[i] = new Branch();
    }

    for (let i = 0; i < 24; i++) {
      this.nodes[i] = new Node();
    }
      
    for (let i = 0; i < 13; i++) {
      this.tiles[i] = new Tile();
    }

    /* BRANCHES - HARD CODED RELATIONSHIPS
      /
      /
      /
      */

    this.branches[0].setBranch('branch3', 2);
    this.branches[0].setBranch('branch4', 1);

    this.branches[1].setBranch('branch2', 0);
    this.branches[1].setBranch('branch3', 4);
    this.branches[1].setBranch('branch4', 7);
    this.branches[1].setBranch('branch5', 3);

    this.branches[2].setBranch('branch3', 5);
    this.branches[2].setBranch('branch4', 8);
    this.branches[2].setBranch('branch5', 4);
    this.branches[2].setBranch('branch6', 0);
      
    this.branches[3].setBranch('branch1', 1);
    this.branches[3].setBranch('branch2', 4);
    this.branches[3].setBranch('branch3', 7);
    this.branches[3].setBranch('branch4', 6);

    this.branches[4].setBranch('branch1', 2);
    this.branches[4].setBranch('branch2', 5);
    this.branches[4].setBranch('branch3', 8);
    this.branches[4].setBranch('branch4', 7);
    this.branches[4].setBranch('branch5', 3);
    this.branches[4].setBranch('branch6', 1);

    this.branches[5].setBranch('branch3', 9);
    this.branches[5].setBranch('branch4', 8);
    this.branches[5].setBranch('branch5', 4);
    this.branches[5].setBranch('branch6', 2);
      
    this.branches[6].setBranch('branch2', 3);
    this.branches[6].setBranch('branch3', 11);
    this.branches[6].setBranch('branch4', 16);
    this.branches[6].setBranch('branch5', 10);

    this.branches[7].setBranch('branch1', 1);
    this.branches[7].setBranch('branch2', 4);
    this.branches[7].setBranch('branch3', 12);
    this.branches[7].setBranch('branch4', 17);
    this.branches[7].setBranch('branch5', 11);
    this.branches[7].setBranch('branch6', 3);

    this.branches[8].setBranch('branch1', 2);
    this.branches[8].setBranch('branch2', 5);
    this.branches[8].setBranch('branch3', 13);
    this.branches[8].setBranch('branch4', 18);
    this.branches[8].setBranch('branch5', 12);
    this.branches[8].setBranch('branch6', 4);

    this.branches[9].setBranch('branch3', 14);
    this.branches[9].setBranch('branch4', 19);
    this.branches[9].setBranch('branch5', 13);
    this.branches[9].setBranch('branch6', 5);
      
    this.branches[10].setBranch('branch1', 6);
    this.branches[10].setBranch('branch2', 11);
    this.branches[10].setBranch('branch3', 16);
    this.branches[10].setBranch('branch4', 15);

    this.branches[11].setBranch('branch1', 7);
    this.branches[11].setBranch('branch2', 12);
    this.branches[11].setBranch('branch3', 17);
    this.branches[11].setBranch('branch4', 16);
    this.branches[11].setBranch('branch5', 10);
    this.branches[11].setBranch('branch6', 6);

    this.branches[12].setBranch('branch1', 8);
    this.branches[12].setBranch('branch2', 13);
    this.branches[12].setBranch('branch3', 18);
    this.branches[12].setBranch('branch4', 17);
    this.branches[12].setBranch('branch5', 11);
    this.branches[12].setBranch('branch6', 7);

    this.branches[13].setBranch('branch1', 9);
    this.branches[13].setBranch('branch2', 14);
    this.branches[13].setBranch('branch3', 19);
    this.branches[13].setBranch('branch4', 18);
    this.branches[13].setBranch('branch5', 12);
    this.branches[13].setBranch('branch6', 8);

    this.branches[14].setBranch('branch3', 20);
    this.branches[14].setBranch('branch4', 19);
    this.branches[14].setBranch('branch5', 13);
    this.branches[14].setBranch('branch6', 9);

    this.branches[15].setBranch('branch2', 10);
    this.branches[15].setBranch('branch3', 21);

    this.branches[16].setBranch('branch1', 6);
    this.branches[16].setBranch('branch2', 11);
    this.branches[16].setBranch('branch3', 22);
    this.branches[16].setBranch('branch4', 26);
    this.branches[16].setBranch('branch5', 21);
    this.branches[16].setBranch('branch6', 10);
      
    this.branches[17].setBranch('branch1', 7);
    this.branches[17].setBranch('branch2', 12);
    this.branches[17].setBranch('branch3', 23);
    this.branches[17].setBranch('branch4', 27);
    this.branches[17].setBranch('branch5', 22);
    this.branches[17].setBranch('branch6', 11);
      
    this.branches[18].setBranch('branch1', 8);
    this.branches[18].setBranch('branch2', 13);
    this.branches[18].setBranch('branch3', 24);
    this.branches[18].setBranch('branch4', 28);
    this.branches[18].setBranch('branch5', 23);
    this.branches[18].setBranch('branch6', 12);

    this.branches[19].setBranch('branch1', 9);
    this.branches[19].setBranch('branch2', 14);
    this.branches[19].setBranch('branch3', 25);
    this.branches[19].setBranch('branch4', 29);
    this.branches[19].setBranch('branch5', 24);
    this.branches[19].setBranch('branch6', 13);
      
    this.branches[20].setBranch('branch5', 25);
    this.branches[20].setBranch('branch6', 14);
      
    this.branches[21].setBranch('branch1', 16);
    this.branches[21].setBranch('branch2', 22);
    this.branches[21].setBranch('branch3', 26);
    this.branches[21].setBranch('branch6', 15);

    this.branches[22].setBranch('branch1', 17);
    this.branches[22].setBranch('branch2', 23);
    this.branches[22].setBranch('branch3', 27);
    this.branches[22].setBranch('branch4', 26);
    this.branches[22].setBranch('branch5', 21);
    this.branches[22].setBranch('branch6', 16);
      
    this.branches[23].setBranch('branch1', 18);
    this.branches[23].setBranch('branch2', 24);
    this.branches[23].setBranch('branch3', 28);
    this.branches[23].setBranch('branch4', 27);
    this.branches[23].setBranch('branch5', 22);
    this.branches[23].setBranch('branch6', 17);
      
    this.branches[24].setBranch('branch1', 19);
    this.branches[24].setBranch('branch2', 25);
    this.branches[24].setBranch('branch3', 29);
    this.branches[24].setBranch('branch4', 28);
    this.branches[24].setBranch('branch5', 23);
    this.branches[24].setBranch('branch6', 18);
      
    this.branches[25].setBranch('branch1', 20);
    this.branches[25].setBranch('branch4', 29);
    this.branches[25].setBranch('branch5', 24);
    this.branches[25].setBranch('branch6', 19);
      
    this.branches[26].setBranch('branch1', 16);
    this.branches[26].setBranch('branch2', 22);
    this.branches[26].setBranch('branch3', 30);
    this.branches[26].setBranch('branch6', 21);
      
    this.branches[27].setBranch('branch1', 17);
    this.branches[27].setBranch('branch2', 23);
    this.branches[27].setBranch('branch3', 31);
    this.branches[27].setBranch('branch4', 33);
    this.branches[27].setBranch('branch5', 30);
    this.branches[27].setBranch('branch6', 22);
      
    this.branches[28].setBranch('branch1', 18);
    this.branches[28].setBranch('branch2', 24);
    this.branches[28].setBranch('branch3', 32);
    this.branches[28].setBranch('branch4', 34);
    this.branches[28].setBranch('branch5', 31);
    this.branches[28].setBranch('branch6', 23);

    this.branches[29].setBranch('branch1', 19);
    this.branches[29].setBranch('branch2', 25);
    this.branches[29].setBranch('branch5', 32);
    this.branches[29].setBranch('branch6', 24);
      
    this.branches[30].setBranch('branch1', 27);
    this.branches[30].setBranch('branch2', 31);
    this.branches[30].setBranch('branch3', 33);
    this.branches[30].setBranch('branch6', 26);
      
    this.branches[31].setBranch('branch1', 28);
    this.branches[31].setBranch('branch2', 32);
    this.branches[31].setBranch('branch3', 34);
    this.branches[31].setBranch('branch4', 33);
    this.branches[31].setBranch('branch5', 30);
    this.branches[31].setBranch('branch6', 27);

    this.branches[32].setBranch('branch1', 29);
    this.branches[32].setBranch('branch4', 34);
    this.branches[32].setBranch('branch5', 31);
    this.branches[32].setBranch('branch6', 28);
      
    this.branches[33].setBranch('branch1', 27);
    this.branches[33].setBranch('branch2', 31);
    this.branches[33].setBranch('branch3', 35);
    this.branches[33].setBranch('branch6', 30);
      
    this.branches[34].setBranch('branch1', 28);
    this.branches[34].setBranch('branch2', 32);
    this.branches[34].setBranch('branch5', 35);
    this.branches[34].setBranch('branch6', 31);
      
    this.branches[35].setBranch('branch1', 34);
    this.branches[35].setBranch('branch6', 33);

    /* TILES - HARD CODED RELATIONSHIPS
      /
      /
      /
      */

    this.tiles[0].setTopLeftNode(0);
    this.tiles[0].setTopRightNode(1);
    this.tiles[0].setBottomLeftNode(3);
    this.tiles[0].setBottomRightNode(4);
    this.tiles[0].setTopBranch(0);
    this.tiles[0].setRightBranch(2);
    this.tiles[0].setBottomBranch(4);
    this.tiles[0].setLeftBranch(1);

    this.tiles[1].setTopLeftNode(2);
    this.tiles[1].setTopRightNode(3);
    this.tiles[1].setBottomLeftNode(7);
    this.tiles[1].setBottomRightNode(8);
    this.tiles[1].setTopBranch(3);
    this.tiles[1].setRightBranch(7);
    this.tiles[1].setBottomBranch(11);
    this.tiles[1].setLeftBranch(6);

    this.tiles[2].setTopLeftNode(3);
    this.tiles[2].setTopRightNode(4);
    this.tiles[2].setBottomLeftNode(8);
    this.tiles[2].setBottomRightNode(9);
    this.tiles[2].setTopBranch(4);
    this.tiles[2].setRightBranch(8);
    this.tiles[2].setBottomBranch(12);
    this.tiles[2].setLeftBranch(7);

    this.tiles[3].setTopLeftNode(4);
    this.tiles[3].setTopRightNode(5);
    this.tiles[3].setBottomLeftNode(9);
    this.tiles[3].setBottomRightNode(10);
    this.tiles[3].setTopBranch(5);
    this.tiles[3].setRightBranch(9);
    this.tiles[3].setBottomBranch(13);
    this.tiles[3].setLeftBranch(8);

    this.tiles[4].setTopLeftNode(6);
    this.tiles[4].setTopRightNode(7);
    this.tiles[4].setBottomLeftNode(12);
    this.tiles[4].setBottomRightNode(13);
    this.tiles[4].setTopBranch(10);
    this.tiles[4].setRightBranch(16);
    this.tiles[4].setBottomBranch(21);
    this.tiles[4].setLeftBranch(15);

    this.tiles[5].setTopLeftNode(7);
    this.tiles[5].setTopRightNode(8);
    this.tiles[5].setBottomLeftNode(13);
    this.tiles[5].setBottomRightNode(14);
    this.tiles[5].setTopBranch(11);
    this.tiles[5].setRightBranch(17);
    this.tiles[5].setBottomBranch(22);
    this.tiles[5].setLeftBranch(16);

    this.tiles[6].setTopLeftNode(8);
    this.tiles[6].setTopRightNode(9);
    this.tiles[6].setBottomLeftNode(14);
    this.tiles[6].setBottomRightNode(15);
    this.tiles[6].setTopBranch(12);
    this.tiles[6].setRightBranch(18);
    this.tiles[6].setBottomBranch(23);
    this.tiles[6].setLeftBranch(17);

    this.tiles[7].setTopLeftNode(9);
    this.tiles[7].setTopRightNode(10);
    this.tiles[7].setBottomLeftNode(15);
    this.tiles[7].setBottomRightNode(16);
    this.tiles[7].setTopBranch(13);
    this.tiles[7].setRightBranch(19);
    this.tiles[7].setBottomBranch(24);
    this.tiles[7].setLeftBranch(18);

    this.tiles[8].setTopLeftNode(10);
    this.tiles[8].setTopRightNode(11);
    this.tiles[8].setBottomLeftNode(16);
    this.tiles[8].setBottomRightNode(17);
    this.tiles[8].setTopBranch(14);
    this.tiles[8].setRightBranch(20);
    this.tiles[8].setBottomBranch(25);
    this.tiles[8].setLeftBranch(19);

    this.tiles[9].setTopLeftNode(13);
    this.tiles[9].setTopRightNode(14);
    this.tiles[9].setBottomLeftNode(18);
    this.tiles[9].setBottomRightNode(19);
    this.tiles[9].setTopBranch(22);
    this.tiles[9].setRightBranch(27);
    this.tiles[9].setBottomBranch(30);
    this.tiles[9].setLeftBranch(26);

    this.tiles[10].setTopLeftNode(14);
    this.tiles[10].setTopRightNode(15);
    this.tiles[10].setBottomLeftNode(19);
    this.tiles[10].setBottomRightNode(20);
    this.tiles[10].setTopBranch(23);
    this.tiles[10].setRightBranch(28);
    this.tiles[10].setBottomBranch(31);
    this.tiles[10].setLeftBranch(27);

    this.tiles[11].setTopLeftNode(15);
    this.tiles[11].setTopRightNode(16);
    this.tiles[11].setBottomLeftNode(20);
    this.tiles[11].setBottomRightNode(21);
    this.tiles[11].setTopBranch(24);
    this.tiles[11].setRightBranch(29);
    this.tiles[11].setBottomBranch(32);
    this.tiles[11].setLeftBranch(28);

    this.tiles[12].setTopLeftNode(19);
    this.tiles[12].setTopRightNode(20);
    this.tiles[12].setBottomLeftNode(22);
    this.tiles[12].setBottomRightNode(23);
    this.tiles[12].setTopBranch(31);
    this.tiles[12].setRightBranch(34);
    this.tiles[12].setBottomBranch(35);
    this.tiles[12].setLeftBranch(33);

    /* NODES - HARD CODED RELATIONSHIPS
      /
      /
      /
      */

    this.nodes[0].setRightBranch(0);
    this.nodes[0].setBottomBranch(1);
    this.nodes[0].setBottomRightTile(0);

    this.nodes[1].setBottomBranch(2);
    this.nodes[1].setLeftBranch(0);
    this.nodes[1].setBottomLeftTile(0);

    this.nodes[2].setRightBranch(3);
    this.nodes[2].setBottomBranch(6);
    this.nodes[2].setBottomRightTile(1);

    this.nodes[3].setTopBranch(1);
    this.nodes[3].setRightBranch(4);
    this.nodes[3].setBottomBranch(7);
    this.nodes[3].setLeftBranch(3);
    this.nodes[3].setTopRightTile(0);
    this.nodes[3].setBottomLeftTile(1);
    this.nodes[3].setBottomRightTile(2);

    this.nodes[4].setTopBranch(2);
    this.nodes[4].setRightBranch(5);
    this.nodes[4].setBottomBranch(8);
    this.nodes[4].setLeftBranch(4);
    this.nodes[4].setTopLeftTile(0);
    this.nodes[4].setBottomLeftTile(2);
    this.nodes[4].setBottomRightTile(3);

    this.nodes[5].setBottomBranch(9);
    this.nodes[5].setLeftBranch(5);
    this.nodes[5].setBottomLeftTile(3);

    this.nodes[6].setRightBranch(10);
    this.nodes[6].setBottomBranch(15);
    this.nodes[6].setBottomRightTile(4);

    this.nodes[7].setTopBranch(6);
    this.nodes[7].setRightBranch(11);
    this.nodes[7].setBottomBranch(16);
    this.nodes[7].setLeftBranch(10);
    this.nodes[7].setTopRightTile(1);
    this.nodes[7].setBottomLeftTile(4);
    this.nodes[7].setBottomRightTile(5);

    this.nodes[8].setTopBranch(7);
    this.nodes[8].setRightBranch(12);
    this.nodes[8].setBottomBranch(17);
    this.nodes[8].setLeftBranch(11);
    this.nodes[8].setTopLeftTile(1);
    this.nodes[8].setTopRightTile(2);
    this.nodes[8].setBottomLeftTile(5);
    this.nodes[8].setBottomLeftTile(6);

    this.nodes[9].setTopBranch(8);
    this.nodes[9].setRightBranch(13);
    this.nodes[9].setBottomBranch(18);
    this.nodes[9].setLeftBranch(12);
    this.nodes[9].setTopLeftTile(2);
    this.nodes[9].setTopRightTile(3);
    this.nodes[9].setBottomLeftTile(6);
    this.nodes[9].setBottomRightTile(7);

    this.nodes[10].setTopBranch(9);
    this.nodes[10].setRightBranch(14);
    this.nodes[10].setBottomBranch(19);
    this.nodes[10].setLeftBranch(13);
    this.nodes[10].setTopLeftTile(3);
    this.nodes[10].setBottomLeftTile(7);
    this.nodes[10].setBottomRightTile(8);

    this.nodes[11].setBottomBranch(20);
    this.nodes[11].setLeftBranch(14);
    this.nodes[11].setBottomLeftTile(8);

    this.nodes[12].setTopBranch(15);
    this.nodes[12].setRightBranch(21);
    this.nodes[12].setTopRightTile(4);

    this.nodes[13].setTopBranch(16);
    this.nodes[13].setRightBranch(22);
    this.nodes[13].setBottomBranch(26);
    this.nodes[13].setLeftBranch(21);
    this.nodes[13].setTopLeftTile(4);
    this.nodes[13].setTopRightTile(5);
    this.nodes[13].setBottomRightTile(9);

    this.nodes[14].setTopBranch(17);
    this.nodes[14].setRightBranch(23);
    this.nodes[14].setBottomBranch(27);
    this.nodes[14].setLeftBranch(22);
    this.nodes[14].setTopLeftTile(5);
    this.nodes[14].setTopRightTile(6);
    this.nodes[14].setBottomLeftTile(9);
    this.nodes[14].setBottomRightTile(10);


    this.nodes[15].setTopBranch(18);
    this.nodes[15].setRightBranch(24);
    this.nodes[15].setBottomBranch(28);
    this.nodes[15].setLeftBranch(23);
    this.nodes[15].setTopLeftTile(6);
    this.nodes[15].setTopRightTile(7);
    this.nodes[15].setBottomLeftTile(10);
    this.nodes[15].setBottomRightTile(11);

    this.nodes[16].setTopBranch(19);
    this.nodes[16].setRightBranch(25);
    this.nodes[16].setBottomBranch(29);
    this.nodes[16].setLeftBranch(24);
    this.nodes[16].setTopLeftTile(7);
    this.nodes[16].setTopRightTile(8);
    this.nodes[16].setBottomLeftTile(11);

    this.nodes[17].setTopBranch(20);
    this.nodes[17].setLeftBranch(25);
    this.nodes[17].setTopLeftTile(8);

    this.nodes[18].setTopBranch(26);
    this.nodes[18].setRightBranch(30);
    this.nodes[18].setTopRightTile(9);

    this.nodes[19].setTopBranch(27);
    this.nodes[19].setRightBranch(31);
    this.nodes[19].setBottomBranch(33);
    this.nodes[19].setLeftBranch(30);
    this.nodes[19].setTopLeftTile(9);
    this.nodes[19].setTopRightTile(10);
    this.nodes[19].setBottomRightTile(12);

    this.nodes[20].setTopBranch(28);
    this.nodes[20].setRightBranch(32);
    this.nodes[20].setBottomBranch(34);
    this.nodes[20].setLeftBranch(31);
    this.nodes[20].setTopLeftTile(10);
    this.nodes[20].setTopRightTile(11);
    this.nodes[20].setBottomLeftTile(12);

    this.nodes[21].setTopBranch(29);
    this.nodes[21].setLeftBranch(32);
    this.nodes[21].setTopLeftTile(11);

    this.nodes[22].setTopBranch(33);
    this.nodes[22].setRightBranch(35);
    this.nodes[22].setTopRightTile(12);

    this.nodes[23].setTopBranch(34);
    this.nodes[23].setLeftBranch(35);
    this.nodes[23].setTopLeftTile(12);

      
  }
}
  