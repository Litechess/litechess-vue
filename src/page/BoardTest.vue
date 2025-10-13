<script setup lang="ts">
import GameView from '@/components/game/GameView.vue';
import { NFlex } from 'naive-ui';

</script>

<template>
  <n-flex>
    <game-view :timer-show="true" orientation="black" player-side="black"/>
  </n-flex>
</template>

<style scoped></style>
