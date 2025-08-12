import type { BoardApi } from "vue3-chessboard";

export type SocketMessage = {
  payload: object;
  headers: Record<string, unknown>;
}

export type GameInfoToSub = {
  gameId: number
  boardApi: BoardApi
}

export type SocketMessageType = "move" | "gameFinish"
