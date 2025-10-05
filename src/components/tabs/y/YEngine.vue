<script lang="ts" setup>
import { POST_NONREC } from '@/core/post-nonrec';
import { player } from '@/core/save';
import { formatTime, format, formatWhole } from '@/utils/format';
import { getCurrentOrdinal, getCurrentYMilestone, getCurrentYMilestoneIndex } from '@/utils/y-seq';
import { computed } from 'vue';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import { Y_SEQ } from '@/core/post-nonrec/y-seq';

const a = computed(() => {
	return player.hydra.deduceProgress[1].toNumber() * 100 + '%';
});
const dim1progress = computed(() => {
	return (
		player.postnonrec.yseq.dimensions[1][0]
			.sub(player.postnonrec.yseq.dimensions[1][0].floor())
			.toNumber() *
			100 +
		'%'
	);
});
const dim2progress = computed(() => {
	return (
		player.postnonrec.yseq.dimensions[1][1]
			.sub(player.postnonrec.yseq.dimensions[1][1].floor())
			.toNumber() *
			100 +
		'%'
	);
});
const dim3progress = computed(() => {
	return (
		player.postnonrec.yseq.dimensions[1][2]
			.sub(player.postnonrec.yseq.dimensions[1][2].floor())
			.toNumber() *
			100 +
		'%'
	);
});
const dim4progress = computed(() => {
	return (
		player.postnonrec.yseq.dimensions[1][3]
			.sub(player.postnonrec.yseq.dimensions[1][3].floor())
			.toNumber() *
			100 +
		'%'
	);
});
</script>

<template>
	<div class="main">
		<div class="dims">
			<h3>
				累计压缩九头蛇能量使BMS推演速度×{{
					formatWhole(player.hydra.totalCompressedPower.add(1))
				}}
			</h3>
			<div class="y-seq-inner">
				<div class="progress">
					<div
						v-if="POST_NONREC.Y_SEQ.dimensionEffect(0).lt(10)"
						class="progress-inner"
					></div>
					<div v-else class="progress-inner-fast" />
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
			<div
				class="dim-single dim1_progress_bar"
				:class="{ fast: POST_NONREC.Y_SEQ.dimensionEffect(1).gte(10) }"
			>
			  <div style="text-align: left">
				<span
					>第一Y序列维度({{ formatWhole(player.postnonrec.yseq.dimensions[0][0]) }}+{{
						formatWhole(player.postnonrec.yseq.dimensions[1][0])
					}})</span
				><br>
				×{{format(Y_SEQ.dimensionBoost(0))}}
				</div>
				<span>每秒推演{{ format(POST_NONREC.Y_SEQ.dimensionEffect(0)) }}次</span>
				<div class="buy" @click="() => POST_NONREC.Y_SEQ.buyDimensions(0)">
					购买最大<br />需求:
					{{ formatWhole(POST_NONREC.Y_SEQ.dimensionsCost(0)) }}压缩九头蛇能量
				</div>
			</div>
			<div
				class="dim-single dim2_progress_bar"
				:class="{ fast: POST_NONREC.Y_SEQ.dimensionEffect(2).gte(10) }"
			>
			  <div style="text-align: left">
				<span
					>第二Y序列维度({{ formatWhole(player.postnonrec.yseq.dimensions[0][1]) }}+{{
						formatWhole(player.postnonrec.yseq.dimensions[1][1])
					}})</span
				>
				<br>
				×{{format(Y_SEQ.dimensionBoost(1))}}
				</div>
				<span>每秒生产{{ format(POST_NONREC.Y_SEQ.dimensionEffect(1)) }}第一Y序列维度</span>
				<div class="buy" @click="() => POST_NONREC.Y_SEQ.buyDimensions(1)">
					购买最大<br />需求:
					{{ formatWhole(POST_NONREC.Y_SEQ.dimensionsCost(1)) }}压缩九头蛇能量
				</div>
			</div>
			<div
				class="dim-single dim3_progress_bar"
				:class="{ fast: POST_NONREC.Y_SEQ.dimensionEffect(3).gte(10) }"
			>
			  <div style="text-align: left">
				<span
					>第三Y序列维度({{ formatWhole(player.postnonrec.yseq.dimensions[0][2]) }}+{{
						formatWhole(player.postnonrec.yseq.dimensions[1][2])
					}})</span
				><br>
				×{{format(Y_SEQ.dimensionBoost(2))}}
        </div>
				<span>每秒生产{{ format(POST_NONREC.Y_SEQ.dimensionEffect(2)) }}第二Y序列维度</span>
				<div class="buy" @click="() => POST_NONREC.Y_SEQ.buyDimensions(2)">
					购买最大<br />需求:
					{{ formatWhole(POST_NONREC.Y_SEQ.dimensionsCost(2)) }}压缩九头蛇能量
				</div>
			</div>
			<div class="dim-single dim4_progress_bar" :class="{ fast: Y_SEQ.u627effect().gte(10) }">
			  <div style="text-align: left">
				<span
					>第四Y序列维度({{ formatWhole(player.postnonrec.yseq.dimensions[0][3]) }}+{{
						formatWhole(player.postnonrec.yseq.dimensions[1][3])
					}})</span
				><br>
				×{{format(Y_SEQ.dimensionBoost(3))}}
				</div>
				<span>每秒生产{{ format(POST_NONREC.Y_SEQ.dimensionEffect(3)) }}第三Y序列维度</span>
				<div class="buy" @click="() => POST_NONREC.Y_SEQ.buyDimensions(3)">
					购买最大<br />需求:
					{{ formatWhole(POST_NONREC.Y_SEQ.dimensionsCost(3)) }}压缩九头蛇能量
				</div>
			</div>
			<div class="dim-single-centered hydra_reset" @click="POST_NONREC.Y_SEQ.reset()">
				<span style="display: relative; z-index: 1"
					>重置Y序列维度，获得{{
						format(POST_NONREC.Y_SEQ.resetGain())
					}}压缩九头蛇能量</span
				>
			</div>
		</div>
		<table align="center">
			<tr>
				<TDUpgrade upgid="621" />
				<TDUpgrade upgid="622" />
				<TDUpgrade upgid="623" />
				<TDUpgrade upgid="624" />
			</tr>
			<tr>
				<TDUpgrade upgid="625" />
				<TDUpgrade upgid="626" />
				<TDUpgrade upgid="627" />
				<TDUpgrade upgid="628" />
			</tr>
			<tr>
				<TDUpgrade upgid="629" />
				<TDUpgrade upgid="6210" />
			</tr>
		</table>
	</div>
