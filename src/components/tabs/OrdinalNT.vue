<script setup lang="ts">
import { OrdinalNT } from '@/core/ordinal/ordinalNT';
import MultipResetButton from '../MultipResetButton.vue';
import { format, formatLaTeX, formatLaTeXWhole } from '@/utils/format';
import { player } from '@/core/save';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
import Decimal from 'break_eternity.js';
import { OrdinalUtils } from '@/utils/ordinal';
import { Ordinal } from '@/lib/ordinal';

function varGainLatex(id = 'x', layer = 3) {
	let exp = OrdinalNT.varExp(id, layer);
	let param = OrdinalNT.varParam(id, layer);
	return `\\dot{${id}_{${layer}}} = ${param} = ` + formatLaTeX(OrdinalNT.varGain(id, layer));
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
				<h2>增长层级</h2>
				<h3>τ<sub>3</sub>倍增序数获取速度</h3>
				<vue-latex
					:expression="
						`\\alpha = \\textrm{sup}\\{\\beta|H_{\\beta}(10)<x_3\\} = ` +
						OrdinalUtils.numberToLaTeXOrdinal(
							OrdinalNT.varComputed('a', 3),
							new Decimal(10),
						)
					"
					display-mode
				/>
				<vue-latex
					:expression="
						'\\tau_3 = g_{\\alpha}(' +
						formatLaTeXWhole(OrdinalNT.varComputed('sghBase', 3)) +
						') = ' +
						formatLaTeXWhole(OrdinalNT.varComputed('tau', 3))
					"
					display-mode
				/>
				<vue-latex
					:expression="'x_3 = ' + formatLaTeXWhole(player.numbertheory.GH.x.floor())"
					display-mode
				/>
				<vue-latex :expression="varGainLatex('x', 3)" display-mode />
				<table align="center">
				  <tbody>
					<tr>
						<TDBuyable bylid="51R" />
						<TDBuyable bylid="52R" />
					</tr>
					</tbody>
				</table>
			</div>
		</div>
		<br />
	</div>
</template>
