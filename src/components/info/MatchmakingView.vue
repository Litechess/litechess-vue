<script setup lang="ts">
import { NFlex, NText, NScrollbar } from 'naive-ui';
import FindGameButton from '../FindGameButton.vue';
import { RouterLink } from 'vue-router';
</script>

<template>
  <n-flex vertical>
    <find-game-button />
    <n-flex justify="center">
        <n-text style="font-size: 18px">Active games</n-text>
        <router-link to="/test">/play</router-link>
        <router-link to="/test/100">/board</router-link>
        <n-scrollbar style="max-height: 42em; min-height: 42em">
          <!-- <n-flex justify="center" :size="10">
            <router-link
              :to="`/game/${activeGame.id}`"
              style="text-decoration: none; color: inherit"
              v-for="activeGame in activeNonSelectedGames"
              :key="activeGame.id"
            >
              <game-card
                :chessParty="activeGame"
                :orientation="getOrientation(activeGame)"
              />
            </router-link>
          </n-flex> -->
        </n-scrollbar>
    </n-flex>
  </n-flex>
</template>
