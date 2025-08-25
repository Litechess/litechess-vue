<script setup lang="ts">
// TODO ONLY FOR DEV TESTING , DELETE FROM ROUTER TO
import { NFlex, NCard, NTabs, NTabPane, NScrollbar, NText, NButton } from 'naive-ui'
import PlayerBoardInfo from '@/components/PlayerBoardInfo.vue'
import { ref, toRaw } from 'vue'
import { TheChessboard, type BoardApi, type CapturedPieces, type MoveEvent } from 'vue3-chessboard'
import { h } from 'vue'
import 'vue3-chessboard/style.css'
import BoardTabPane from '@/components/ImageText.vue'
import MoveTable from '@/components/MoveTable.vue'
import ChessBoard from '@/components/ChessBoard.vue'
import { ArrowIcon, EqualIcon } from '@/components/icon'
import PieceText from '@/components/PieceText.vue'

const takedPieceWhite = ref([])
const takedPieceBlack = ref([])
const moves: Ref<string[]> = ref([])

// composable
let boardApi: BoardApi
const openingName = ref('ㅤ')
const boardConfig = {}
const buttonSize: number = 35

const piecePane = h(PieceText, {
  text: 'game',
  piece: "p"
})

function onMove(move: MoveEvent) {
  moves.value.push(move.san)
  boardApi.getOpeningName().then((name) => {
    if (openingName.value != name) openingName.value = name!
  })
}

function onBoardCreated(api: BoardApi) {
  boardApi = api
}

function test() {}
</script>

<template>
  <n-flex style="height: calc(100dvh - 2rem)" justify="center" align="center">
    <n-flex :size="50" justify="center">
      <n-flex vertical>
        <player-board-info
          color="w"
          name="Player2"
          avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          :pieces="takedPieceBlack"
        />
        <chess-board player-color="white" @move="onMove" @board-created="onBoardCreated" />
        <player-board-info
          color="w"
          name="Player2"
          avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          :pieces="takedPieceBlack"
        />
      </n-flex>
      <n-flex>
        <n-card>
          <n-tabs style="width: 400px" type="line" animated justify-content="center" size="large">
            <n-tab-pane name="sosal1" :tab="piecePane">
              <n-flex vertical justify="space-between">
                <n-text> {{ openingName }}</n-text>
                <n-scrollbar style="max-height: 42em; min-height: 42em">
                  <move-table :moves="moves" v-if="moves.length != 0" />
                </n-scrollbar>
                <n-flex justify="center" :size="5">
                  <n-button>
                    <arrow-icon :size="buttonSize"/>
                  </n-button>
                  <n-button @click="test">
                    <equal-icon :size="buttonSize"/>
                  </n-button>
                  <n-button>
                    <arrow-icon :size="buttonSize" rotated />
                  </n-button>
                </n-flex>
              </n-flex>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </n-flex>
    </n-flex>
  </n-flex>
</template>

<style scoped></style>
