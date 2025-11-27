import { useHttpClient } from "@/stores/useHttpClient";
import type { ChessParty } from "@/types/ChessParty";
import type { LiveGameResponse } from "@/types/LiveGame";
import type { ChessPartyFilter } from "@/types/Requests";
import type { ServerNowResponse } from "@/types/ServerNow";

export function useApi() {

  const _httpClient = useHttpClient()

  async function getChessGame(gameId: string): Promise<ChessParty> {
    return _httpClient.get(`api/v1/games/${gameId}`)
  }

  async function getParties(filter: ChessPartyFilter): Promise<ChessParty[]> {
    const oponentParam = filter.oponentId ? `oponentId=${filter.oponentId}` : ''
    const ownerParam = filter.playerId ? `ownerId=${filter.playerId}` : ''
    const live = `live=${filter.live ?? false}`
    const finish = `finish=${filter.finish ?? true}`
    return _httpClient.get(`api/v1/games?${oponentParam}&${ownerParam}&${live}&${finish}`)
  }

  async function getLiveGame(gameId: string): Promise<LiveGameResponse> {
    return _httpClient.get(`api/v1/livegames/${gameId}`)
  }

  async function getServerTime(): Promise<ServerNowResponse> {
    return _httpClient.get(`api/v1/livegames/serverNow`)
  }

  return {
    getChessGame,
    getAllGames: getParties,
    getLiveGame,
    getServerTime
  }
}
