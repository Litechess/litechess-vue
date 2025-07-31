<script setup lang="ts">
import { TheChessboard } from 'vue3-chessboard';
import 'vue3-chessboard/style.css';
</script>
<template>
  <div>
    <TheChessboard></TheChessboard>
    <router-link to="/">/home</router-link>
    <br>
    <router-link to="/play">/play</router-link>
  </div>
</template>
