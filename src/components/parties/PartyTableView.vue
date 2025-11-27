<script setup lang="ts">
import type { ChessParty, GameStatus } from '@/types/ChessParty'
import { NFlex, NIcon, NText, type DataTableColumns, NDataTable } from 'naive-ui'
import { computed, h } from 'vue'
import PlayerWithColorName from './PlayerWithColorName.vue'
import { getSimpleStatus } from '@/util/ChessPartyUtil.vue'
import LiveIcon from '../icon/LiveIcon.vue'
import PlusIcon from '../icon/PlusIcon.vue'
import DrawIcon from '../icon/DrawIcon.vue'
import MinusIcon from '../icon/MinusIcon.vue'
import type { RowData } from 'naive-ui/es/data-table/src/interface'
import { useRouter } from 'vue-router'

const props = defineProps<{
  parties: ChessParty[]
  playerId: string
  loading?: boolean
}>();

const loading = computed(() => props.loading ?? false)

const formatTime = (ms: number): string => {
  const seconds = ms / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (days >= 1) {
    return `${days}`;
  } else if (hours >= 1) {
    return `${hours}`;
  } else if (minutes >= 1) {
    return `${minutes}`;
  } else {
    return `${seconds}`;
  }
};

const formatIncrement = (ms: number): string => {
  const seconds = ms / 1000;

  if (seconds === 0) return '0';
  if (seconds < 60) return `${seconds}s`;

  const minutes = seconds / 60;
  return `${minutes}`;
};

function createColumns(): DataTableColumns<ChessParty> {
  return [
  {
    title: 'Players',
    key: 'playerInfo',
    render(row) {
      return h(
        NFlex,
        { vertical: true },
        {
          default: () => [
            h(PlayerWithColorName, {
              color: 'white',
              playerName: row.white.name,
              border: getSimpleStatus(row.status) == "WIN_WHITE" ? true : false
            }),
            h(PlayerWithColorName, {
              color: 'black',
              playerName: row.black.name,
              border: getSimpleStatus(row.status) == "WIN_BLACK" ? true : false
            })
          ]
        }
      )
    }

  },
  {
    title: 'Result',
    key: 'result',
    render(row) {
      const status: GameStatus = getSimpleStatus(row.status)
      const isWhiteWinner = status == 'WIN_WHITE' && row.white.id == props.playerId
      const isBlackWinner = status == 'WIN_BLACK' && row.black.id == props.playerId
      const isDraw = status == 'DRAW'
      const isLive = status == 'NOT_FINISHED'

      return h(
        NIcon,
        { size: 27 },
        {
          default: () => {
            if(isWhiteWinner || isBlackWinner) return h(PlusIcon)
            else if(isLive) return h(LiveIcon)
            else if(isDraw) return h(DrawIcon)
            else return h(MinusIcon)
          }
        }
      )
    }
  },
  {
    title: 'Moves',
    key: 'moves',
    render(row) {
      return h(NText, { depth: 2 }, { default: () => row.status == 'NOT_FINISHED' ? '-' : row.moves.length })
    }
  },
  {
    title: 'Time control',
    key: 'timeControl',
    render(row) {
      if(row.timeControl == null) return '-'
      return h(NText, { depth: 2 }, { default: () => `${formatTime(row.timeControl!.initTime)} | +${formatIncrement(row.timeControl!.increment)}`})
    }
  }
]
}

function createProps(row: RowData) {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      router.push(`/game/${row.id}`)
    }
  }
}

const columns = createColumns()
const router = useRouter()
const pagination = { pageSize: 10 }


</script>

<template>
  <n-data-table
    :data="props.parties"
    :columns="columns"
    :row-props="createProps"
    :pagination="pagination"
    :loading="loading">
  </n-data-table>
</template>
