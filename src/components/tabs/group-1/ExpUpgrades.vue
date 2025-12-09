<script setup lang="ts">
import { player } from '@/core/save';
import { feature } from '@/core/global.ts';
import { format, formatWhole } from '@/utils/format.ts';
import Decimal from 'break_eternity.js';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;
function effect() {
	return `${$t('exp.effect.0', {
		effect: `<span style="color: rgb(127, 127, 255)"
				>^${format(feature.EXPONENTION.powerEff())}</span
			>`,
	})}<br />${$t('exp.effect.1', {
		effect: `<span style="color: rgb(127, 127, 255)"
				>^${format(new Decimal(1.03))}</span
			>`,
	})}`;
}
function qolpdis() {
	return $t('exp.youhaveqol', {
		amount: `<span style="color: rgb(255, 127, 255)">${formatWhole(
			player.exponention.qolpoints,
		)}</span>`,
	});
}
import Upgrades from '@/components/upg/Upgrades';
import type { upgrades } from '@/core/mechanic';
</script>

<template>
	<div class="main">
		<span v-if="player.firstResetBit & 0b100" v-html="effect()"> </span>
		<br />
		<br />
		<h2 style="color: rgb(127, 127, 255)">{{ $t('exp.normalupgs') }}</h2>
		<Upgrades
			:upgids="[
				['u41', 'u42', 'u43', 'u44'],
				['u45', 'u46', 'u47', 'u48'],
				['u49', 'u410', 'u411'],
				['b41', 'b42', 'b43', 'b44'],
			]"
		/>

		<br />
		<br />
		<br />
		<br />
		<h2 style="color: rgb(255, 127, 255)">{{ $t('exp.qolupgs') }}</h2>
		<span v-html="qolpdis()"></span>
		<Upgrades
			:smaller="true"
			:upgids="[
				['u400q'],
				['u411q', 'u412q', 'u413q', 'u414q', 'u415q'],
				['u421q', 'u422q', 'u423q', 'u424q', 'u425q'],
				['u431q', 'u432q', 'u433q', 'u434q', 'u435q'],
				['u441q', 'u442q', 'u443q', 'u444q', 'u445q'],
				['u451q', 'u452q', 'u453q', 'u454q', 'u455q'],
			]"
		/>
	</div>
</template>
