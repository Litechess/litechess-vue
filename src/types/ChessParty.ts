import type { Move } from './MoveRequest'

export type ChessParty = {
  id: string
  white: PlayerInfo
  black: PlayerInfo
  moves: Move[]
  timerHistory: number[],
  timeControl: {
    initTime: number,
    increment: number
  } | null
  initFen: string
  status: GameStatus
}

export type PlayerInfo = {
  id: string
  name: string
}

export type Timer = {
  active: boolean
  duration: number
}
export type PlayerSide = 'white' | 'black'
export type GameStatus = 'DRAW' | 'WIN_WHITE' | 'WIN_BLACK' | 'NOT_FINISHED'
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
