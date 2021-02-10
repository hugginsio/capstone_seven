import { TileColor, Owner } from '../../enums/game.enums';

// what all needs to be private and such for this and all the other classes too 
export class Tile {
  color: TileColor;

  nodeCount: number;
  maxNodes: number;

  isExhausted: boolean;

  capturedBy: Owner;

  private topLeftNode: number;
  private topRightNode: number;
  private bottomLeftNode: number;
  private bottomRightNode: number;

  private topBranch: number;
  private rightBranch: number;
  private bottomBranch: number;
  private leftBranch : number;


  // having things we will reassign later after randomizing in the constructor??
  constructor(tln = -1, trn = -1, 
              bln = -1, brn = -1,
              tb = -1, rb = -1,
              bb = -1, lb = -1){
    this.color = TileColor.BLANK;
    this.nodeCount = 0;
    this.maxNodes = 0;      // how to deal with maxNodes if its just the blank... do i set this in the constuctor in general?
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

  // Node
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


  // Branch
  getTopBranch(): number {
    return this.topBranch;
  }
  setTopBranch (n: number): void {
    this.topBranch = n;
  }

  getRightBranch(): number {
    return this.rightBranch;
  }
  setRightBranch (n: number): void {
    this.rightBranch = n;
  }

  getBottomBranch(): number {
    return this.bottomBranch;
  }
  setBottomBranch (n: number): void {
    this.bottomBranch = n;
  }

  getLeftBranch(): number {
    return this.leftBranch;
  }
  setLeftBranch (n: number): void {  
    this.leftBranch = n;
  }
}