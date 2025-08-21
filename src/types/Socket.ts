export type SocketMessage = {
  payload: object;
  headers: Record<string, unknown>;
}

export type SocketMessageType = "move" | "gameFinish"
