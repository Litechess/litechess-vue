export type ChessParty = {
  id: number
  white: string
  black: string
  moveSan: string,
  fen: string,
  initFen: string,
  status: GameStatus

}

export type PlayerColor = 'w' | 'b' | 's'
export type GameStatus = "DRAW" | "WIN_WHITE" | "WIN_BLACK" | "NOT_FINISHED"
