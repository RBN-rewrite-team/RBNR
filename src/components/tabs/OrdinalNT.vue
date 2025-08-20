<script setup lang="ts">
import { OrdinalNT } from '@/core/ordinal/ordinalNT';
import MultipResetButton from '../MultipResetButton.vue';
import { format, formatLaTeX, formatLaTeXWhole } from '@/utils/format';
import { player } from '@/core/save';
import { feature } from '@/core/global';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
import Decimal from 'break_eternity.js';
import { OrdinalUtils } from '@/utils/ordinal';
import { Ordinal } from '@/lib/ordinal';
import { Dilute } from '@/core/hydra/dilute';

function varGainLatex(id = 'x', layer = 3) {
	let exp = OrdinalNT.varExp(id, layer);
	let param = OrdinalNT.varParam(id, layer);
	return `\\dot{${id}_{${layer}}} = ${param} = ` + formatLaTeX(OrdinalNT.varGain(id, layer));
}

function _f() {
	if (player.upgrades['61R']) return '\\log_2 x';
	return '\\lg x';
}

function f() {
	if (Dilute.diluteAmount(3) > 0) return '\\sqrt{x}';
	let exp = OrdinalNT.functionL4exp('f');
	if (exp.neq(1)) return `(${_f()})^${formatLaTeX(exp)}`;
	else return _f();
}

function g() {
	if (Dilute.diluteAmount(3) > 0) return '\\sqrt{x}';
	let exp = OrdinalNT.functionL4exp('g');
	if (exp.neq(1)) return `(${_g()})^${formatLaTeX(exp)}`;
	else return _g();
}

function _g() {
	if (player.upgrades['67R']) return '\\log_2 x';
	if (player.upgrades['66R']) return '\\log_5 x';
	return '\\lg x';
}
</script>

