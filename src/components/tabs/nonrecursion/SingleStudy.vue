<script setup lang="ts">
import { buyStudies, studies } from '@/core/nonrecu/studies';
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

<style lang="scss" scoped>
.study{
  border: 2px solid var(--border-color);
  width: fit-content;
  padding: 5px;
}
.study-name {
  text-align: left;
}
.study-desc{
  width: 150px;
  height: 100px;
  border: 2px solid #c98300;
  border-radius: 5px;
  background-color: var(--background-color);
  font-size: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:hover {
    background-color: var(--hover-color);
    cursor: pointer;
  }
}
.study-actived{
  background-color: #c98300;
  border: 2px solid var(--border-color);
}
</style>