<script setup lang="ts">
import BoardView from '@/components/game/BoardView.vue';
import { NCard } from 'naive-ui';

</script>

<template>
  <n-flex style="height: calc(100dvh - 2rem)" justify="center" align="center">
    <n-card :content-style="{backgroundColor: 'rgba(0, 200, 0, 0.08)'}">
      <board-view style="width: 200px"/>
    </n-card>
  </n-flex>
</template>

<style scoped></style>
