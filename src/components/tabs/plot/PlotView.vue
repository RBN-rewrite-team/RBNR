<script lang="ts" setup>
import { temp } from '@/core/temp-data';
import { onMounted, ref } from 'vue';
const plotview = ref<HTMLDivElement|null>(null)
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
</script>

<template>
  <div class="plot-view" :style="{'z-index': temp.plotdisplay?7 : -1,opacity: temp.plotdisplay?1:0,'transition-duration': temp.plotdisplay?'1s':'0s'}" ref="plotview">
    <div class="plot-content" >
      大基数在支撑集合论宇宙的序数高塔中飘荡。<br />
      
      <div class="clickable"><div class="clickable_button" @click="exitView()">退出</div></div>
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
	transition: color 2s;

  display: block;
  text-align: center;
  margin: auto;
}
</style>