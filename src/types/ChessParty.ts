export type ChessParty = {
  id: number
  white: string
  black: string
  moveUci: string[],
  fen: string,
  initFen: string,
  status: GameStatus

}

export type PlayerColor = 'w' | 'b' | 's'
export type GameStatus = "DRAW" | "WIN_WHITE" | "WIN_BLACK" | "NOT_FINISHED"
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
