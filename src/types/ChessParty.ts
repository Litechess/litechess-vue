import type { GameStatus } from "./GameStatus"

export type ChessParty = {
  id: number
  white: string
  black: string
  moveSan: string,
  fen: string,
  initFen: string,
  status: GameStatus

}
