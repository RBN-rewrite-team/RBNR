<script setup lang="ts">
import { NUMTHEORY } from '@/core/multiplication/numbertheory';
import MultipResetButton from '../MultipResetButton.vue';
import { formatLaTeX, formatLaTeXWhole } from '@/utils/format';
import { player } from '@/core/save';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
</script>

<template>
	<div class="main">
		<MultipResetButton />
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
					:expression="'\\tau_1 =S(x)=' + formatLaTeXWhole(NUMTHEORY.funcS())"
					display-mode
				/>
				<vue-latex
					:expression="'x = ' + formatLaTeXWhole(player.numbertheory.euler.x.floor())"
					display-mode
				/>
				<vue-latex
					:expression="'\\dot{x} = ' + formatLaTeX(NUMTHEORY.varXgain())"
					display-mode
				/>
				<p style="font-size: 120%">
					<b>研究1加成：加法效果×<vue-latex expression="\tau_1" /></b>
				</p>
			</div>
			<table align="center">
				<tbody>
					<tr>
						<TDBuyable bylid="31R" />
						<TDBuyable bylid="32R" />
						<TDUpgrade upgid="31R" />
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
