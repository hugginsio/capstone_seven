export interface SnackbarConfig {
  max: number,
  timeout: number
}

export interface Snack {
  message: string,
  id?: string,
  timer?: any
}

export enum SnackAction {
  ADD,
  REMOVE,
  CLEAR
}

export interface SnackSubject {
  action: SnackAction,
  data?: Snack,
  id?: string
}

export type BasicSnack = Omit<Snack, 'id' | 'timer'>;