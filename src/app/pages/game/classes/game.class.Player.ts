import { PlayerType } from '../enums/game.enums';


// what needs to be private here??
  export class Player {
    type: PlayerType;
  
    redResources: number;
    blueResources: number;
    greenResources: number;
    yellowResources: number;

    redPerTurn: number;
    bluePerTurn: number;
    greenPerTurn: number;
    yellowPerTurn: number;
    
    hasTraded: boolean;
    hasLongestNetwork: boolean;
  
    numTilesCaptured: number;
    numNodesPlaced: number;
  
    currentScore: number;

    constructor() {
      this.redResources = 0;
      this.blueResources = 0;
      this.greenResources = 0;
      this.yellowResources = 0;

      this.hasTraded = false;
      this.hasLongestNetwork = false;

      this.numTilesCaptured = 0;
      this.numNodesPlaced = 0;

      this.currentScore = 0;
    }
  }
 