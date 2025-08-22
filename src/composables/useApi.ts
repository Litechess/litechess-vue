import { useHttpClient } from "@/stores/useHttpClient";
import type { ChessParty } from "@/types/ChessParty";
import type { ShortChessParty } from "@/types/ShortChessParty";

export function useApi() {

  const _httpClient = useHttpClient()

  async function getChessGame(gameId: number): Promise<ChessParty> {
    return _httpClient.get(`api/v1/games/${gameId}`)
  }

  async function getAllGames(): Promise<ShortChessParty[]> {
    return _httpClient.get(`api/v1/games/shortParty`)
  }

  return {
    getChessGame,
    getAllGames
  }
}
