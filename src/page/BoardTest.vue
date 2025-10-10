<script setup lang="ts">
import { useTest } from '@/composables/useTest'
import TestVue from '@/components/TestVue.vue'

// TODO ONLY FOR DEV TESTING , DELETE FROM ROUTER TO

const test = useTest()

function clickButton() {
  test.add()
}
</script>

<template>
  <div style="display: flex; justify-content: center">
    <button @click="clickButton">BUTTON</button>
  </div>
  <TestVue :moves="test.moves.value"></TestVue>
</template>

<style scoped></style>
