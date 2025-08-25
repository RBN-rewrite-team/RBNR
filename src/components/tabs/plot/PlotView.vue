<script lang="ts" setup>
import { temp } from '@/core/temp-data';
import { onMounted, ref } from 'vue';
const plotview = ref<HTMLDivElement|null>(null)
const plotcont = ref<HTMLSpanElement|null>(null)
function exitView(){
  if (!plotview.value) return;
  plotview.value.style.opacity="0";
  setTimeout(()=>temp.plotdisplay=0,1000)
}
onMounted(()=>{
  if (plotview.value){
    plotview.value.style.opacity="0";
  }
})
function stepNext() {
  if (plotcont.value){
    plotcont.value.style.opacity="0";
    setTimeout(()=>{
      temp.plotstep++
      if (plotcont.value)
        plotcont.value.style.opacity="1";
    }, 1000);
  }
}
function stepPrev() {
  if (plotcont.value){
    plotcont.value.style.opacity="0";
    setTimeout(()=>{
      temp.plotstep--
      if (plotcont.value)
        plotcont.value.style.opacity="1";
    }, 1000);
  }
}
</script>

<template>
  <div class="plot-view" :style="{'z-index': temp.plotdisplay?7 : -1,opacity: temp.plotdisplay?1:0,'transition-duration': temp.plotdisplay?'1s':'0s'}" ref="plotview">
    <div class="plot-content" >
      <span ref="plotcont" class="plot-cont-desc">
        <template v-if="temp.plotdisplay==1">
          <template v-if="temp.plotstep==0">
            大基数在支撑集合论宇宙的序数高塔中飘荡。
          </template>
          <template v-else-if="temp.plotstep==1">
            随后，Numerorum来到了这个“大数世界”上。
          </template>
          <template v-else-if="temp.plotstep==2">
            Numerorum:......<br>
            Numerorum:醒来了呢。<br>
            Numerorum:该从哪里开始我的目标呢？<br>
            Numerorum:负数显然离我的目标有点远。<br>
            Numerorum:就先从0开始吧。<br>
            “后继×1”...<br>
          </template>
          <template v-else>
            没做完
          </template>
        </template>
      </span>
      <div class="clickable"><div class="clickable_button" @click="exitView()">退出</div></div>
      <div>{{ temp.plotstep }}</div>
      <div class="clickable"><div class="clickable_button" @click="stepPrev()">←</div><div class="clickable_button" @click="stepNext()">→</div></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.plot-view {
	width: 100vw;
	height: 100vh;
	background: var(--background-color);
	z-index: 6;
	position: absolute;
	left: 50%;
	top: 50%;
	overflow: hidden;
	transform: translate(-50%, -50%);
}
.plot-content {
	z-index: 7;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	transition: 2s;

  display: block;
  text-align: center;
  margin: auto;
}
.plot-cont-desc {
  transition-duration: 1s;
}
</style>