import type { BoardApi } from "vue3-chessboard";
import type { PlayerColor } from "./ChessParty";

export type SocketMessage = {
  payload: object;
  headers: Record<string, unknown>;
}

export type GameInfoToSub = {
  gameId: number
  playerColor: PlayerColor
  boardApi: BoardApi
}

export type SocketMessageType = "gameInfo" | "move"
