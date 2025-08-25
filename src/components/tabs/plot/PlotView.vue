<script lang="ts" setup>
import { temp } from '@/core/temp-data';
import { onMounted, ref } from 'vue';
import PlotSentence from './PlotSentence.vue';
const plotview = ref<HTMLDivElement|null>(null)
const plotcont = ref<HTMLSpanElement|null>(null)
function exitView(){
  if (!plotview.value) return;
  plotview.value.style.opacity="0";
  setTimeout(()=>{temp.plotdisplay=0; temp.plotstep = 0},1000)
}
onMounted(()=>{
  if (plotview.value){
    plotview.value.style.opacity="0";
  }
})
/*function stepNext() {
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
}*/
function nextStep() {
	if(Date.now() >= temp.plotcd)
	{
		temp.plotstep++;
		temp.plotcd = Date.now() + 500;
	}
}
</script>

<template>
  <div class="plot-view" :style="{'z-index': temp.plotdisplay?7 : -1,opacity: temp.plotdisplay?1:0}" ref="plotview">
    <div class="plot-content" style="width: 100%">
      <span ref="plotcont" style="width: 100%">
	<table style="width: 100%; margin: -200px 50px; border-spacing: 10px; position: absolute; bottom: 0%">
		<template v-if="temp.plotdisplay == 1">
			<PlotSentence
				v-if="temp.plotstep >= 0"
				name="???"
				image=""
				text="大基数在支撑集合论宇宙的序数高塔中飘荡。"
			/>
			<PlotSentence
				v-if="temp.plotstep >= 1"
				name="???"
				image=""
				text="随后，Numerorum来到了这个“大数世界”上。"
			/>
			<PlotSentence
				v-if="temp.plotstep >= 2"
				name="Numerorum"
				image=""
				text="......"
			/>
			<PlotSentence
				v-if="temp.plotstep >= 3"
				name="Numerorum"
				image=""
				text="醒来了呢。"
			/>
			<PlotSentence
				v-if="temp.plotstep >= 4"
				name="Numerorum"
				image=""
				text="该从哪里开始我的目标呢？"
			/>
			<PlotSentence
				v-if="temp.plotstep >= 5"
				name="Numerorum"
				image=""
				text="负数显然离我的目标有点远。"
			/>
			<PlotSentence
				v-if="temp.plotstep >= 6"
				name="Numerorum"
				image=""
				text="就先从0开始吧。"
			/>
		</template>
	</table>
      </span>
    </div>
	<button class="exit" @click="exitView()">×</button>
	<button class="next" @click="nextStep()">继续(冷却500ms)</button>
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

  display: block;
  text-align: center;
  margin: auto;
}
.exit {
	z-index: 8;
	background-color: red;
	position: absolute;
	top: 0%;
	right: 0%;
	border: 1px solid orange;
	width: 60px;
	height: 60px;
	font-size: 30px;
	color: orange;
	font-weight: bold;
}
.next {
	z-index: 8;
	background-color: rgb(0, 0, 0, 1);
	position: absolute;
	bottom: 20px;
	left: 50%;
	transform: translateX(-50%);
	border: 1px solid lightgreen;
	width: 75%;
	height: 100px;
	font-size: 40px;
	color: green;
	font-weight: bold;
}
.next:hover {
	background-color: lightgreen;
	color: black;
}
</style>