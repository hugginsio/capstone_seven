export enum PlayerType {
  'HUMAN',
  'NETWORK',
  'AI'
}

export enum TileColor {
  "GREEN",
  "BLUE",
  "YELLOW",
  "RED",
  "BLANK"
}

export enum Owner {
  "NONE",
  "PLAYERONE",
  "PLAYERTWO"
}

export enum GameType {
  "NETWORK",
  "AI"
}

/*export interface Player {
  type: PlayerType,

  redResources: number,
  blueResources: number,
  greenResources: number,
  yellowResources: number,
  
  hasTraded: boolean,
  hasLongestNetwork: boolean,

  numTilesCaptured: number,
  numNodesPlaced: number,

  currentScore: number
}



export interface Tile {
  color: TileColor,
  
  nodeCount: number,
  maxNodes: number,

  isExhausted: boolean,
  
  capturedBy: Owner,

  topLeftNode: number,
  topRightNode: number,
  bottomLeftNode: number,
  bottomRightNode: number,
  
  topBranch: number,
  rightBranch: number,
  bottomBranch: number,
  leftBranch : number
}

export interface Node {
  ownedBy: Owner,
  
  redProvided: number,
  blueProvided: number,
  greenProvided: number,
  yellowProvided: number,

  topBranch: number,
  rightBranch: number,
  bottomBranch: number,
  leftBranch: number

  topLeftTile: number,
  topRightTile: number,
  bottomLeftTile: number,
  bottomRightTile: number
}

export interface Branch {
  ownedBy: Owner,

  branch1: number,
  branch2: number,
  branch3: number,
  branch4: number,
  branch5: number,
  branch6: number
  
  // NOTE: branches counted in clockwise fashion beginning at top
}

export interface GameBoard {
  tiles: Tile[],
  nodes: Node[],
  branches: Branch[]
}


export interface GameMaster {
  gameBoard: GameBoard,
  gameType: GameType
}*/