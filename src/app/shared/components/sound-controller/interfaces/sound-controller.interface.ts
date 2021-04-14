export enum SoundAction {
  ADD,
  REMOVE,
  CLEAR,
  UPDATE,
}

export enum SoundEndAction {
  LOOP,
  DIE,
}

export enum SoundType {
  MUSIC,
  FX,
}

export interface SoundSubject {
  action: SoundAction;
  track: string;
  onEnd: SoundEndAction;
  id: string;
  type: SoundType;
}

export interface SoundObject {
  track: string;
  id: string;
  onEnd: SoundEndAction;
  type: SoundType;
}
