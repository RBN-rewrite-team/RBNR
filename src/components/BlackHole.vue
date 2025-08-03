<script lang="ts" setup>
import { player } from '@/core/global';
function getBHsize(t: number) {
  return 0
  if (t < 500) return 0
  else return (t - 500) / 2 + Math.max(t-550,0) * 2
}
</script>

<template>
  <div class="bh" :style="{
    width: getBHsize(player.singularity.t)+'vw',
    height: getBHsize(player.singularity.t)+'vw',
  }" />
</template>

<style>
.bh {
  width: 0vw;
  height: 0vw;
  background: black;
  border-radius: 50%;
  z-index: 1;
  position: absolute;
  left: 50%;
  top: 50%;
  overflow: hidden
}
</style>