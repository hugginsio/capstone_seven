import { PlayerType } from '../../enums/game.enums';


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

  ownedBranches: Array<number>;
  branchScanner: Array<number>;
  currentLength: number;
  currentLongest: number;
  hasLongestNetwork: boolean;
  
  numTilesCaptured: number;
  numNodesPlaced: number;
  
  currentScore: number;

  constructor() {
    this.redResources = 1;
    this.blueResources = 1;
    this.greenResources = 2;
    this.yellowResources = 2;

    this.redPerTurn = 0;
    this.bluePerTurn = 0;
    this.greenPerTurn = 0;
    this.yellowPerTurn = 0;

    this.hasTraded = false;

    this.ownedBranches = [];
    this.branchScanner = [];

    this.currentLength = 0;
    this.currentLongest = 0;
    this.hasLongestNetwork = false;

    this.numTilesCaptured = 0;
    this.numNodesPlaced = 0;

    this.currentScore = 0;
  }
}
 