<script lang="ts" setup>
import { player, feature } from '@/core/global';
import { format } from '@/utils/format';
import { getMessage } from '@/utils/i18n';
import { useI18n } from 'vue-i18n';
const $t = useI18n().t;
function getBHsize(t: number) {
	//  return 0
	if (t < 500) return 0;
	if (t > 675) {
		const T = 675 - (t - 675) * 5;
		return ((T - 500) / 2 + Math.max(T - 550, 0) * 0.7) * 1.05 ** (T - 600);
	} else return ((t - 500) / 2 + Math.max(t - 550, 0) * 0.7) * 1.05 ** (t - 600);
}
function getBHtext(t: number) {
	let tx = format(feature.SingularityGenerator.getSingularityEnergy());
	if (t < 550) tx += '<br>' + getMessage('sing.1');
	else if (t < 600) tx += '<br>' + getMessage('sing.2');
	else if (t < 625) tx += '<br>' + getMessage('sing.3');
	else if (t < 650) tx += '<br>' + getMessage('sing.4');
	else if (t < 666.67) tx += '<br>' + getMessage('sing.5');
	else if (t < 670)
		tx = '<span style="font-size: ' + (670 - t + 1) * 30 + 'px">' + tx + '</span>';
	else if (t < 675) return '<span style="color: gold">' + getMessage('sing.6') + '</span>';
	else if (t <= 710) return '';
	return tx;
}
</script>

<template>
	<div
		class="bh"
		align="center"
		:style="{
			width: getBHsize(player.singularity.t) + 'vw',
			height: getBHsize(player.singularity.t) + 'vw',
			color: 'var(--sing-color)',
			'font-size': '25px',
		}"
	>
		<span class="bht" v-html="getBHtext(player.singularity.t)" />
	</div>
</template>

<style>
.bh {
	width: 0vw;
	height: 0vw;
	background: black;
	border-radius: 50%;
	z-index: 6;
	position: absolute;
	left: 50%;
	top: 50%;
	overflow: hidden;
	transform: translate(-50%, -50%);
}
.bht {
	z-index: 7;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	font-align: center;
	transition: color 2s;
}
</style>
