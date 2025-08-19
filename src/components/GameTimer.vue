<script setup lang="ts">
import { NFlex, NCountdown, type CountdownProps } from 'naive-ui'
import { h } from 'vue';

const renderTimes: CountdownProps['render'] = ({
  minutes,
  seconds
}) => {
  return [
    h('span', [String(minutes).padStart(2, '0')]),
    ':',
    h('span', [String(seconds).padStart(2, '0')]),
  ]
}
</script>

<template>
  <n-flex style="background-color: #2b2b2b; font-size: 2em; color: #c2c0c0; border-radius: 5px;">
    <n-countdown
      :render="renderTimes"
      :duration="996 * 1000"
      :active="true"/>
  </n-flex>
</template>

<style scoped>

</style>
