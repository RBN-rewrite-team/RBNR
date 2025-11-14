<script setup lang="ts">
import { DC } from '@/core/constants';
import { player } from '@/core/global';
import { Hydra } from '@/core/hydra/hydra';
import { format, formatTime } from '@/utils/format';
import { OrdinalUtils } from '@/utils/ordinal';
import Decimal from 'break_eternity.js';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;
function deduceButtonStyle(): string {
	const pc = player.hydra.deduceProgress[player.hydra.visiting].mul(100).toNumber();
	return (
		'linear-gradient(to right, rgba(155, 125, 195, 0.5) ' +
		pc +
		'%, var(--background-color) ' +
		pc +
		'%)'
	);
}

function hydraMilestone(): any {
	const ms = Hydra.hydraMilestone[player.hydra.visiting];
	let flag = -1;
	for (const i in ms) {
		if (player.hydra.deduceOrdinal[player.hydra.visiting].gte(ms[i][1])) flag++;
	}
	const reached = flag == -1 ? '\\text{' + $t('hydra.milestonenotget') + '}' : ms[flag][0];
	const next = ms[flag + 1][0];
	const progress =
		'\\text{' +
		format(player.hydra.deduceOrdinal[player.hydra.visiting].div(ms[flag + 1][1]).mul(100)) +
		'}\\%';
	return { reached: reached, next: next, progress: progress };
}

function hydraMilestoneAxis(): any {
	const axis = [];
	const ms = Hydra.hydraMilestone[player.hydra.visiting];
	const now = player.hydra.deduceOrdinal[player.hydra.visiting];
	let scale = 0;
	if (now.gte('1e6')) scale = 1;
	if (now.gte(4294967296)) scale = 2;
	for (const i in ms) {
		let left = 0;
		if (scale === 0) left = new Decimal(ms[i][1]).div(now).mul(50).toNumber();
		else if (scale === 1)
			left = new Decimal(ms[i][1])
				.max(10)
				.log10()
				.div(now.max(10).log10())
				.mul(50)
				.toNumber();
		else if (scale === 2)
			left = new Decimal(ms[i][1])
				.max(10)
				.log10()
				.log10()
				.div(now.max(10).log10().log10())
				.mul(100)
				.sub(50)
				.toNumber();
		left = Math.min(Math.max(left, 1), 99);
		if (left >= 10 && left <= 90) axis.push([ms[i][0], String(left) + '%']);
	}
	return axis;
}

function hydraAxisHTML(): string {
	let s = '';
	const axis = hydraMilestoneAxis();
	for (const i in axis) {
		s +=
			'<div style="font-size: 8px; position: absolute; top: 90%; left: ' +
			axis[i][1] +
			'; color: rgb(200, 190, 245); transform: translateY(-50%, -50%)"><vue-latex :expression="' +
			axis[i][0] +
			'" display-mode /></div>';
	}
	return s;
}
</script>

<template>
	<div>
		<button
			v-if="Hydra.deduceSpeed().lt(10)"
			class="hydra-button"
			:style="{ 'background-image': deduceButtonStyle() }"
		>
			<span class="hydra-text">
				<span v-html="OrdinalUtils.numberToBMS(player.hydra.deduceOrdinal[0], DC.D_4)" />
			</span>
			<span class="hydra-text-bottom" style="color: rgb(155, 125, 195); font-size: 12px">
				<div style="transform: scale(0.75)">
					<vue-latex
						:expression="
							'milestone:' +
							hydraMilestone().reached +
							',next:' +
							hydraMilestone().next +
							'(' +
							hydraMilestone().progress +
							')'
						"
						display-mode
					/>
				</div>
			</span>
			<span
				v-if="Hydra.deduceSpeed().gt(0)"
				class="hydra-text-bottom"
				style="opacity: 0.5; font-size: 16px; bottom: 0px"
				>{{
					Hydra.deduceSpeed().gte(1)
						? format(Hydra.deduceSpeed()) + '/s'
						: '1/' + formatTime(Hydra.deduceSpeed().recip())
				}}</span
			>
			<div class="hydra-axis-line"></div>
			<div v-for="i in hydraMilestoneAxis()">
				<div class="hydra-axis-element" :style="'left: ' + i[1]">
					<vue-latex :expression="i[0]" display-mode />
				</div>
			</div>
			<div class="hydra-axis-element" style="left: 50%; top: 88%">♦</div>
		</button>
		<button v-else class="hydra-button fast" style="position: relative">
			<span
				class="hydra-text"
				style="opacity: 0.5; color: rgb(200, 190, 245); font-size: 60px"
				>{{ format(Hydra.deduceSpeed()) }}/s</span
			>
			<span class="hydra-text">
				<span
					v-html="OrdinalUtils.numberToBMS(player.hydra.deduceOrdinal[0], new Decimal(4))"
				/>
			</span>
			<span class="hydra-text-bottom" style="color: rgb(155, 125, 195); font-size: 12px">
				<div style="transform: scale(0.75)">
					<vue-latex
						:expression="
							'milestone:' +
							hydraMilestone().reached +
							',next:' +
							hydraMilestone().next +
							'(' +
							hydraMilestone().progress +
							')'
						"
						display-mode
					/>
				</div>
			</span>
			<div class="hydra-axis-line"></div>
			<div v-for="i in hydraMilestoneAxis()">
				<div class="hydra-axis-element" :style="'left: ' + i[1]">
					<vue-latex :expression="i[0]" display-mode />
				</div>
			</div>
			<div class="hydra-axis-element" style="left: 50%; top: 88%">♦</div>
		</button>
	</div>
</template>
