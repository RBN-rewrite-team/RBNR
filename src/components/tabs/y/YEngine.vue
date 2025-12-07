<script lang="ts" setup>
import { POST_NONREC } from '@/core/post-nonrec';
import { player } from '@/core/save';
import { format, formatWhole } from '@/utils/format';
import { getCurrentYMilestone } from '@/utils/y-seq';
import { computed } from 'vue';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import { Y_SEQ } from '@/core/post-nonrec/y-seq';
import YSeqDimension from './YSeqDimension.vue';

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
				{{ $t('yeng.totaleffect')
				}}{{ formatWhole(player.hydra.totalCompressedPower.add(1)) }}
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
							`${$t('yeng.progressed', {
								x: formatWhole(player.hydra.deduceOrdinal[1]),
							})}<br>` + getCurrentYMilestone(player.hydra.deduceOrdinal[1])[1]
						"
					></div>
				</div>
			</div>
			<YSeqDimension :seq_id="0" />
			<YSeqDimension :seq_id="1" />
			<YSeqDimension :seq_id="2" />
			<YSeqDimension :seq_id="3" />
			<div class="dim-single-centered hydra_reset" @click="POST_NONREC.Y_SEQ.reset()">
				<span style="display: relative; z-index: 1">{{
					$t('yeng.reset', {
						gain: format(POST_NONREC.Y_SEQ.resetGain()),
					})
				}}</span>
			</div>
		</div>
		<!-- <div class="resetbar">
			<div class="resets">
				<div class="text-psd-center">
					转生<sub>2</sub>(0.0000)<br />Y序列生产×1.0000<br />(Coming s∞n)
				</div>
			</div>
			<div class="resets"><div class="text-psd-center">Coming s∞n</div></div>
			<div class="resets"><div class="text-psd-center">Coming s∞n</div></div>
			<div class="resets"><div class="text-psd-center">Coming s∞n</div></div>
		</div> -->
		<table align="center">
			<tr>
				<TDUpgrade upgid="621" />
				<TDUpgrade upgid="622" />
				<TDUpgrade upgid="623" />
				<TDUpgrade upgid="624" />
			</tr>
			<tr v-if="player.upgrades[624]">
				<TDUpgrade upgid="625" />
				<TDUpgrade upgid="626" />
				<TDUpgrade upgid="627" />
				<TDUpgrade upgid="628" />
			</tr>
			<tr v-if="player.upgrades[628]">
				<TDUpgrade upgid="629" />
				<TDUpgrade upgid="6210" />
				<TDUpgrade upgid="6211" />
				<TDUpgrade upgid="6212" />
			</tr>
			<tr v-if="player.upgrades[6212]">
				<TDUpgrade upgid="6213" />
				<TDUpgrade upgid="6214" />
				<TDUpgrade upgid="6215" />
				<TDUpgrade upgid="6216" />
			</tr>
			<tr v-if="player.upgrades[6216]">
				<TDUpgrade upgid="6217" />
			</tr>
			<tr>
				<TDUpgrade upgid="65" />
				<TDUpgrade upgid="66" />
			</tr>
		</table>
	</div>
</template>

<style lang="scss" scoped>
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
.resets {
	border: 1px solid var(--color);
	width: 100%;
	height: 100%;
	position: relative;
}
.resetbar {
	width: 95%;
	margin: auto;
	display: flex;
	justify-content: space-around;
	height: 90px;
}
.text-psd-center {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 14px;
}
</style>
