import { BoardApi, type MoveEvent } from 'vue3-chessboard'
import { useChessSocket } from './useChessSocket'
import type { DrawDecline, DrawProposition, GameResult, Move, MoveMessage } from '@/types/MoveRequest'
import { useApi } from './useApi'
import type { LiveGameResponse } from '@/types/LiveGame'
import { readonly, ref } from 'vue'

export function useLiveGame() {

  const isSync = ref(false)

  const _api = useApi()
  const _chessSocket = useChessSocket()
  let _board: BoardApi
  let _currentGameId: string | null

  let _pendingMoves: Move[] = []

  let afterMoveCallback: ((move: MoveMessage, isApplied: boolean) => void) | null = null
  let afterSyncCallback: ((liveGame: LiveGameResponse) => void) | null = null

  let afterGameFinishCallback: ((gameResult: GameResult) => void) | null = null
  let afterDrawPropositionCallback: (resultMessage: DrawProposition) => void = () => {}
  let afterDrawDeclineCallback: (resultMessage: DrawDecline) => void = () => {}

  _init()


  function _init() {
    _chessSocket.setMoveCallback((moveMessage: MoveMessage) => {
      if (isSync.value === false) {
        _pendingMoves.push(moveMessage.move)
        return
      }

      if (_validateMove(moveMessage.move) === false) {
        if(afterMoveCallback !== null) {
          afterMoveCallback(moveMessage, false)
        }
        return
      }

      console.log("apply move" + _board.getTurnColor())
      _board.move(moveMessage.move.san)

      if(afterMoveCallback !== null) {
        afterMoveCallback(moveMessage, true)
      }
    })

    _chessSocket.setGameFinishCallback((gameResult: GameResult) => {
      console.log("game end")
      unsubcribe()
      afterGameFinishCallback?.(gameResult)
    })

    _chessSocket.setDrawPropositionCallback((resultMessage: DrawProposition) => {
      afterDrawPropositionCallback?.(resultMessage)
    })

    _chessSocket.setDrawDeclineCallback((resultMessage: DrawDecline) => {
      afterDrawDeclineCallback?.(resultMessage)
    })

    _chessSocket.setConnectCallback(() => {
      console.log("socket connected - sync game")
      syncGame()
    })
  }

  function _validateMove(move: Move): boolean {
    if (_board.getLastMove() !== undefined && _board.getLastMove()!.san == move.san) {
      return false
    }

    return true
  }

  async function syncGame() {
    if(_currentGameId == null) {
      console.error("live game id did not set")
      return
    }
    const promise: Promise<LiveGameResponse> =_api.getLiveGame(_currentGameId).then((liveGameResponse) => {
      const moves: Move[] = _mergeMoves(liveGameResponse.game.moves, _pendingMoves)
      _board.loadPgn(moves.map(m => m.san).join(' '))
      _pendingMoves = []
      isSync.value = true
      return liveGameResponse
    })

    if(afterSyncCallback !== null) {
      promise.then(afterSyncCallback)
    }
  }

  function sendMove(move: MoveEvent) {
    _chessSocket.sendMove(move)
  }

  function _mergeMoves(firstList: Move[], secondList: Move[]): Move[] {
    const map = new Map();

    firstList.forEach(move => map.set(move.plyNumber, move));
    secondList.forEach(move => map.set(move.plyNumber, move));

    return [...map.values()].sort((a, b) => a.plyNumber - b.plyNumber);
  }

  function setAfterMoveCallback(callback: (move: MoveMessage) => void) {
    afterMoveCallback = callback
  }

  function setAfterSyncCallback(callback: (liveGame: LiveGameResponse) => void) {
    afterSyncCallback = callback
  }

  function setAfterGameFinishCallback(callback: (gameResult: GameResult) => void) {
    afterGameFinishCallback = callback;
  }

  function setAfterDrawPropositionCallback(callback: (drawProposition: DrawProposition) => void) {
    afterDrawPropositionCallback = callback
  }

  function setAfterDrawDeclineCallback(callback: (drawDecline: DrawDecline) => void) {
    afterDrawDeclineCallback = callback
  }


  function subscribe(gameId: string, boardApi: BoardApi) {
    _board = boardApi
    _currentGameId = gameId
    console.log("subscribe to live game " + gameId)
    _chessSocket.subscribe(gameId)
    syncGame()
  }

  function unsubcribe() {
    if(_currentGameId == null) return
    _chessSocket.unsubscribe()
    _currentGameId = null
    isSync.value = false
  }

  function sendDrawProposition() {
    if(_currentGameId == null) return
    _chessSocket.sendDrawProposition()
  }

  function surrender() {
    if(_currentGameId == null) return
    _chessSocket.surrender()
  }

  return {
    subscribe,
    unsubcribe,
    isSync: readonly(isSync),
    syncGame,
    setAfterMoveCallback,
    setAfterSyncCallback,
    sendDrawProposition,
    setAfterDrawDeclineCallback,
    setAfterDrawPropositionCallback,
    setAfterGameFinishCallback,
    sendMove,
    surrender
  }
}
