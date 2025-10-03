import { readonly, ref } from "vue";

export function useTest() {
  const moves = ref<string[]>([]);
  let count = 0;

  function add() {
    moves.value.push("move " + count++);
  }

  return {
    moves: readonly(moves),
    add
  }
}
