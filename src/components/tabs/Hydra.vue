<script setup lang="ts">
import {player, feature} from '@/core/global';
import {format, formatWhole} from '@/utils/format';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
import {OrdinalUtils} from '@/utils/ordinal';
import Decimal from 'break_eternity.js';

function powerFactorHTML(): string {
	let s = '';
	s += format(player.hydra.powerMult[0]) + ' x ' + format(player.hydra.powerMult[1]) + ' x ' + format(player.hydra.powerMult[2]) + ' x ' + format(player.hydra.powerMult[3]);
	if(!feature.Hydra.powerExtraMult().eq(1)) s += ' x <span style="color: rgb(155, 125, 195)">' + format(feature.Hydra.powerExtraMult()) + '</span>';
	if(!feature.Hydra.powerExp().eq(1)) s = '(' + s + ')<sup>' + format(feature.Hydra.powerExp()) + '</sup>';
	s += '<span style="color: var(--color)"> = ' + format(feature.Hydra.powerGain()) + '</span>';
	return s;
}

function deduceButtonStyle(): string {
	let pc = player.hydra.deduceProgress[player.hydra.visiting].mul(100).toNumber();
	return 'linear-gradient(to right, rgba(155, 125, 195, 0.5) ' + pc + '%, var(--background-color) ' + pc + '%)';
}
</script>

<template>
	<div class="main" align="center">
		<h3 style="color: rgb(200, 190, 245)" v-html="powerFactorHTML()"></h3>
		<table style="width: 100%">
		  <tbody>
			<tr>
				<td style="width: 50%">
					<button class="hydra-button" :style="{ 'background-image': deduceButtonStyle() }"><span class="hydra-text">
						{{OrdinalUtils.numberToBMS(player.hydra.deduceOrdinal[0], new Decimal(4))}}
					</span></button>
				</td>
				<td style="width: 50%">
					<button class="hydra-button-reset" @click="feature.Hydra.hydraReset(player.hydra.visiting)"
					  v-hold="{handler: {onProgress() {feature.Hydra.hydraReset(player.hydra.visiting)}}}"
					><span class="hydra-text">
						<h2 style="color: rgb(200, 190, 245)">重置</h2>
						<h3 style="color: rgb(155, 125, 195)">+{{format(feature.Hydra.powerGain())}}九头蛇能量</h3>
						<br>
						当前重置使乘数+{{format(feature.Hydra.deduceEff(player.hydra.visiting).mul(player.hydra.deduceOrdinal[player.hydra.visiting]))}}
					</span></button>
				</td>
			</tr>
			</tbody>
		</table>
		<table style="width: 100%; transform: translateY(-40px)">
			<tr>
				<td style="width: 25%">
					<button class="hydra-button-short" @click="feature.Hydra.prestige(0)"><span class="hydra-text-short">
						<span v-if="feature.Hydra.pUnlock(0)">
							<h3>转生({{formatWhole(player.hydra.prestige[0])}})</h3>
							额外乘数与推演速度<br>x{{format(feature.Hydra.prestigeEff(0, false))}}→{{format(feature.Hydra.prestigeEff(0, true))}}(效果×{{format(feature.Hydra.prestigeEff(0, false, true))}})
						</span>
						<span v-else>基础乘数≥2解锁</span>
					</span></button>
				</td>
				<td style="width: 25%">
					<button class="hydra-button-short" @click="feature.Hydra.prestige(1)"><span class="hydra-text-short">
						<span v-if="feature.Hydra.pUnlock(1)">
							<h3>飞升({{formatWhole(player.hydra.prestige[1])}})</h3>
							额外指数<br>+{{format(feature.Hydra.prestigeEff(1, false))}}→{{format(feature.Hydra.prestigeEff(1, true))}}
						</span>
						<span v-else>转生效果≥20解锁</span>
					</span></button>
				</td>
				<td style="width: 25%">
					<button class="hydra-button-short"><span class="hydra-text-short">
						<span v-if="feature.Hydra.pUnlock(2)">
							<h3>超越({{formatWhole(player.hydra.prestige[2])}})</h3>
							???<br>+{{format(feature.Hydra.prestigeEff(2, false))}}→{{format(feature.Hydra.prestigeEff(2, true))}}
						</span>
						<span v-else>飞升效果≥1解锁</span>
					</span></button>
				</td>
				<td style="width: 25%">
					<button class="hydra-button-short"><span class="hydra-text-short">
						<span v-if="feature.Hydra.pUnlock(3)">
							<h3>轮回({{formatWhole(player.hydra.prestige[3])}})</h3>
							???<br>+{{format(feature.Hydra.prestigeEff(3, false))}}→{{format(feature.Hydra.prestigeEff(3, true))}}
						</span>
						<span v-else>超越效果≥1e10解锁</span>
					</span></button>
				</td>
			</tr>
		</table>
		<table style="transform: translateY(-120px)">
			<tr>
				<TDUpgrade upgid="61" />
			</tr>
			<tr v-if="player.upgrades[61]">
				<TDUpgrade upgid="611" />
				<TDUpgrade upgid="612" />
				<TDUpgrade upgid="613" />
			</tr>
			<tr v-if="player.upgrades[61]">
				<TDBuyable bylid="611" />
				<TDBuyable bylid="612" />
				<TDBuyable bylid="613" />
			</tr>
		</table>
	</div>
</template>

<style scoped lang="scss">
.hydra-button, .hydra-button-reset {
	background-color: var(--background-color);
	color: var(--color);
	height: 250px;
	width: 100%;
	border: 2px solid rgb(200, 190, 245);
	position: relative;
	z-index: 1;
	
}
.hydra-button-short {
	background-color: var(--background-color);
	color: var(--color);
	height: 100px;
	width: 100%;
	border: 2px solid rgb(200, 190, 245);
	position: relative;
	z-index: 1;
}
.hydra-button-reset:hover {
		cursor: pointer;
		border: 7px solid rgb(200, 190, 245);
	}
.hydra-button-short:hover {
		cursor: pointer;
		border: 4px solid rgb(200, 190, 245);
	}
.hydra-text {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 20px;
}
.hydra-text-short {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 14px;
}
</style>