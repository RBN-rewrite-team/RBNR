<script setup lang="ts">
import { temp } from '@/core/temp-data';
import PlotNode from './PlotNode.vue';
import { unlockedPlots } from '@/core/plot';
function enterPlot(i: number) {
	if (unlockedPlots() >= i) {
		temp.plotdisplay = i;
	}
}
</script>

<template>
	<div class="main">
		<h1>剧情设定</h1>
		<div style="position: fixed">
			<PlotNode style="top: 10px; left: 30px" @click="temp.plotdisplay = 1"
				><vue-latex expression="-\varepsilon"></vue-latex
			></PlotNode>
			<PlotNode style="top: 10px; left: 202.5px" @click="enterPlot(2)">
				<template v-if="unlockedPlots() >= 2"
					><vue-latex expression="0"></vue-latex></template
				><template v-else>未解锁</template>
			</PlotNode>
			<PlotNode style="top: 10px; left: 375px" @click="enterPlot(3)">
				<template v-if="unlockedPlots() >= 3"
					><vue-latex expression="1"></vue-latex></template
				><template v-else>未解锁</template>
			</PlotNode>
			<PlotNode style="top: 10px; left: 547.5px" @click="enterPlot(4)">
				<template v-if="unlockedPlots() >= 4"
					><vue-latex expression="2"></vue-latex></template
				><template v-else>未解锁</template>
			</PlotNode>
			<PlotNode style="top: 100px; left: 30px" @click="enterPlot(5)">
				<template v-if="unlockedPlots() >= 5"
					><vue-latex expression="C\cdot4"></vue-latex></template
				><template v-else>未解锁</template>
			</PlotNode>
			<PlotNode style="top: 100px; left: 202.5px" @click="enterPlot(6)">
				<template v-if="unlockedPlots() >= 6"
					><vue-latex expression="3"></vue-latex></template
				><template v-else>未解锁</template>
			</PlotNode>
			<PlotNode style="top: 100px; left: 375px" @click="enterPlot(7)">
				<template v-if="unlockedPlots() >= 7"
					><vue-latex expression="3\frac{1}{4}"></vue-latex></template
				><template v-else>未解锁</template>
			</PlotNode>
			<PlotNode style="top: 100px; left: 547.5px" @click="enterPlot(8)">
				<template v-if="unlockedPlots() >= 8"
					><vue-latex expression="3\frac{1}{2}"></vue-latex></template
				><template v-else>未解锁</template>
			</PlotNode>
			<PlotNode style="top: 200px; left: 30px" @click="enterPlot(9)">
				<template v-if="unlockedPlots() >= 9"
					><vue-latex expression="\frac{1}{x}"></vue-latex></template
				><template v-else>未解锁</template>
			</PlotNode>
			<PlotNode style="top: 200px; left: 202.5px" @click="enterPlot(10)">
				<template v-if="unlockedPlots() >= 10"
					><vue-latex expression="4"></vue-latex></template
				><template v-else><vue-latex expression="?"></vue-latex></template>
			</PlotNode>
			<PlotNode style="top: 200px; left: 375px" @click="enterPlot(11)">
				<template v-if="unlockedPlots() >= 11"
					><vue-latex expression="5"></vue-latex></template
				><template v-else><vue-latex expression="?"></vue-latex></template>
			</PlotNode>
			<PlotNode style="top: 200px; left: 547.5px" @click="enterPlot(12)">
				<template v-if="unlockedPlots() >= 12"
					><vue-latex expression="Dil"></vue-latex></template
				><template v-else><vue-latex expression="?"></vue-latex></template>
			</PlotNode>
			<PlotNode style="top: 300px; left: 30px" @click="enterPlot(13)">
				<template v-if="unlockedPlots() >= 13"
					><vue-latex expression="Pri"></vue-latex></template
				><template v-else><vue-latex expression="?"></vue-latex></template>
			</PlotNode>
			<PlotNode style="top: 300px; left: 202.5px" @click="enterPlot(14)">
				<template v-if="unlockedPlots() >= 14"
					><vue-latex expression="6"></vue-latex></template
				><template v-else><vue-latex expression="?"></vue-latex></template>
			</PlotNode>
			<PlotNode style="top: 300px; left: 375px" @click="enterPlot(15)">
				<template v-if="unlockedPlots() >= 15"
					><vue-latex expression="6C"></vue-latex></template
				><template v-else><vue-latex expression="?"></vue-latex></template>
			</PlotNode>
			<PlotNode style="top: 400px; left: 30px" @click="enterPlot(16)">
				<template v-if="unlockedPlots() >= 16"
					><span style="font-size: 50%">M-6-24</span></template
				><template v-else><vue-latex expression="?"></vue-latex></template>
			</PlotNode>
		</div>
	</div>
</template>

<style lang="css" scoped>
.node {
	position: absolute;
}
</style>
