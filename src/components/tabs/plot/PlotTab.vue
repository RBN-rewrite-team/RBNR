<script setup lang="ts">
import { temp } from '@/core/temp-data';
import PlotNode from './PlotNode.vue';
import { unlockedPlots } from '@/core/plot';
function enterPlot(i: number){
  if (unlockedPlots()>=i){temp.plotdisplay=i}
}
</script>

<template>
  <div class="main">
    <h1>剧情设定</h1>
    <div style="position: fixed;">
      <PlotNode style="top: 10px; left: 30px;" @click="temp.plotdisplay = 1"><vue-latex expression="-\varepsilon"></vue-latex></PlotNode>
      <div class="node" style="top: 35.7px;left: 93px;background-color: var(--color);width: 100px;height: 1px;"></div>
      <PlotNode style="top: 10px;left: 202.5px;" @click="enterPlot(2)">
        <template v-if="unlockedPlots()>=2"><vue-latex expression="0"></vue-latex></template><template v-else>未解锁</template>
      </PlotNode>
      <div class="node" style="top: 35.7px;left: 265px;background-color: var(--color);width: 100px;height: 1px;"></div>
      <PlotNode style="top: 10px;left: 375px;" @click="enterPlot(3)">
        <template v-if="unlockedPlots()>=3"><vue-latex expression="1"></vue-latex></template><template v-else>未解锁</template>
      </PlotNode>
      <PlotNode style="top: 10px;left: 547.5px;" @click="enterPlot(4)">
        <template v-if="unlockedPlots()>=4"><vue-latex expression="2"></vue-latex></template><template v-else>未解锁</template>
      </PlotNode>
      
    </div>
  </div>
</template>

<style lang="css" scoped>
.node {
  position: absolute;
}
</style>