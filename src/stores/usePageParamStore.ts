import { defineStore } from "pinia";
import { ref } from "vue";

export const usePageParamStore = defineStore('usePageParam', () => {

  const lastGameId = ref <string | null>(null);

  function setLastGameId(gameId: string | null) {
    lastGameId.value = gameId;
  }

  return {
    lastGameId,
    setLastGameId,
  }

})
