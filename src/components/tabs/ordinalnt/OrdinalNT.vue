<script setup lang="ts">
import { OrdinalNT } from '@/core/ordinal/ordinalNT';
import { format, formatLaTeX, formatLaTeXWhole } from '@/utils/format';
import { player } from '@/core/save';
import { feature } from '@/core/global';
import { OrdinalUtils } from '@/utils/ordinal';
import { Dilute } from '@/core/hydra/dilute';
import OrdinalNT5 from './OrdinalNT5.vue';

function varGainLatex(id = 'x', layer = 3) {
	const exp = OrdinalNT.varExp(id, layer);
	const param = OrdinalNT.varParam(id, layer);
	return `\\dot{${id}_{${layer}}} = ${param} = ` + formatLaTeX(OrdinalNT.varGain(id, layer));
}

function _f() {
	if (player.upgrades['61R']) return '\\log_2 x';
	return '\\lg x';
}

function f() {
	if (Dilute.diluteAmount(3) > 0) return '\\sqrt{x}';
	const exp = OrdinalNT.functionL4exp('f');
	if (exp.neq(1)) return `(${_f()})^${formatLaTeX(exp)}`;
	else return _f();
}

function g() {
	if (Dilute.diluteAmount(3) > 0) return '\\sqrt{x}';
	const exp = OrdinalNT.functionL4exp('g');
	if (exp.neq(1)) return `(${_g()})^${formatLaTeX(exp)}`;
	else return _g();
}

function _g() {
	if (player.upgrades['67R']) return '\\log_2 x';
	if (player.upgrades['66R']) return '\\log_5 x';
	return '\\lg x';
}
import Upgrades from '@/components/upg/Upgrades';
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
			<h1>
				{{
					$t('nt.order', {
						i: player.numbertheory.visiting.toString(),
					})
				}}
			</h1>
			<div class="center_line" />
			<span v-if="player.numbertheory.visiting <= 2" style="color: rgb(255, 63, 63)">{{
				$t('nt.wait')
			}}</span>
			<div v-if="player.numbertheory.visiting == 3">
				<div v-if="!player.upgrades[61]">
					<h2>{{ $t('nt.growhier.title') }}</h2>
					<h3 v-html="$t('nt.growhier.desc')"></h3>
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
					<Upgrades
						:upgids="[
							['b51R', 'b52R', 'b53R', 'b54R'],
							['b55R', 'u51R', 'u52R'],
						]"
					/>
				</div>
				<span v-else style="color: rgb(255, 63, 63)">{{ $t('nt.wait') }}</span>
			</div>
			<div
				v-if="
					(player.upgrades['69R'] || player.upgrades[65] || player.upgrades['7nt4uq']) &&
					player.numbertheory.visiting == 4
				"
			>
				<h2>{{ $t('nt.growingmode') }}</h2>
				<span
					v-html="
						Dilute.diluteAmount(3) <= 0
							? $t('nt.growingmode.eff')
							: $t('nt.growingmode.eff2')
					"
				></span
				><br />
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
				<vue-latex :expression="`e_n = \\text{${$t('nt.growingmode.en')}}`" display-mode />
				<vue-latex
					:expression="`x_4 = ${formatLaTeX(player.numbertheory.GM.x)}`"
					display-mode
				/>
				<span v-html="$t('nt.growingmode.c')"></span>。
				<template v-if="Dilute.diluteAmount(3) <= 0">
					<Upgrades
						:upgids="[
							['b61R', 'b62R'],
							['u61R', 'u62R', 'u63R', 'u64R'],
							['u65R', 'u66R', 'u67R', 'u68R'],
							['u69R', 'u621R', 'u622R'],
						]"
					/>
				</template>
				<template v-else>
					<Upgrades :upgids="[['u69R', 'u621R', 'u622R']]" />
				</template>
			</div>
			<div v-if="player.numbertheory.visiting == 4 && player.retribution >= 2">
				<span style="color: rgb(255, 63, 63)">{{ $t('nt.wait') }}</span>
			</div>
			<OrdinalNT5 v-if="player.numbertheory.visiting == 5 && player.milestones.nonrec_26" />
		</div>
		<br />
	</div>
</template>
