<script setup lang="ts">
import { useChessSocketStore } from '@/stores/useChessSocketStore';


const chessSocketStore = useChessSocketStore()

</script>
<template>
  <div>
    PlayPage
    <button @click="chessSocketStore.enterInQueue">REGISTRY</button>
  </div>
  <router-link to="/board?color=white">/WHITE</router-link>
  <router-link to="/board?color=black">/BLACK</router-link>
  <router-link to="/board?color=spectator">/SPECTATE</router-link>
  <br>
  <router-link to="/">/home</router-link>
</template>
