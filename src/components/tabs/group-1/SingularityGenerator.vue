<script lang="ts" setup>
import { feature, player } from '@/core/global';
import { format, notations } from '@/utils/format';
import Decimal from 'break_eternity.js';
import { ref } from 'vue';
import { CHALLENGE } from '@/core/challenge.ts';
import { wordShift } from '@/core/word-shift.ts';
import { useI18n } from 'vue-i18n';
import { findRaw, getMessage } from '@/utils/i18n';
import Upgrades from '@/components/upg/Upgrades';
import { useUpdate } from '@/lib/useUpdate';

function destroy(a: number) {
	switch (a) {
		case 1:
			player.exponention.logarithm.upgrades_in_dilated = [];
			player.exponention.logarithm.buyables_in_dilated = [];
			player.exponention.logarithm.highest_dilate = new Decimal(1);
			player.upgrades['44R'] = false;
			player.exponention.logarithm.in_dilate = false;
			player.milestones['log_G'] = false;
			player.options.notation = notations.SCIENTIFIC;
			feature.EXPONENTION.reset(true, true);
			player.milestones.dil_1 = false;
			player.milestones.dil_2 = false;
			player.milestones.dil_3 = false;
			player.milestones.dil_4 = false;
			player.milestones.dil_5 = false;
			player.milestones.dil_6 = false;
			player.milestones.dil_7 = false;
			break;
		case 2:
			player.exponention.logarithm = {
				observe_datas: new Decimal(0),
				calculate_datas: new Decimal(0),
				astronomers: [],
				in_dilate: false,
				upgrades_in_dilated: [],
				buyables_in_dilated: [],
				highest_dilate: new Decimal(1),
			};
			player.milestones['log_law1'] = false;
			player.milestones['log_law2'] = false;
			player.milestones['log_law3'] = false;
			player.milestones['log_G'] = false;
			player.milestones.cb5 = false;
			player.milestones.cb9 = false;
			player.milestones.cb10 = false;
			player.milestones.cb12 = false;
			player.milestones.cb13 = false;
			player.milestones.cb15 = false;
			player.milestones.cb17 = false;
			player.milestones.cb18 = false;
			feature.EXPONENTION.reset(true, true);
			break;
		case 3:
			player.buyables.cb1 = new Decimal(0);
			player.milestones.cb1 = false;
			player.milestones.cb2 = false;
			player.milestones.cb3 = false;
			player.milestones.cb4 = false;
			player.milestones.cb6 = false;
			player.milestones.cb7 = false;
			player.milestones.cb8 = false;
			player.milestones.cb11 = false;
			player.milestones.cb14 = false;
			player.milestones.cb16 = false;
			player.milestones.cb19 = false;
			player.milestones.cb20 = false;
			player.milestones.cb21 = false;
			player.milestones.cb22 = false;
			player.milestones.cb23 = false;
			player.milestones.cb24 = false;
			player.upgrades[47] = false;
			player.upgrades['43R'] = false;
			player.upgrades['42R'] = false;
			player.upgrades['41R'] = false;
			player.numbertheory.rational_approx.m = new Decimal(1);
			feature.EXPONENTION.reset(true, true);
			player.buyables['43R'] = new Decimal(0);
			player.buyables['44R'] = new Decimal(0);
			break;
		case 4:
			player.upgrades['41'] = false;
			player.upgrades['42'] = false;
			player.upgrades['43'] = false;
			player.upgrades['44'] = false;
			player.upgrades['45'] = false;
			player.upgrades['46'] = false;
			player.upgrades['48'] = false;
			player.upgrades['49'] = false;
			player.upgrades['410'] = false;
			player.upgrades['411'] = false;
			player.upgrades['400q'] = false;
			for (let i = 1; i <= 5; i++) {
				for (let j = 1; j <= 5; j++)
					player.upgrades[`4${i}${j}q` as keyof typeof player.upgrades] = false;
			}
			player.buyables['41'] = new Decimal(0);
			player.buyables['42'] = new Decimal(0);
			player.buyables['43'] = new Decimal(0);
			player.buyables['44'] = new Decimal(0);
			player.exponention.exppower = new Decimal(0);
			player.exponention.totalExppower = new Decimal(0);
			player.exponention.qolpoints = new Decimal(0);
			player.firstResetBit &= ~(1 << 2);
			if (CHALLENGE.inChallenge(0, 3)) player.challengein = [-1, -1];
			player.challenges[0][3] = new Decimal(0);
			break;
		case 5:
			player.challenges[0] = [
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
				new Decimal(0),
			];
			player.upgrades[39] = false;
			break;
		case 6:
			const pf = [2, 3, 5, 7, 11, 13, 17, 19];
			for (const i in pf)
				player.buyables[('pf' + pf[i]) as keyof typeof player.buyables] = new Decimal(0);
			player.upgrades[36] = false;
			player.buyables[33] = new Decimal(0);
			break;
		case 7:
			player.upgrades['31R'] = false;
			player.upgrades['32R'] = false;
			player.upgrades['33R'] = false;
			player.upgrades['34R'] = false;
			player.buyables['31R'] = new Decimal(0);
			player.buyables['32R'] = new Decimal(0);
			player.buyables['33R'] = new Decimal(0);
			player.buyables['34R'] = new Decimal(0);
			player.buyables['35R'] = new Decimal(0);
			player.buyables['36R'] = new Decimal(0);
			player.buyables['37R'] = new Decimal(0);
			player.buyables['38R'] = new Decimal(0);
			player.numbertheory.euler.x = new Decimal(0);
			player.numbertheory.euler.y = new Decimal(0);
			player.numbertheory.euler.z = new Decimal(0);
			player.numbertheory.euler.s = new Decimal(0);
			player.upgrades[35] = false;
			break;
		case 8:
			player.upgrades[26] = false;
			player.upgrades[31] = false;
			player.upgrades[32] = false;
			player.upgrades[33] = false;
			player.upgrades[34] = false;
			player.upgrades[37] = false;
			player.upgrades[38] = false;
			player.buyables[31] = new Decimal(0);
			player.buyables[32] = new Decimal(0);
			player.multiplication.mulpower = new Decimal(0);
			player.multiplication.totalMulpower = new Decimal(0);
			player.firstResetBit &= ~(1 << 1);
			break;
		case 9:
			player.upgrades[13] = false;
			player.upgrades[21] = false;
			player.upgrades[22] = false;
			player.upgrades[23] = false;
			player.upgrades[24] = false;
			player.upgrades[25] = false;
			player.buyables[21] = new Decimal(0);
			player.firstResetBit &= ~1;
			player.addpower = new Decimal(0);
			player.totalAddpower = new Decimal(0);
			player.buyable11More = new Decimal(0);
			player.buyables[11] = new Decimal(50);
			break;
		case 10:
			player.upgrades[11] = false;
			player.upgrades[12] = false;
			player.buyables[11] = new Decimal(0);
			player.buyable11More = new Decimal(0);
			break;
	}
}

