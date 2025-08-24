<script setup lang="ts">
import TRMilestone from '@/components/TRMilestone.vue';
import StudyTree from './StudyTree.vue';
import { formatWhole } from '@/utils/format';
import { addTheories, theoriesCost } from '@/core/nonrecu/studies';
import { getTotalTheories } from '@/core/nonrecu/total-theories';
import { Currencies, getCurrency } from '@/core/currencies';
import { player } from '@/core/global';

</script>

<template>
  <div class="main">
    <p>你非递归重置了<b style="color: #c98300; font-size: 30px">{{ formatWhole(player.nonrecu.resetTimes) }}</b>次。</p>
    <table align="center">
      <TRMilestone :id="'nonrec_'+i" v-for="i in 2" :key="i"></TRMilestone>
    </table>
    <p>你一共有<b style="color: #c98300; font-size: 30px">{{ formatWhole(getTotalTheories()) }}</b>非递归理论，还剩下{{ formatWhole(getCurrency(Currencies.NRT)) }}。</p>
    <StudyTree />
  </div>
</template>

<style lang="scss" scoped>
.studies_row{
  display: flex;
  justify-content: center;
}
.studies_row > .study {
  margin: 7px;
}

</style>