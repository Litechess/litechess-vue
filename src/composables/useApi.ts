import { useHttpClient } from "@/stores/useHttpClient";
import type { ChessParty } from "@/types/ChessParty";
import type { LiveGameResponse } from "@/types/LiveGame";
import type { OnlineResponse } from "@/types/OnlineResponse";
import type { RegistrationRequest } from "@/types/RegistrationRequest";
import type { ChessPartyFilter } from "@/types/Requests";
import type { ServerNowResponse } from "@/types/ServerNow";
import type { UserInfo } from "@/types/UserInfo";

export function useApi() {

  const _httpClient = useHttpClient()

  async function getChessGame(gameId: string): Promise<ChessParty> {
    return _httpClient.get(`v1/games/${gameId}`)
  }

  async function getParties(filter: ChessPartyFilter): Promise<ChessParty[]> {
    const oponentParam = filter.oponentId ? `oponentId=${filter.oponentId}` : ''
    const ownerParam = filter.playerId ? `ownerId=${filter.playerId}` : ''
    const live = `live=${filter.live ?? false}`
    const finish = `finish=${filter.finish ?? true}`
    return _httpClient.get(`v1/games?${oponentParam}&${ownerParam}&${live}&${finish}`)
  }

  async function getLiveGame(gameId: string): Promise<LiveGameResponse> {
    return _httpClient.get(`v1/livegames/${gameId}`)
  }

  async function getServerTime(): Promise<ServerNowResponse> {
    return _httpClient.get(`v1/livegames/serverNow`)
  }

  async function getUserInfo(id: string): Promise<UserInfo> {
    return _httpClient.get(`v1/users/${id}`)
  }

  async function getUserOnline(id: string): Promise<OnlineResponse> {
    return _httpClient.get(`v1/online/${id}`)
  }

  async function registerUser(request: RegistrationRequest): Promise<void> {
    return _httpClient.post(`v1/users`, JSON.stringify(request))
  }

  return {
    getChessGame,
    getAllGames: getParties,
    getLiveGame,
    getUserOnline,
    registerUser,
    getUserInfo,
    getServerTime
  }
}
