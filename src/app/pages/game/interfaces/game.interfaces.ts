export enum PlayerType {
  'HUMAN',
  'NETWORK',
  'AI'
}

export interface Player {
  type: PlayerType
}