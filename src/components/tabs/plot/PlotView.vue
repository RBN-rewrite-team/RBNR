<script lang="ts" setup>
import { temp } from '@/core/temp-data';
import { onMounted, onUnmounted, ref } from 'vue';
import PlotSentence from './PlotSentence.vue';
import { player } from '@/core/save';
import { plots, stringToPlot } from '@/core/plot';
const plotview = ref<HTMLDivElement | null>(null);
const plotcont = ref<HTMLSpanElement | null>(null);
function exitView() {
	if (!plotview.value) return;
	plotview.value.style.opacity = '0';
	setTimeout(() => {
		temp.plotdisplay = 0;
		temp.plotstep = 0;
	}, 1000);
}
onMounted(() => {
	if (plotview.value) {
		plotview.value.style.opacity = '0';
	}
});
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
	if (Date.now() >= temp.plotcd) {
		temp.plotstep++;
		temp.plotcd = Date.now() + 500;
	}
}
let a: number = -115;
</script>

<template>
	<div
		class="plot-view"
		:style="{ 'z-index': temp.plotdisplay ? 7 : -1, opacity: temp.plotdisplay ? 1 : 0 }"
		ref="plotview"
	>
		<div class="plot-content" style="width: 100%">
			<span ref="plotcont" style="width: 100%">
				<table
					style="
						width: 100%;
						margin: -200px 50px;
						border-spacing: 10px;
						position: absolute;
						bottom: 0%;
					"
				>
					<template v-if="temp.plotdisplay">
						<template v-for="(plotobj, key) in plots[temp.plotdisplay - 1]">
							<PlotSentence
								v-if="temp.plotstep > key - 1"
								:name="stringToPlot(plotobj).name"
								:image="stringToPlot(plotobj).image"
								:text="stringToPlot(plotobj).text"
							></PlotSentence>
						</template>
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
	top: 10%;
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
	bottom: 10vh;
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
