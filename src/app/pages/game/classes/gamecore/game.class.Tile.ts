import { TileColor, Owner } from "../../enums/game.enums";

export class Tile {
  color: TileColor;

  nodeCount: number;
  maxNodes: number;

  isExhausted: boolean;
  //passivelyExhausted: boolean;

  capturedBy: Owner;

  topLeftNode: number;
  topRightNode: number;
  bottomLeftNode: number;
  bottomRightNode: number;

  topBranch: number;
  rightBranch: number;
  bottomBranch: number;
  leftBranch: number;

  topTile: number;
  rightTile: number;
  bottomTile: number;
  leftTile: number;

  constructor(
    tln = -1,
    trn = -1,
    bln = -1,
    brn = -1,
    tb = -1,
    rb = -1,
    bb = -1,
    lb = -1,
    tt = -1,
    rt = -1,
    bt = -1,
    lt = -1
  ) {
    this.color = TileColor.BLANK;
    this.nodeCount = 0;
    this.maxNodes = 0;
    this.isExhausted = false;

    this.capturedBy = Owner.NONE;

    this.topLeftNode = tln;
    this.topRightNode = trn;
    this.bottomLeftNode = bln;
    this.bottomRightNode = brn;

    this.topBranch = tb;
    this.rightBranch = rb;
    this.bottomBranch = bb;
    this.leftBranch = lb;

    this.topTile = tt;
    this.rightTile = rt;
    this.bottomTile = bt;
    this.leftTile = lt;
  }

  getColor(): TileColor {
    return this.color;
  }

  getNodeCount(): number {
    return this.nodeCount;
  }
  setNodeCount(count: number): void {
    this.nodeCount = count;
  }

  getMaxNodes(): number {
    return this.maxNodes;
  }

  getIsExhaused(): boolean {
    return this.isExhausted;
  }

  setIsExhaused(value: boolean): void {
    this.isExhausted = value;
  }

  getCapturedBy(): Owner {
    return this.capturedBy;
  }

  setCapturedBy(newCap: Owner): void {
    this.capturedBy = newCap;
  }

  // Node Relationships
  getTopLeftNode(): number {
    return this.topLeftNode;
  }
  setTopLeftNode(n: number): void {
    this.topLeftNode = n;
  }

  getTopRightNode(): number {
    return this.topRightNode;
  }
  setTopRightNode(n: number): void {
    this.topRightNode = n;
  }

  getBottomLeftNode(): number {
    return this.bottomLeftNode;
  }
  setBottomLeftNode(n: number): void {
    this.bottomLeftNode = n;
  }

  getBottomRightNode(): number {
    return this.bottomRightNode;
  }
  setBottomRightNode(n: number): void {
    this.bottomRightNode = n;
  }

  // Branch Relationships
  getTopBranch(): number {
    return this.topBranch;
  }
  setTopBranch(n: number): void {
    this.topBranch = n;
  }

  getRightBranch(): number {
    return this.rightBranch;
  }
  setRightBranch(n: number): void {
    this.rightBranch = n;
  }

  getBottomBranch(): number {
    return this.bottomBranch;
  }
  setBottomBranch(n: number): void {
    this.bottomBranch = n;
  }

  getLeftBranch(): number {
    return this.leftBranch;
  }
  setLeftBranch(n: number): void {
    this.leftBranch = n;
  }

  // Tile Relationships
  getTopTile(): number {
    return this.topTile;
  }

  setTopTile(n: number): void {
    this.topTile = n;
  }

  getRightTile(): number {
    return this.rightTile;
  }

  setRightTile(n: number): void {
    this.rightTile = n;
  }

  getBottomTile(): number {
    return this.bottomTile;
  }

  setBottomTile(n: number): void {
    this.bottomTile = n;
  }

  getLeftTile(): number {
    return this.leftTile;
  }

  setLeftTile(n: number): void {
    this.leftTile = n;
  }
}
