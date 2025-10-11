<script setup lang="ts">
import PlayerBoardInfo from './PlayerBoardInfo.vue';
import GameTimer from '../GameTimer.vue';

defineProps<{

}>();
</script>

<template>
  <n-flex justify="space-between">
    <player-board-info
      color="black"
      :name="playerBlackName"
      avatar="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
      :pieces="boardState.takedPieceBlack.value"
      :materialDiff="boardState.materialDiff.value"
      />
    <game-timer :active="blackTimerActive" :duration="blackTimer" :key="blackTimer"/>
  </n-flex>
</template>
