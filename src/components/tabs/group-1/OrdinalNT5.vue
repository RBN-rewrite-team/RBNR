<script setup lang="ts">
import { player } from '@/core/global';
import { format, formatWhole } from '../../../utils/format.ts';
import {
	clickWellOrder,
	energyToUNOCFSpeed,
	stepProceed,
	wellOrderGainPerClick,
} from '@/core/ordinal/well_ordering.ts';

function getCurrentSequenceName(): string {
	const selecting = player.numbertheory.well_ordering.selecting;
	if (selecting === 1) return '初等序列 (Primitive Sequence System)的停机性';
	if (selecting === 2) return 'BMS (Bashicu Matrix System)的良序性';
	return '???';
}
</script>

<template>
	<h2>良序性</h2>
	你有<b style="color: #c98300; font-size: 30px">
		{{ formatWhole(player.numbertheory.well_ordering.energy) }} </b
	>推演能量, 增加UNOCF推演速度×{{ format(energyToUNOCFSpeed()) }}
	<div>
		<button
			class="clickable_button"
			style="display: inline-block"
			@click="
				player.numbertheory.well_ordering.selecting = Math.max(
					player.numbertheory.well_ordering.selecting - 1,
					1,
				)
			"
		>
			←</button
		>当前证明中：{{ getCurrentSequenceName()
		}}<button
			class="clickable_button"
			style="display: inline-block"
			@click="
				player.numbertheory.well_ordering.selecting = Math.min(
					player.numbertheory.well_ordering.selecting + 1,
					10,
				)
			"
		>
			→
		</button>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 1" align="center">
		初等序列<vue-latex expression="(a_0,a_1,\ldots,a_{m-1},a_m)" />定义如下：
		<vue-latex expression="1.\ () = 0" display-mode />
		<vue-latex expression="2.\ (\#,0) = (\#)+1" display-mode />
		<div>
			<vue-latex
				expression="3.\ (\#_1,{\color{Red} a_i,\#_2},a_k) m  = (\#_1,{\color{Red} a_i,\#_2},{\color{Blue} a_i,\#_2},\ldots)"
			/>，其中<vue-latex expression="\#_1,\#_2" />为任意两段合法序列，<vue-latex
				expression="a_k>0"
			/>，<br /><vue-latex expression="a_i = a_k-1" />为<vue-latex
				expression="a_k"
			/>前首个小于<vue-latex expression="a_k" />的数，<br />省略号代表任意有限次循环的极限。
		</div>
		<div class="center_line" />
		<div>
			<button
				class="clickable_button"
				style="display: inline-block"
				@click="
					player.numbertheory.well_ordering.pages[
						player.numbertheory.well_ordering.selecting - 1
					] = Math.max(
						player.numbertheory.well_ordering.pages[
							player.numbertheory.well_ordering.selecting - 1
						] - 1,
						0,
					)
				"
			>
				-
			</button>
			<button
				class="clickable_button"
				style="display: inline-block"
				@click="
					player.numbertheory.well_ordering.pages[
						player.numbertheory.well_ordering.selecting - 1
					]++
				"
			>
				+
			</button>
		</div>
		<div class="center_line" />
		<p>以下，用 E 表示空序列，用 <vue-latex expression="\frown" /> 表示数列之间的连接。</p>
		<p>
			对于数列 S，用 <vue-latex expression="\textrm{length}(S)" /> 表示数列 S 的长度，用
			<vue-latex expression="S_n(n < \textrm{length}(S))" /> 表示 S 的第 n 项，
		</p>
		<p>
			用 <vue-latex expression="S_\Box" /> 表示 S 的末项，用
			<vue-latex expression="S^+" /> 表示 S 各项加 1 后的数列。
		</p>
		<p>
			对于数列 S 和满足 m <vue-latex expression="\le n \le \textrm{length}(S)" /> 的自然数
			m,n，将满足 <vue-latex expression="T_x = S_{m+x}(\textrm{if}\ x < n-m)" /> 且
			<vue-latex expression="\textrm{length}(T) = n-m" /> 的唯一数列 T 表示为
			<vue-latex expression="\textrm{sub}(S,m,n)" />。
		</p>
		<div class="center_line" />
		<div>
			<button class="clickable_button" @click="clickWellOrder()">
				获得{{ formatWhole(wellOrderGainPerClick()) }}推演能量
			</button>
		</div>

		<div class="center_line" />
		<p>下一步：定义由自然数构成的有限长数列的集合 P， P的递归定义是...</p>
		<div>
			<button
				class="clickable_button"
				@click="stepProceed(1)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(1)"
			>
				获得P的递归定义，消耗10推演能量</button
			><template v-else>
				定义由自然数构成的有限长数列的集合 P，递归定义如下：
				<ul>
					<li><vue-latex expression="P_0 := \{E\}" /></li>
					<li>
						<vue-latex
							expression="P_{n+1} := P_n \cup \{S \frown (0) \frown T^+ | S \in P_n \land T \in P_n\}"
						/>
					</li>
					<li><vue-latex expression="P := \bigcup_{n \in \mathbb N} P_n" /></li>
				</ul>
				<p>已解锁一个引理</p>
			</template>
		</div>
		<div class="center_line" />
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 0 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(1)
			"
		>
			<div>
				<h3>引理1(未证明)</h3>
				<p>1. 对于任意 P 的元素 S，有 S = E 或 S_0 = 0。</p>
				<p>
					2. 对于任意 P 的元素 A,B,C,D，若
					<vue-latex
						expression="A \frown (0) \frown B^+ = C \frown (0) \frown
					D^+"
					></vue-latex
					>，则 A = C 且 B = D。
				</p>
			</div>
		</template>
		<div class="center_line" />
	</div>
</template>
