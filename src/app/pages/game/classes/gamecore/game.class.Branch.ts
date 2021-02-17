import { Owner } from '../../enums/game.enums';
import { BranchesInterface } from '../../interfaces/game.interface';

export class Branch {
  private ownedBy: Owner;
  private branches: BranchesInterface;
    
  // NOTE: branches counted in clockwise fashion beginning at top

  constructor(b1 = -1, b2 = -1, b3 = -1, b4 = -1, b5 = -1, b6 = -1) {
    this.ownedBy = Owner.NONE;
    this.branches = {branch1:b1,branch2:b2,branch3:b3,branch4:b4,branch5:b5,branch6:b6};
    // this.branches.branch1 = b1;
    // this.branches.branch2 = b2;
    // this.branches.branch3 = b3;
    // this.branches.branch4 = b4;
    // this.branches.branch5 = b5;
    // this.branches.branch6 = b6;

  }

  getOwner(): Owner {
    return this.ownedBy;
  }
  setOwner(newOwner: Owner): void {
    this.ownedBy = newOwner;
  }

  getBranch(branch: keyof BranchesInterface ): number {
    return this.branches[branch];
  }

  setBranch(branch: keyof BranchesInterface, newB: number): void {
    this.branches[branch] = newB;
  }
}