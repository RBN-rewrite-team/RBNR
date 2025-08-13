<script setup lang="ts">
import {player, feature} from '@/core/global';
import {format, formatWhole} from '@/utils/format';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';

function powerFactorHTML(): string {
	let s = '';
	s += format(player.hydra.powerMult[0]) + ' x ' + format(player.hydra.powerMult[1]) + ' x ' + format(player.hydra.powerMult[2]) + ' x ' + format(player.hydra.powerMult[3]);
	if(feature.Hydra.powerExtraMult().gt(1)) s += ' x <span style="color: rgb(155, 1125, 195)">' + format(feature.Hydra.powerExtraMult()) + '</span>';
	if(feature.Hydra.powerExp().gt(1)) s = '(' + s + ')<sup>' + format(feature.Hydra.powerExp()) + '</sup>';
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
			<tr>
				<td style="width: 50%">
					<button class="hydra-button" :style="{ 'background-image': deduceButtonStyle() }"><span class="hydra-text">
						这里显示你的记号推演进展<br>
						具体显示方式请等待更新
					</span></button>
				</td>
				<td style="width: 50%">
					<button class="hydra-button" @click="feature.Hydra.hydraReset(player.hydra.visiting)"><span class="hydra-text">
						<h2 style="color: rgb(200, 190, 245)">重置</h2>
						<h3 style="color: rgb(155, 125, 195)">+{{format(feature.Hydra.powerGain())}}九头蛇能量</h3>
						<br>
						当前重置使乘数+{{format(feature.Hydra.deduceEff(player.hydra.visiting).mul(player.hydra.deduceOrdinal[player.hydra.visiting]))}}
					</span></button>
				</td>
			</tr>
		</table>
		<table>
			<tr>
				<TDUpgrade upgid="61" />
				<TDUpgrade upgid="611" />
				<TDUpgrade upgid="612" />
				<TDBuyable bylid="611" />
			</tr>
		</table>
	</div>
</template>

<style scoped>
.hydra-button {
	background-color: var(--background-color);
	color: var(--color);
	height: 250px;
	width: 100%;
	border: 2px solid rgb(200, 190, 245);
	position: relative;
}
.hydra-text {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 16px;
}
</style>