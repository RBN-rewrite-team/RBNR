<script setup lang="ts">
import TRMilestone from '@/components/TRMilestone.vue';
import StudyTree from './StudyTree.vue';
import { formatWhole } from '@/utils/format';
import { addTheories, theoriesCost } from '@/core/nonrecu/studies';

</script>

<template>
  <div class="main">
    <table align="center">
      <TRMilestone id="nonrec_1"></TRMilestone>
    </table>

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