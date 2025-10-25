import { useApi } from "@/composables/useApi"
import type { ChessParty } from "@/types/ChessParty"
import { defineStore } from "pinia"
import { ref, shallowReadonly } from "vue"
import { useAuthStore } from "./useAuthStore"
import { useChessSocket } from "@/composables/useChessSocket"

export const useLiveGameStore = defineStore('liveGame', () => {

  const api = useApi()
  const authStore = useAuthStore()

  const activeGames = ref<ChessParty[]>([])
  const gameSockets = new Map()

  async function load(gameId: string): Promise<ChessParty | void> {
    return api.getChessGame(gameId).then((game: ChessParty) => {
      add({
        ...game,
        id: String(game.id)
      })
    })
  }

  function remove(gameId: string): void {
    console.log('try remove')
    if(gameSockets.has(gameId) === false) return
    gameSockets.get(gameId)?.unsubscribe()
    gameSockets.delete(gameId)
    console.log('REMOVE')
    const index = activeGames.value.findIndex(g => g.id === gameId)
    if (index !== -1) activeGames.value.splice(index, 1)
  }

  function add(game: ChessParty): void {
    if(game.status !== 'NOT_FINISHED' || gameSockets.has(game.id)) return;
    const chessSocket = useChessSocket()
    chessSocket.setGameFinishCallback(() => {
      remove(game.id)
    })

    gameSockets.set(game.id, chessSocket)
    chessSocket.subscribe(game.id)
    activeGames.value.push(game)
  }


  api.getAllGames({ playerId: authStore.getId()! })
  .then((result: ChessParty[]) => {
    const filteredResult = result.filter((game) => {
      return game.status === 'NOT_FINISHED'
    })
    .map((game) => {
      return {
        ...game,
        id: String(game.id),
      }
    })

    filteredResult.forEach((game: ChessParty) => {
      add(game)
    })

    console.log("LOAD ACTiVE GAMES")
  })

  return {
    activeGames: shallowReadonly(activeGames),
    load,
    remove
  }
})
