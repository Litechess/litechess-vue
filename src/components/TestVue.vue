<script setup lang="ts">

interface Props {
  moves: readonly string[]
}

const props = defineProps<Props>();



</script>

<template>
  <div style="display: flex; justify-content: center">
    <div v-for="(move, index) in props.moves" :key="index">{{ move }}</div>
  </div>
</template>

<style scoped>

</style>
