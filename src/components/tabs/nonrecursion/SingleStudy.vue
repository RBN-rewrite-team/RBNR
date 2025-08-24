<script setup lang="ts">
import { buyStudies, canBuyStudies, studies } from '@/core/nonrecu/studies';
import { player } from '@/core/save';
import { formatWhole } from '@/utils/format';

const props = defineProps<{
  study_id: number // keyof typeof studies
}>()

const study = studies[props.study_id]

const useClass = () => {
  if (player.nonrecu.studies_bought.includes(props.study_id)) {
    return "study-actived"
  }
  if (canBuyStudies(props.study_id)) {
    return 'study-buyable'
  }
}
</script>

<template>
  <div class="study">
    <div class="study-name">{{ study.id }}</div>
    <div class="study-desc" @click="buyStudies(props.study_id)" :class="useClass()">
      <div v-html="study.description"></div>
      <div>花费: {{ formatWhole(study.cost) }} 非递归理论</div>
    </div>
  </div>
</template>
