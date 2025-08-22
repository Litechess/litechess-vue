<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import { useMatchQueue } from '@/composables/useMatchQueue';
import type { ShortChessParty } from '@/types/ShortChessParty';
import { ref } from 'vue';

const matchQueue = useMatchQueue()
const api = useApi()

const liveParty = ref<ShortChessParty[]>([]);
const storedParty = ref<ShortChessParty[]>([]);
const isLoadedParties = ref(false)

api.getAllGames().then((result: ShortChessParty[]) => {
  result.forEach((party: ShortChessParty) => {
    if(party.status == "NOT_FINISHED") liveParty.value.push(party);
    else storedParty.value.push(party)
  })
  isLoadedParties.value = true
})

</script>
<template>
  <div>
    PlayPage
    <button @click="matchQueue.enterInQueue">REGISTRY</button>
  </div>
  <router-link to="/board?color=white">/WHITE</router-link>
  <router-link to="/board?color=black">/BLACK</router-link>
  <router-link to="/board?color=spectator">/SPECTATE</router-link>
  <br>
  <router-link to="/">/home</router-link>
    <div v-if="isLoadedParties">
      <h3>Live Games:</h3>
      <div v-for="party in liveParty" :key="party.id" class="live-game">
        <router-link :to="`/${party.id}`">
          Game {{ party.id }} — {{ party.status }}
        </router-link>
      </div>
    </div>
</template>
