export enum SoundAction {
  ADD,
  REMOVE,
  CLEAR,
  UPDATE
}

export enum SoundEndAction {
  LOOP,
  DIE
}

export interface SoundSubject {
  action: SoundAction,
  track: string,
  onEnd: SoundEndAction,
  id: string
}

export interface SoundObject {
  track: string,
  id: string,
  onEnd: SoundEndAction
}