<template>
	<div class="main">
		<div style="transform: translateY(60px)">
			<div
				class="clickable_button"
				style="position: absolute"
				@mousedown="
					player.numbertheory.visiting = Math.max(player.numbertheory.visiting - 1, 1)
				"
			>
				-
			</div>
			<div
				class="clickable_button"
				style="position: absolute; left: 60px"
				@mousedown="
					player.numbertheory.visiting = Math.min(player.numbertheory.visiting + 1, 9)
				"
			>
				+
			</div>
			<h1>数论研究{{ player.numbertheory.visiting }}</h1>
			<div class="center_line" />
			<span v-if="player.numbertheory.visiting <= 2" style="color: rgb(255, 63, 63)"
				>嗯？这是什么研究，我怎么不知道？之前有人来过这里吗？</span
			>
			<div v-if="player.numbertheory.visiting == 3">
				<div v-if="!player.upgrades[61]">
					<h2>增长层级</h2>
					<h3>τ<sub>3</sub>倍增序数获取速度</h3>
					<vue-latex
						:expression="
							`\\alpha = \\sup\\{\\beta|H_{\\beta}(${formatLaTeXWhole(OrdinalNT.varComputed('hhBase', 3))})<x_3\\} = ` +
							OrdinalUtils.numberToLaTeXOrdinal(
								OrdinalNT.varComputed('a', 3),
								OrdinalNT.varComputed('hhBase', 3),
							)
						"
						display-mode
					/>
					<vue-latex
						v-if="!player.upgrades[515]"
						:expression="
							'\\tau_3 = g_{\\alpha}(' +
							formatLaTeXWhole(OrdinalNT.varComputed('sghBase', 3)) +
							') = ' +
							formatLaTeXWhole(OrdinalNT.varComputed('tau', 3))
						"
						display-mode
					/>
					<vue-latex
						v-else
						:expression="
							'\\tau_3 = g_{\\alpha}(g_{\\alpha}(' +
							formatLaTeXWhole(OrdinalNT.varComputed('sghBase', 3)) +
							')) = ' +
							formatLaTeXWhole(OrdinalNT.varComputed('tau', 3))
						"
						display-mode
					/>
					<vue-latex
						:expression="'x_3 = ' + formatLaTeXWhole(player.numbertheory.GH.x.floor())"
						display-mode
					/>
					<vue-latex :expression="varGainLatex('x', 3)" display-mode />
					<vue-latex
						v-if="player.buyables['54R'].gte(1)"
						:expression="'t_{3, 1} = ' + formatLaTeX(player.numbertheory.GH.t31)"
						display-mode
					/>
					<vue-latex
						v-if="player.buyables['54R'].gte(1)"
						:expression="
							'\\dot{t_{3, 1}} = ' +
							formatLaTeX(player.buyables['54R'].gte(1) ? 1 : 0)
						"
						display-mode
					/>
					<vue-latex
						v-if="player.buyables['55R'].gte(1)"
						:expression="'t_{3, 2} = ' + formatLaTeX(player.numbertheory.GH.t32)"
						display-mode
					/>
					<vue-latex
						v-if="player.buyables['55R'].gte(1)"
						:expression="
							'\\dot{t_{3, 2}} = ' +
							formatLaTeX(player.buyables['55R'].gte(1) ? 1 : 0)
						"
						display-mode
					/>
					<vue-latex
						v-if="player.upgrades['512']"
						:expression="'t_{3, 3} = ' + formatLaTeX(player.numbertheory.GH.t33)"
						display-mode
					/>
					<vue-latex
						v-if="player.upgrades['512']"
						:expression="
							'\\dot{t_{3, 3}} = ' + formatLaTeX(player.upgrades[512] ? 1 : 0)
						"
						display-mode
					/>
					<table align="center">
						<tbody>
							<tr>
								<TDBuyable bylid="51R" />
								<TDBuyable bylid="52R" />
								<TDBuyable bylid="53R" />
								<TDBuyable bylid="54R" />
							</tr>
							<tr>
								<TDBuyable bylid="55R" />
								<TDUpgrade upgid="51R" />
								<TDUpgrade upgid="52R" />
							</tr>
						</tbody>
					</table>
				</div>
				<span v-else style="color: rgb(255, 63, 63)"
					>嗯？这是什么研究，我怎么不知道？之前有人来过这里吗？</span
				>
			</div>
			<div
				v-if="
					(player.upgrades['69R'] || player.upgrades[65]) &&
					player.numbertheory.visiting == 4
				"
			>
				<h2>增长模式</h2>
				τ<sub>4</sub
				>{{ Dilute.diluteAmount(3) <= 0 ? '增' : '减' }}益BMS推演和U5-2的速度<br />
				<vue-latex
					:expression="`\\dot{x_4} = a\\cdot f\\left(\\prod_{n = 1}^${feature.Hydra.pMaxUnlock()}e_n+1\\right) = ${formatLaTeX(OrdinalNT.varGain('x', 4))}`"
					display-mode
					v-if="Dilute.diluteAmount(3) <= 0"
				/>
				<vue-latex
					:expression="`\\dot{x_4} = f\\left(t_{\\text{稀释}}\\right)^{${format(Dilute.diluteAmount(3))}} = ${formatLaTeX(OrdinalNT.varGain('x', 4))}`"
					display-mode
					v-else
				/>
				<vue-latex
					:expression="`\\tau_4 = g(x_4+10) = ${format(OrdinalNT.varComputed('tau', 4))}`"
					display-mode
					v-if="Dilute.diluteAmount(3) <= 0"
				/>
				<vue-latex
					:expression="`\\tau_4 = g(x_4+1) = ${format(OrdinalNT.varComputed('tau', 4))}`"
					display-mode
					v-else
				/>
				<vue-latex :expression="`f(x) = ${f()}`" display-mode />
				<vue-latex :expression="`g(x) = ${g()}`" display-mode />
				<vue-latex
					:expression="`e_n = \\text{第\\textit{n}个九头蛇重置项目的效果}`"
					display-mode
				/>
				<vue-latex
					:expression="`x_4 = ${formatLaTeX(player.numbertheory.GM.x)}`"
					display-mode
				/>
				价格对应资源为x<sub>4</sub>, τ<sub>4</sub>的购买项/升级不消耗任何东西。
				<table align="center">
					<tbody>
						<tr v-if="Dilute.diluteAmount(3) <= 0">
							<TDBuyable bylid="61R" />
							<TDBuyable bylid="62R" />
						</tr>
						<tr v-if="Dilute.diluteAmount(3) <= 0">
							<TDUpgrade upgid="61R" />
							<TDUpgrade upgid="62R" />
							<TDUpgrade upgid="63R" />
							<TDUpgrade upgid="64R" />
						</tr>
						<tr v-if="Dilute.diluteAmount(3) <= 0">
							<TDUpgrade upgid="65R" />
							<TDUpgrade upgid="66R" />
							<TDUpgrade upgid="67R" />
							<TDUpgrade upgid="68R" />
						</tr>
						<tr>
							<TDUpgrade upgid="69R" />
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<br />
	</div>
</template>