const t = useUpdate(() => Date.now());

const $tm = useI18n().tm;
// 定义献祭按钮配置
const sacrificeConfigs = [
	{
		stage: 1,
		condition: () => player.singularity.stage < 1 && player.singularity.t >= 205,
		destroyArg: 1,
		words: 'sing.t.1',
		text: (words: string) => $t('sing.h.1', { words }),
	},
	{
		stage: 2,
		condition: () => player.singularity.stage < 2 && player.singularity.t >= 250,
		destroyArg: 2,
		words: 'sing.t.1',
		text: (words: string) => $t('sing.h.2', { words }),
	},
	{
		stage: 3,
		condition: () => player.singularity.stage < 3 && player.singularity.t >= 300,
		destroyArg: 3,
		words: 'sing.t.1',
		text: (words: string) => $t('sing.h.3', { words }),
	},
	{
		stage: 4,
		condition: () => player.singularity.stage < 4 && player.singularity.t >= 350,
		destroyArg: 4,
		words: 'sing.t.1',
		text: (words: string) => $t('sing.h.4', { words }),
	},
	{
		stage: 6,
		condition: () => player.singularity.stage < 6 && player.singularity.t >= 400,
		destroyArg: 5,
		words: 'sing.t.2',
		text: (words: string) => $t('sing.h.5', { words }),
	},
	{
		stage: 7,
		condition: () => player.singularity.stage < 7 && player.singularity.t >= 430,
		destroyArg: 6,
		words: 'sing.t.3',
		text: (words: string) => $t('sing.h.6', { words }),
	},
	{
		stage: 8,
		condition: () => player.singularity.stage < 8 && player.singularity.t >= 450,
		destroyArg: 7,
		words: 'sing.t.3',
		text: (words: string) =>
			$t('sing.h.7', {
				words,
				words2: wordShift.wordCycle(['走得更远', '飞得更高', '[]得更[]'], false, t.value),
			}),
	},
	{
		stage: 9,
		condition: () => player.singularity.stage < 9 && player.singularity.t >= 470,
		destroyArg: 8,
		words: 'sing.t.4',
		text: (words: string) => $t('sing.h.8', { words }),
	},
	{
		stage: 10,
		condition: () => player.singularity.stage < 10 && player.singularity.t >= 490,
		destroyArg: 9,
		words: 'sing.t.4',
		text: (words: string) => $t('sing.h.9', { words }),
	},
	{
		stage: 11,
		condition: () => player.singularity.stage < 11 && player.singularity.t >= 500,
		destroyArg: 10,
		words: 'sing.t.4',
		text: (words: string) => $t('sing.h.10', { words }),
	},
] as const;

