<script setup lang="ts">
import { temp } from '@/core/temp-data';
import PlotNode from './PlotNode.vue';

</script>

<template>
  <div class="main">
    <h1>剧情设定</h1>
    <div style="position: relative;">
      <PlotNode style="top: 10px; left: 30px;" @click="temp.plotdisplay = 1"><vue-latex expression="-\varepsilon"></vue-latex></PlotNode>
      <div class="node" style="top: -17.2px;left: 93px;background-color: var(--color);width: 100px;height: 1px;"></div>
      <PlotNode style="top: -43.2px;left: 202.5px;">未解锁</PlotNode>
      <div class="node" style="top: -70.2px;left: 265px;background-color: var(--color);width: 100px;height: 1px;"></div>
      <PlotNode style="top: -97.2px;left: 375px;">未解锁</PlotNode>
      
    </div>
  </div>
</template>

<style lang="css" scoped>
.node {
  position: relative;
}
</style>