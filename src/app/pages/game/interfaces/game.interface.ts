import { Player } from "../classes/gamecore/game.class.Player";
import { CommCode } from "./game.enum";

export interface ClickEvent {
  altKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  type: string;
  target: {
    className: string;
    id: string;
  };
}
export interface BranchesInterface {
  branch1: number;
  branch2: number;
  branch3: number;
  branch4: number;
  branch5: number;
  branch6: number;
}

export interface CommPackage<T = string> {
  code: CommCode;
  player?: Player;
  magic?: T;
}

export interface ResourceMap {
  red: number;
  green: number;
  blue: number;
  yellow: number;
}

export interface GuidedTutorialInterface {
  message: string;
  move?: string;
}
