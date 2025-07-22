<script setup lang="ts">
import { NUMTHEORY } from '@/core/multiplication/numbertheory';
import MultipResetButton from '../MultipResetButton.vue';
import { formatLaTeX, formatLaTeXWhole } from '@/utils/format';
import { player } from '@/core/save';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
import Decimal from 'break_eternity.js';

function xGainLatex() {
	let exp = new Decimal(1);
	if (player.upgrades['32R']) exp = exp.add(0.3);
	if (player.buyables['36R'].gte(1)) exp = exp.add(player.buyables['36R'].mul(0.085));
	return (
		`\\dot{x} = sx_1${exp.neq(1) ? `^{${formatLaTeX(exp)}}` : ''}x_2${player.upgrades['31R'] ? 'u_1' : ''}y = ` +
		formatLaTeX(NUMTHEORY.varXgain())
	);
}

function yGainLatex() {
	let exp = new Decimal(1);
	if (player.upgrades['33R']) exp = exp.add(0.3);
	if (player.buyables['37R'].gte(1)) exp = exp.add(player.buyables['37R'].mul(0.085));
	return (
		`\\dot{y} = sy_1${exp.neq(1) ? `^{${formatLaTeX(exp)}}` : ''}z = ` +
		formatLaTeX(NUMTHEORY.varYgain())
	);
}
function zGainLatex() {
	let exp = new Decimal(1);
	if (player.upgrades['34R']) exp = exp.add(0.3);
	return `\\dot{z} = sz_1 = ` + formatLaTeX(NUMTHEORY.varZgain());
}
function sGainLatex() {
	return `\\dot{s} = s_1 = ` + formatLaTeX(NUMTHEORY.tickspeedGain());
}
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<div align="center">
				<h1>数论研究</h1>
				<h2>研究 1： 欧拉函数</h2>
				<vue-latex
					expression="\varphi(n) = n \prod_{p | n} \left(1 - \frac{1}{p}\right)"
					display-mode
				/>
				<vue-latex expression="S(x) = \sum_{k = 1}^{x} \varphi(k)" display-mode />
				<vue-latex
					:expression="'\\tau_1 = S(x) = ' + formatLaTeXWhole(NUMTHEORY.funcS())"
					display-mode
				/>
				<vue-latex
					:expression="'x = ' + formatLaTeXWhole(player.numbertheory.euler.x.floor())"
					display-mode
				/>
				<vue-latex :expression="xGainLatex()" display-mode />
				<vue-latex
					:expression="'y = ' + formatLaTeXWhole(player.numbertheory.euler.y.floor())"
					display-mode
				/>
				<vue-latex :expression="yGainLatex()" display-mode />
				<vue-latex
					:expression="'z = ' + formatLaTeXWhole(player.numbertheory.euler.z.floor())"
					display-mode
				/>
				<vue-latex :expression="zGainLatex()" display-mode />
				<vue-latex
					:expression="'s = ' + formatLaTeX(player.numbertheory.euler.s)"
					display-mode
				/>
				<vue-latex :expression="sGainLatex()" display-mode />
				<p style="font-size: 120%">
					<b>研究1加成：加法效果×<vue-latex expression="\tau_1" /></b>
				</p>
			</div>
			<table align="center">
				<tbody>
					<tr>
						<TDBuyable bylid="31R" />
						<TDBuyable bylid="32R" />
						<TDBuyable bylid="33R" />
						<TDBuyable bylid="34R" />
					</tr>
					<tr>
						<TDBuyable bylid="35R" />
						<TDBuyable bylid="36R" />
						<TDBuyable bylid="37R" />
						<TDBuyable bylid="38R" />
					</tr>
					<tr>
						<TDUpgrade upgid="31R" />
						<TDUpgrade upgid="32R" />
						<TDUpgrade upgid="33R" />
						<TDUpgrade upgid="34R" />
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