function handleSacrifice(stage: number, destroyArg: number) {
	player.singularity.stage = stage;
	destroy(destroyArg);
}

const $t = useI18n().t;
function q() {
	return $t('sing.gain', {
		exponent: `<sup style="color: var(--sing-color)">${format(feature.SingularityGenerator.singularityExponent())}</sup>`,
		division: format(feature.SingularityGenerator.singularityDivision()),
	});
	// 你每秒获取 (奇点能量+1)<sup style="color: var(--sing-color)">{{
	// 				format(feature.SingularityGenerator.singularityExponent())
	// 			}}</sup
	// 			>/{{ format(feature.SingularityGenerator.singularityDivision()) }} 奇点能量<br
	// 		/>
}

function t_i18n() {
	if (player.singularity.stage < 9) return 'sing.g.1';
	if (player.singularity.stage < 10) return 'sing.g.2';
	if (player.singularity.stage < 11) return 'sing.g.3';
	if (player.singularity.t < 666.667) return 'sing.g.4';
	return 'sing.g.5';
}
function w() {
	if (player.retribution >= 1) {
		return $t('sing.g.5', {
			se: `ω+${player.retribution}`,
			exp: '???',
		});
	}
	return $t(t_i18n(), {
		se: format(feature.SingularityGenerator.getSingularityEnergy()),
		exp: format(feature.SingularityGenerator.getSingularityEffect()),
	});
}
</script>

<template>
	<div class="main" align="center">
		<div v-if="player.singularity.enabled" style="transform: translateY(60px)">
			<span v-html="w()"></span>
			<br />
			<span v-if="player.singularity.t < 667" v-html="q()"></span>
			<span v-if="player.singularity.t >= 667" v-html="$t('sing.fin')"> </span>

			<template v-if="player.singularity.t >= 667">
				<Upgrades :upgids="[['using1']]" />
			</template>
			<template v-for="config in sacrificeConfigs" :key="config.stage">
				<button
					v-if="config.condition()"
					class="sacrifice"
					@click="handleSacrifice(config.stage, config.destroyArg)"
					v-html="config.text(wordShift.wordCycle(findRaw(config.words), false, t))"
				/>
			</template>
		</div>
		<button v-else class="circle-button" @click="player.singularity.enabled = true">
			{{ $t('sing') }}
		</button>
	</div>
</template>

<style scoped lang="scss">
@mixin base-button {
	width: 300px;
	border: 3px solid rgb(244, 25, 35);
	background-color: black;
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	text-decoration: none;
	outline: none;
}

.circle-button {
	@include base-button;
	height: 300px;
	border-radius: 50%;
	font-size: 28px;
}
.sacrifice {
	@include base-button;
	height: 100px;
	border-radius: 99%;
}
</style>
