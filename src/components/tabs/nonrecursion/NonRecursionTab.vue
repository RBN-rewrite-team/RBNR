<script setup lang="ts">
import TRMilestone from '@/components/TRMilestone.vue';
import SingleStudy from './SingleStudy.vue';

</script>

<template>
  <div class="main">
    <table align="center">
      <TRMilestone id="nonrec_1"></TRMilestone>
    </table>

    <div>
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