</template>

<style lang="scss" scoped>
import "sass:color"
.dims {
	width: 95%;
	margin: auto;
}
@mixin dim_progress_bar($width-var, $color) {
	position: relative;
	border: 2px solid $color;
	--current-dim-color: #{$color};

	&::before {
		pointer-events: none;
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: #{$width-var};
		height: 100%;
		background: color.adjust($color, $alpha: -0.5);
		transition: 0ms;
		z-index: 0;
	}

	&.fast::before {
		background: linear-gradient(
			-45deg,
			color.adjust($color, $alpha: -0.7) 0,
			color.adjust($color, $alpha: -0.7) 25%,
			color.adjust($color, $alpha: -0.5) 25%,
			color.adjust($color, $alpha: -0.5) 50%,
			color.adjust($color, $alpha: -0.7) 50%,
			color.adjust($color, $alpha: -0.7) 75%,
			color.adjust($color, $alpha: -0.5) 75%,
			color.adjust($color, $alpha: -0.5)
		);
		background-size: 200px 200px;
		background-repeat: repeat;
		animation: scroll_left 3s linear infinite;
		width: 200%;
	}
}
.dim-single {
	min-height: 70px;
	display: flex;
	justify-content: space-between;
	padding: 0 20px;
	align-items: center;
	border: 5px;
	overflow: hidden;

	&.dim1_progress_bar {
		@include dim_progress_bar(v-bind(dim1progress), #7f0000);
	}

	&.dim2_progress_bar {
		@include dim_progress_bar(v-bind(dim2progress), #7f007f);
	}

	&.dim3_progress_bar {
		@include dim_progress_bar(v-bind(dim3progress), #7f7f00);
	}

	&.dim4_progress_bar {
		@include dim_progress_bar(v-bind(dim4progress), #c17f00);
	}
}
.dim-single-centered {
	min-height: 70px;
	display: flex;
	justify-content: space-around;
	align-items: center;
	border: 5px;
	overflow: hidden;

	&.hydra_reset {
		background: linear-gradient(135deg, #1a6c5e, #1fb286, #ef2dfd);
		position: relative;

		&::before {
			content: '';
			background: var(--background-color);
			position: absolute;
			width: calc(100% - 4px);
			height: calc(100% - 4px);
			top: 2px;
			left: 2px;
		}
	}
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
	overflow: hidden;
}

.progress-inner {
	width: v-bind(a);
	height: 100%;
	position: relative;
	background: rgba(0, 127, 0, 0.5);
	transition: 0ms;
}
.buy {
	border: 2px solid var(--current-dim-color);
	height: 50px;
	width: 300px;
}
.progress-inner-fast {
	height: 100%;
	position: absolute;
	transition: 0ms;
	background: linear-gradient(
		-45deg,
		rgba(0, 127, 0, 0.3) 0,
		rgba(0, 127, 0, 0.3) 25%,
		rgba(0, 127, 0, 0.5) 25%,
		rgba(0, 127, 0, 0.5) 50%,
		rgba(0, 127, 0, 0.3) 50%,
		rgba(0, 127, 0, 0.3) 75%,
		rgba(0, 127, 0, 0.5) 75%,
		rgba(0, 127, 0, 0.5)
	);
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 0px;
	background-size: 200px 200px;
	background-repeat: repeat;
	animation: scroll_left 3s linear infinite;
	width: 200%;
}
@keyframes scroll_left {
	0% {
		transform: translateX(0%);
	}
	100% {
		transform: translateX(-50%);
	}
}
</style>
