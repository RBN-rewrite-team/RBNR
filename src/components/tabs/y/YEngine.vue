<script lang="ts" setup>
import { POST_NONREC } from '@/core/post-nonrec';
import { player } from '@/core/save';
import { formatTime, format, formatWhole } from '@/utils/format';
import { getCurrentOrdinal, getCurrentYMilestone, getCurrentYMilestoneIndex } from '@/utils/y-seq';
import { computed } from 'vue';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';

const a = computed(() => {
	return player.hydra.deduceProgress[1].toNumber() * 100 + '%';
});
</script>

<template>
	<div class="main">
		<div class="dims">
			<h3>累计压缩九头蛇能量使BMS推演速度×{{player.hydra.totalCompressedPower.add(1)}}</h3>
			<div class="y-seq-inner">
				<div class="progress">
					<div class="progress-inner"></div>
					<div
						style="
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						"
						v-html="
							`已推演${formatWhole(player.hydra.deduceOrdinal[1])}次<br>` +
							getCurrentYMilestone(player.hydra.deduceOrdinal[1])[1]
						"
					></div>
				</div>
			</div>
			<div class="dim-single">
				<span>第一Y序列维度({{formatWhole(player.postnonrec.yseq.dimensions[0][0])}}+{{formatWhole(player.postnonrec.yseq.dimensions[1][0])}})</span>
				<span>每秒推演{{ format(POST_NONREC.Y_SEQ.dimensionEffect(0)) }}次</span>
				<div class="buy" @click="() => POST_NONREC.Y_SEQ.buyDimensions(0)">购买最大<br>需求: {{ formatWhole(POST_NONREC.Y_SEQ.dimensionsCost(0)) }}压缩九头蛇能量</div>
			</div>
			<div class="dim-single">
				<span>第二Y序列维度({{formatWhole(player.postnonrec.yseq.dimensions[0][1])}}+{{formatWhole(player.postnonrec.yseq.dimensions[1][1])}})</span>
				<span>每秒生产{{ format(POST_NONREC.Y_SEQ.dimensionEffect(1)) }}第一Y序列维度</span>
				<div class="buy" @click="() => POST_NONREC.Y_SEQ.buyDimensions(1)">购买最大<br>需求: {{ formatWhole(POST_NONREC.Y_SEQ.dimensionsCost(1)) }}压缩九头蛇能量</div>
			</div>
			<div
				class="dim-single-centered"
				style="background: linear-gradient(135deg, #1a6c5e, #1fb286, #ef2dfd)"
				@click="POST_NONREC.Y_SEQ.reset()"
			>
				重置Y序列维度，获得{{format(POST_NONREC.Y_SEQ.resetGain())}}压缩九头蛇能量
			</div>
		</div>
		<table align="center">
			<tr>
				<TDUpgrade upgid="621" />
			</tr>
		</table>
	</div>
</template>

<style lang="scss" scoped>
.dims {
	width: 95%;
	margin: auto;
}
.dim-single {
	min-height: 60px;
	display: flex;
	justify-content: space-between;
	padding: 0 20px;
	align-items: center;
	border: 5px;
	overflow: hidden;
}
.dim-single-centered {
	min-height: 60px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border: 5px;
	overflow: hidden;
}
.y-seq-inner {
	align-items: center;
	justify-content: center;
	position: relative;
}
.progress {
	height: 70px;
	position: relative;
	border: 2px solid #007f00;
}
.progress-inner {
	width: v-bind(a);
	height: 100%;
	position: relative;
	background: #007f00;
	transition: 0ms;
}
.buy {
  border: 2px solid #007f00;
  height: 50px;
  width: 300px;
}
</style>
