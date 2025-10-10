import { BoardApi, type MoveEvent } from 'vue3-chessboard'
import { useChessSocket } from './useChessSocket'
import type { Move, MoveMessage } from '@/types/MoveRequest'
import { useApi } from './useApi'
import type { LiveGameResponse } from '@/types/LiveGame'

export function useLiveGame() {
  const _api = useApi()
  const _chessSocket = useChessSocket()
  let _board: BoardApi
  let _currentGameId: string

  let _pendingMoves: Move[] = []
  let _isSync: boolean = false

  let afterMoveCallback: ((move: MoveMessage, isApplied: boolean) => void) | null = null
  let afterSyncCallback: ((liveGame: LiveGameResponse) => void) | null = null

  _init()

  function _init() {
    _chessSocket.setMoveCallback((moveMessage: MoveMessage) => {
      if (_isSync === false) {
        _pendingMoves.push(moveMessage.move)
        return
      }

      if (_validateMove(moveMessage.move) === false) {
        if(afterMoveCallback !== null) {
          afterMoveCallback(moveMessage, false)
        }
        return
      }

      _board.move(moveMessage.move.san)

      if(afterMoveCallback !== null) {
        afterMoveCallback(moveMessage, true)
      }
    })
  }

  function _validateMove(move: Move): boolean {
    if (_board.getLastMove() !== undefined && _board.getLastMove()!.san == move.san) {
      return false
    }

    return true
  }

  async function syncGame() {
    const promise: Promise<LiveGameResponse> =_api.getLiveGame(_currentGameId).then((liveGameResponse) => {
      const moves: Move[] = _mergeMoves(liveGameResponse.game.moves, _pendingMoves)
      _board.loadPgn(moves.map(m => m.san).join(' '))
      _pendingMoves = []
      _isSync = true
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

  function subscribe(gameId: string, boardApi: BoardApi) {
    _board = boardApi
    _currentGameId = gameId
    _chessSocket.subscribe(gameId)
    syncGame()
  }

  return {
    subscribe,
    syncGame,
    setAfterMoveCallback,
    setAfterSyncCallback,
    sendMove
  }
}
