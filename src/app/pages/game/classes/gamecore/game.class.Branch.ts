import { Owner } from "../../enums/game.enums";
import { BranchesInterface } from "../../interfaces/game.interface";

export class Branch {
  ownedBy: Owner;

  // branch1-branch6 for associations
  branches: BranchesInterface;

  // NOTE:
  // branches are counted in a clockwise fashion
  // vertical: count begins at top branch
  // horizontal: count begins at top-right branch

  constructor(b1 = -1, b2 = -1, b3 = -1, b4 = -1, b5 = -1, b6 = -1) {
    this.ownedBy = Owner.NONE;

    this.branches = {
      branch1: b1,
      branch2: b2,
      branch3: b3,
      branch4: b4,
      branch5: b5,
      branch6: b6,
    };
  }

  getOwner(): Owner {
    return this.ownedBy;
  }
  setOwner(newOwner: Owner): void {
    this.ownedBy = newOwner;
  }

  getBranch(branch: keyof BranchesInterface): number {
    return this.branches[branch];
  }

  setBranch(branch: keyof BranchesInterface, newB: number): void {
    this.branches[branch] = newB;
  }
}
