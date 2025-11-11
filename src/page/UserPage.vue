<script setup lang="ts">
import { NFlex, NCard, NAvatar, NText, NDivider } from 'naive-ui';
import { ref } from 'vue';
import { NTabs, NTabPane } from 'naive-ui';

const nickName = ref('Olegnickname')
const registrationDate = ref('2025.01.01')
const status = ref('offline')
const test = ref('Stats')

</script>

<template>
  <n-flex justify="center" style="height: calc(100dvh - 2rem)">
    <n-flex style="width: 50%; align-items: flex-start">
      <n-card>
        <n-flex>
          <n-avatar :size="125" src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
          <n-flex style="align-items: flex-start" vertical justify="space-between">
            <n-text style="font-size: 2.5em" strong> {{ nickName }}</n-text>
            <n-flex inline>
              <n-flex inline :size="5">
                <n-text style="font-size: 1em">Registration date: </n-text>
                <n-text strong type="info" style="font-size: 1em"> {{ registrationDate }}</n-text>
              </n-flex>
              <n-flex inline :size="5">
                <n-text style="font-size: 1em">Status: </n-text>
                <n-text strong :type="status == 'online' ? 'success' : 'error'" style="font-size: 1em"> {{ status }}</n-text>
              </n-flex>
            </n-flex>
          </n-flex>
        </n-flex>
        <n-divider/>
        <n-tabs v-model:value="test" type="segment" animated>
          <n-tab-pane name="Stats"/>
          <n-tab-pane name="Parties"/>
        </n-tabs>
      </n-card>
    </n-flex>
  </n-flex>
</template>

<style scoped>

</style>
