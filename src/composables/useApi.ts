import { useHttpClient } from "@/stores/useHttpClient";
import type { ChessParty } from "@/types/ChessParty";
import type { LiveGame } from "@/types/LiveGame";
import type { ChessPartyFilter } from "@/types/Requests";

export function useApi() {

  const _httpClient = useHttpClient()

  async function getChessGame(gameId: string): Promise<ChessParty> {
    return _httpClient.get(`api/v1/games/${gameId}`)
  }

  async function getParties(filter: ChessPartyFilter): Promise<ChessParty[]> {
    const oponentParam = filter.oponentId ? `oponentId=${filter.oponentId}` : ''
    const ownerParam = filter.playerId ? `ownerId=${filter.playerId}` : ''
    return _httpClient.get(`api/v1/games?${oponentParam}&${ownerParam}`)
  }

  async function getLiveGame(gameId: string): Promise<LiveGame> {
    return _httpClient.get(`api/v1/livegames/${gameId}`)
  }

  return {
    getChessGame,
    getAllGames: getParties,
    getLiveGame
  }
}
