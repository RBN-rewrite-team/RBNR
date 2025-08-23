<script setup lang="ts">
import TRMilestone from '@/components/TRMilestone.vue';
import SingleStudy from './SingleStudy.vue';
import { formatWhole } from '@/utils/format';
import { addTheories, theoriesCost } from '@/core/nonrecu/studies';

</script>

<template>
  <div class="main">
    <table align="center">
      <TRMilestone id="nonrec_1"></TRMilestone>
    </table>

    <div>
      <div class="studies_row">
        <div class="study">
          <div class="study-name">NRT1</div>
          <div class="study-desc" @click="addTheories(0)">
            <div>获得一个非递归理论</div>
            <div>花费: {{ formatWhole(theoriesCost(0)) }} 九头蛇能量</div>
          </div>
        </div>
        <div class="study">
          <div class="study-name">NRT2</div>
          <div class="study-desc" @click="addTheories(1)">
            <div>获得一个非递归理论</div>
            <div>花费: {{ formatWhole(theoriesCost(1)) }} 九头蛇溶液</div>
          </div>
        </div>
        <div class="study">
          <div class="study-name">NRT3</div>
          <div class="study-desc" @click="addTheories(2)">
            <div>获得一个非递归理论</div>
            <div>花费: {{ formatWhole(theoriesCost(2)) }} 非递归能量</div>
          </div>
        </div>
      </div>
      <div class="studies_row">
        <SingleStudy :study_id="0"></SingleStudy>
        <SingleStudy :study_id="1"></SingleStudy>
      </div>
    </div>
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