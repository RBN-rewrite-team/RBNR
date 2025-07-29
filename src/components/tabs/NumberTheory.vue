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
function x2GainLatex() {
    return '\\dot{n} = x_{2,1}^{x_{2,2}} = ' + formatLaTeX(NUMTHEORY.varX2gain());
}
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			
			<div class="clickable_button" style="position: absolute"
			@mousedown="player.numbertheory.visiting = Math.max(player.numbertheory.visiting - 1, 1)">
			    -
			</div>
		    <div class="clickable_button" style="position: absolute; left: 60px"
		    @mousedown="player.numbertheory.visiting = Math.min(player.numbertheory.visiting + 1, 9)">
			    +
			</div>
			<h1>数论研究{{player.numbertheory.visiting}}</h1>
			<div class="center_line" />
			<div v-if="player.numbertheory.visiting == 1">
				<h2>欧拉函数</h2>
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
			<div v-if="player.upgrades[45] && player.numbertheory.visiting == 2" align="center">
				<h2>有理逼近</h2>
				<vue-latex expression="a_1 = 1, a_n = \frac{a_{n-1}+2}{a_{n-1}+1}" display-mode />
				<vue-latex expression="F_0 = 0, F_1 = 1, F_n = F_{n-1}+F_{n-2}" display-mode v-if="player.milestones.cb8" />
				<vue-latex
					:expression="'\\tau_{2} = \\tau_{2A}' + (player.milestones.cb8 ? '\\tau_{2B}':'') + ' = ' + formatLaTeX(NUMTHEORY.tau2())"
					display-mode
				/>
				<vue-latex
					:expression="
						'\\tau_{2A} = 1-\\frac{\\lg\\left|\\sqrt2-a_n\\right|}{100} = ' +
						formatLaTeX(NUMTHEORY.tau2A())
					"
					display-mode
				/>
				<vue-latex
					:expression="
						'\\tau_{2B} = 1-\\frac{\\lg\\left|\\phi-\\frac{F_{n+1}}{F_m}\\right|}{100} = ' + formatLaTeX(NUMTHEORY.tau2B())
					"
					display-mode
					v-if="player.milestones.cb8"
				/>
				<vue-latex
					:expression="'n = ' + formatLaTeXWhole(player.numbertheory.rational_approx.n)"
					display-mode
				/>
				<vue-latex
					:expression="'m = ' + formatLaTeXWhole(player.numbertheory.rational_approx.m)"
					display-mode
					v-if="player.milestones.cb8"
				/>
				<vue-latex :expression="x2GainLatex()" display-mode />
				<p style="font-size: 120%">
					<b
						>研究2加成：质因数效果^<vue-latex
							expression="\tau_2" />，质因数速度×<vue-latex expression="\tau_2^4"
					/></b>
				</p><br>
				<button
					class="clickable_button"
					@click="
						player.numbertheory.rational_approx.n =
							player.numbertheory.rational_approx.n.add(1)
					"
					style="display: inline-block; margin: 5px"
				>
					增加n的数值
				</button>
				<button
					class="clickable_button"
					@click="
						player.numbertheory.rational_approx.m =
							player.numbertheory.rational_approx.m.add(1)
					"
					v-if="player.milestones.cb8"
					style="display: inline-block; margin: 5px"
				>
					增加m的数值
				</button>
				<table>
				    <tr>
				        <TDBuyable bylid="41R" />
				        <TDBuyable bylid="42R" />
				    </tr>
				</table>
			</div>
		</div>
		<br />
	</div>
</template>
