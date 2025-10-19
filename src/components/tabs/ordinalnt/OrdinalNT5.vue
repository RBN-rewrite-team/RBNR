<script setup lang="ts">
import { player } from '@/core/global';
import { format, formatWhole } from '../../../utils/format.ts';
import {
	clickWellOrder,
	energyToUNOCFSpeed,
	stepProceed,
	wellOrderGainPerClick,
} from '@/core/ordinal/well_ordering.ts';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import TDBuyable from '../../group-2/TDBuyable.vue';
import Baixie from '@/components/group-2/Baixie.vue';
import { component as convertTextToComponent } from '../help/text-to-component-convert.tsx';
import prssdefinition from './ordinalnt5-content/prss-definition.txt?raw';
import bmsdefinition from './ordinalnt5-content/bms-definition.txt?raw';
import bmswellorder1 from './ordinalnt5-content/bms-wellorder-1.txt?raw';
import bmswellorder2 from './ordinalnt5-content/bms-wellorder-2.txt?raw';
import bmswellorder3 from './ordinalnt5-content/bms-wellorder-3.txt?raw';
import bmswellorder4 from './ordinalnt5-content/bms-wellorder-4.txt?raw';
import bmswellorder from './ordinalnt5-content/bms-wellorder.txt?raw';
import bmswellorder1prove from './ordinalnt5-content/bms-wellorder-1-prove.txt?raw';
import bmswellorder2prove from './ordinalnt5-content/bms-wellorder-2-prove.txt?raw';
import bmswellorder3prove from './ordinalnt5-content/bms-wellorder-3-prove.txt?raw';
import bmswellorder4prove from './ordinalnt5-content/bms-wellorder-4-prove.txt?raw';
import PageSelect from './PageSelect.vue';
function getCurrentSequenceName(): string {
	const selecting = player.numbertheory.well_ordering.selecting;
	if (selecting === 0) return '无';
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
					0,
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
	<div align="center">
		<div class="center_line" />
		<div>
			<button class="clickable_button" @click="clickWellOrder()">
				获得{{ formatWhole(wellOrderGainPerClick()) }}推演能量
			</button>
		</div>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 0" align="center">
		<table>
			<tbody>
				<tr>
					<TDBuyable bylid="B6R11" />
					<TDBuyable bylid="B6R12" />
					<TDBuyable bylid="B6R13" />
					<TDBuyable bylid="B6R14" />
				</tr>
				<tr>
					<TDBuyable bylid="B6R15" />
					<TDBuyable bylid="B6R21" />
					<TDUpgrade upgid="U6R21" />
					<TDUpgrade upgid="U6R22" />
				</tr>
				<tr>
					<TDUpgrade upgid="U6R11" />
					<TDUpgrade upgid="U6R12" />
					<TDUpgrade upgid="U6R13" />
					<TDUpgrade upgid="U6R14" />
				</tr>
				<tr>
					<TDUpgrade upgid="U6R15" />
					<TDUpgrade upgid="U6R16" />
					<TDUpgrade upgid="U6R17" />
					<TDUpgrade upgid="U6R18" />
				</tr>
			</tbody>
		</table>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 1" align="center">
		<convertTextToComponent :text="prssdefinition" />
		<div class="center_line" />
		<PageSelect />
		<template v-if="player.numbertheory.well_ordering.pages[0] == 0">
			<div class="center_line" />
			<p>
				以下，用 <vue-latex expression="E" /> 表示空序列，用
				<vue-latex expression="\frown" /> 表示数列之间的连接。
			</p>
			<p>
				对于数列 <vue-latex expression="S" />，用
				<vue-latex expression="\textrm{length}(S)" /> 表示数列
				<vue-latex expression="S" /> 的长度，用
				<vue-latex expression="S_n(n < \textrm{length}(S))" /> 表示
				<vue-latex expression="S" /> 的第 <vue-latex expression="n" /> 项，
			</p>
			<p>
				用 <vue-latex expression="S_\Box" /> 表示 <vue-latex expression="S" /> 的末项，用
				<vue-latex expression="S^+" /> 表示 <vue-latex expression="S" /> 各项加
				<vue-latex expression="1" /> 后的数列。
			</p>
			<p>
				对于数列 <vue-latex expression="S" /> 和满足 <vue-latex expression="m" />
				<vue-latex expression="\le n \le \textrm{length}(S)" /> 的自然数
				<vue-latex expression="m,n" />，<br />将满足
				<vue-latex expression="T_x = S_{m+x}(\textrm{if}\ x < n-m)" /> 且
				<vue-latex expression="\textrm{length}(T) = n-m" /> 的唯一数列
				<vue-latex expression="T" /> 表示为 <vue-latex expression="\textrm{sub}(S,m,n)" />。
			</p>

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
		</template>
		<div class="center_line" />
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 1 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(1)
			"
		>
			<div>
				<h3>
					引理1<span v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(3)"
						>(未证明)</span
					>
				</h3>
				<p>
					1. 对于任意 <vue-latex expression="P" /> 的元素 <vue-latex expression="S" />，有
					<vue-latex expression="S" /> = <vue-latex expression="E" /> 或
					<vue-latex expression="S_0 = 0" />。
				</p>
				<p>
					2. 对于任意 <vue-latex expression="P" /> 的元素
					<vue-latex expression="A,B,C,D" />，若
					<vue-latex
						expression="A \frown (0) \frown B^+ = C \frown (0) \frown
					D^+"
					></vue-latex
					>，则 <vue-latex expression="A = C" /> 且 <vue-latex expression="B = D" />。
				</p>
				<div class="center_line" />
				<h2>证明</h2>
				1.
				<button
					class="clickable_button"
					@click="stepProceed(2)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(2)"
					style="display: inline-block"
				>
					证明引理1.1，消耗100,000推演能量</button
				><template v-else>
					使用基于 <vue-latex expression="P" /> 构造的结构归纳法证明。<br />若
					<vue-latex expression="S = E" />，则显然有 <vue-latex expression="S = E" /> 或
					<vue-latex expression="S_0 = 0" />。<br />若存在
					<vue-latex expression="(s,t) \in P^2" /> 满足
					<vue-latex
						expression="S = s \frown (0) \frown t^+"
					/>，且两者均满足条件。<br />若 <vue-latex expression="s = E" />，则
					<vue-latex
						expression="S = s \frown (0) \frown t^+ = E \frown (0) \frown t^+ = (0) \frown t^+"
					/>，所以 <vue-latex expression="S_0 = 0" />。<br />若
					<vue-latex expression="s_0 = 0" />，则由于
					<vue-latex expression="S = s \frown (0) \frown t^+" />，有
					<vue-latex expression="S_0 = 0" />。<br />通过结构归纳法，表明对于任意
					<vue-latex expression="P" /> 的元素 <vue-latex expression="S" />，有
					<vue-latex expression="S = E" /><br /><br />
					<span style="color: green"
						>引理1.1奖励：你可以自动更新溶液数量，九头蛇能量第二软上限变得更弱，推演能量获取速度×10。</span
					>
				</template>
				<div class="center_line" />
				2.
				<button
					class="clickable_button"
					@click="stepProceed(3)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(3)"
					style="display: inline-block"
				>
					证明引理1.2，消耗500,000,000推演能量</button
				><template v-else>
					证明其逆否命题。<br />即，由 <vue-latex expression="A \neq C" /> 或
					<vue-latex expression="B \neq D" /> 推导出
					<vue-latex
						expression="A \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"
					/>。<br />若 <vue-latex expression="A \neq C" />，则要么
					<vue-latex expression="\textrm{length}(A) \neq \textrm{length}(C)" />，要么存在
					<vue-latex expression="n < \textrm{length}(A)" /> 满足
					<vue-latex expression="A_n \neq C_n" />。<br />若
					<vue-latex
						expression="\textrm{length}(A) \neq \textrm{length}(C)"
					/>（不失一般性，设
					<vue-latex expression="\textrm{length}(A) < \textrm{length}(C)" />），<br />则
					<vue-latex
						expression="(C \frown (0) \frown D^+)_{\textrm{length}(C)} = ((0) \frown D^+)_{0} = 0"
					/>。<br />另一方面，<vue-latex
						expression="(A \frown (0) \frown B^+)_{\textrm{length}(C)} = ((0) \frown B^+)_{\textrm{length}(C) - \textrm{length}(A)} = B^+_{\textrm{length}(C) - \textrm{length}(A) -1} > 0"
					/>，<br />因此第 <vue-latex expression="\textrm{length}(C)" /> 项不相等，故
					<vue-latex
						expression="A \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"
					/>。<br />若存在 <vue-latex expression="n < \textrm{length}(A)" /> 满足
					<vue-latex expression="A_n \neq C_n" />，则对于该
					<vue-latex expression="n" />，有
					<vue-latex
						expression="(A \frown (0) \frown B^+)_n \neq (C \frown (0) \frown D^+)_n"
					/>，<br />所以
					<vue-latex
						expression="A \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"
					/>。<br />若 <vue-latex expression="A = C" /> 且
					<vue-latex expression="B \neq D" />，则
					<vue-latex
						expression="A \frown (0) \frown B^+ = C \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"
					/>。<br />综上，若 <vue-latex expression="A \neq C" /> 或
					<vue-latex expression="B \neq D" />，则
					<vue-latex
						expression="A \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"
					/>。<br /><br />
					<span style="color: green"
						>引理1.2奖励：进一步削弱九头蛇能量的二重软上限，自动获得NRC5完成次数，朊病毒获取速度×(推演能量+1)^2，NRC6完成次数加成推演能量获取</span
					>
					<div class="center_line" />
					<vue-latex expression="P" /> 是由 <vue-latex expression="E" /> 和函数
					<vue-latex expression="(A,B) \mapsto A \frown (0) \frown B^+" />
					生成的函数，引理 1.2 断言了自由生成（即
					<vue-latex expression="P" />
					的元素不会以两种不同的方式表示）。<br />由于该函数在后续证明中非常重要，将其简记为
					<vue-latex expression="\textrm{gen}(A,B) := A \frown (0) \frown B^+" />。<br />
					<button
						class="clickable_button"
						@click="stepProceed(4)"
						v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(4)"
						style="display: inline-block"
					>
						定义初等序列展开函数，消耗1.000e15推演能量
					</button>
				</template>
			</div>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 2 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(4)
			"
		>
			定义函数
			<vue-latex
				expression="\textrm{expand} : (P \setminus \{E\}) \times \mathbb N \to \mathbb N^{<\omega}"
			/>
			如下。<br />注意定义域的元素 <vue-latex expression="S" /> 非空，因此
			<vue-latex expression="S_\Box" /> 是确定的。<br />
			若 <vue-latex expression="S_\Box = 0" />，则
			<vue-latex
				expression="\textrm{expand}(S) := \textrm{sub}(S,0,\textrm{length}(S)-1)"
			/>。<br />
			若 <vue-latex expression="S_\Box > 0" />，则（由引理1.1）<vue-latex
				expression="0 \in \{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_\Box\}"
			/>，因此
			<vue-latex
				expression="\{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_\Box\}"
			/>
			非空。<br />
			定义
			<vue-latex
				expression="\textrm{br}(S) := \max \{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_\Box\}"
			/>。<br />
			定义
			<vue-latex expression="\textrm{gp}(S) := \textrm{sub}(S,0,\textrm{br}(S))" />。<br />
			定义
			<vue-latex
				expression="\textrm{bp}(S) := \textrm{sub}(S,\textrm{br}(S),\textrm{length}(S)-1)"
			/>。<br />
			定义
			<vue-latex
				expression="\textrm{expand}(S) := \textrm{gp}(S) \frown \underbrace{\textrm{bp}(S) \frown \cdots \frown \textrm{bp}(S)}_{n}"
			/>。<br />
			<button
				class="clickable_button"
				@click="stepProceed(5)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(5)"
				style="display: inline-block"
			>
				解锁引理2，消耗1.0000e17推演能量
			</button>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 3 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(5)
			"
		>
			<h3>引理2</h3>
			<p>
				1. 对于任意 <vue-latex expression="A \in P" />，有
				<vue-latex expression="\textrm{expand}(\textrm{gen}(A,E),n) = A" />。
			</p>
			<p>
				2. 对于任意 <vue-latex expression="(A,B) \in P^2" />，<br />有
				<vue-latex
					expression="\textrm{expand}(\textrm{gen}(A,\textrm{gen}(B,E)),n) = A \frown \underbrace{(0) \frown B^+ \frown \cdots \frown (0) \frown B^+}_n"
				/>。
			</p>
			<p>
				3. 对于任意
				<vue-latex expression="(A,B,C) \in P^2 \times (P \setminus \{E\})" />，<br />有
				<vue-latex
					expression="\textrm{expand}(\textrm{gen}(A,\textrm{gen}(B,C)),n) = \textrm{gen}(A,\textrm{expand}(\textrm{gen}(B,C),n))"
				/>。
			</p>
			<div class="center_line" />
			<h2>证明</h2>
			1.
			<button
				class="clickable_button"
				@click="stepProceed(6)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(6)"
				style="display: inline-block"
			>
				证明引理2.1，消耗1.0000e34推演能量</button
			><template v-else>
				令 <vue-latex expression="S := \textrm{gen}(A,E)" />，则
				<vue-latex expression="S = A \frown (0) \frown E^+ = A \frown (0)" />，<br />所以
				<vue-latex expression="S_\Box = 0" />。因此，<vue-latex
					expression="\textrm{expand}(S,n) = \textrm{sub}(S,0,\textrm{length}(S)-1) = A"
				/>。<br />
				<span style="color: green"
					>引理2.1奖励：九头蛇能量第二软上限再次变得更弱。九头蛇溶液加成推演能量获取</span
				>
			</template>
			<div class="center_line" />
			2.
			<button
				class="clickable_button"
				@click="stepProceed(7)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(7)"
				style="display: inline-block"
			>
				证明引理2.2，消耗1.0000e52推演能量</button
			><template v-else>
				令 <vue-latex expression="S := \textrm{gen}(A,\textrm{gen}(B,E))" />，则
				<vue-latex
					expression="S = A \frown (0) \frown (B \frown (0) \frown E^+)^+ = A \frown (0) \frown B^+ \frown (1)"
				/>。因此，<vue-latex expression="S_\Box = 1 > 0" />。<vue-latex
					expression="\textrm{br}(S) = \max \{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_\Box\} = \max \{i \in \mathbb N | i < \textrm{length}(S) \land S_i < 1\} = \max \{i \in \mathbb N | i < \textrm{length}(S) \land S_i = 0\}"
				/>。此处，由于 <vue-latex expression="S_{\textrm{length}(A)} = 0" />，所以
				<vue-latex
					expression="\textrm{length}(A) \in \{i \in \mathbb N | i < \textrm{length}(S) \land S_i = 0\}"
				/>。另外，对于任意 <vue-latex expression="n > \textrm{length}(S)" />，有
				<vue-latex
					expression="S_n = (B^+ \frown (1))_{n-\textrm{length}(S)-1} = 1+(B \frown (0))_{n-\textrm{length}(S)-1} > 0"
				/>，所以
				<vue-latex
					expression="n \notin \{i \in \mathbb N | i < \textrm{length}(S) \land S_i = 0\}"
				/>。因此，<vue-latex
					expression="\textrm{br}(S) = \max \{i \in \mathbb N | i < \textrm{length}(S) \land S_i = 0\} = \textrm{length}(A)"
				/>。此时，<vue-latex
					expression="\textrm{gp}(S) = \textrm{sub}(S,0,\textrm{br}(S)) = \textrm{sub}(A \frown (0) \frown B^+ \frown (1),0,\textrm{length}(A)) = A"
				/>。另外，<vue-latex
					expression="\textrm{bp}(S) = \textrm{sub}(S,\textrm{br}(S),\textrm{length}(S)-1) = \textrm{sub}(A \frown (0) \frown B^+ \frown (1),\textrm{length}(A),\textrm{length}(S)-1) = (0) \frown B^+"
				/>。因此，<vue-latex
					expression="\textrm{expand}(S,n) = A \frown \underbrace{(0) \frown B^+ \frown \cdots \frown (0) \frown B^+}_n"
				/>。<br />
				<span style="color: green"
					>引理2.2奖励：自动购买非递归定理，自动获得NRC6次数，B6-R-1-3、B6-R-1-4的效果底数翻倍，削弱九头蛇能量的二重软上限</span
				>
			</template>
			<div class="center_line" />
			3.
			<button
				class="clickable_button"
				@click="stepProceed(8)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(8)"
				style="display: inline-block"
			>
				证明引理2.3，消耗1.7977e308推演能量</button
			><template v-else>
				令 <vue-latex expression="S := \textrm{gen}(A,\textrm{gen}(B,C))" />，则
				<vue-latex
					expression="S = A \frown (0) \frown (B \frown (0) \frown C^+)^+ = A \frown (0) \frown B^+ \frown (1) \frown C^{++}"
				/>。由于 <vue-latex expression="C \neq E" />，有
				<vue-latex expression="S_\Box = C_\Box^{++} = C_\Box+2 > 1" />。另外，由于
				<vue-latex expression="S_{\textrm{length}(A)+1+\textrm{length}(B)} = 1" />，所以
				<vue-latex
					expression="\textrm{length}(A)+1+\textrm{length}(B) \in \{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_\Box\}"
				/>。特别地，<vue-latex
					expression="\textrm{br}(S) = \max\{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_\Box\} \ge \textrm{length}(A)+1+\textrm{length}(B)"
				/>。令 <vue-latex expression="r := \textrm{br}(S)" />。求
				<vue-latex
					expression="\textrm{br}(B \frown (0) \frown C^+) = \max\{i \in \mathbb N | i < \textrm{length}(B \frown (0) \frown C^+) \land (B \frown (0) \frown C^+)_i < (B \frown (0) \frown C^+)_\Box\}"
				/>。根据
				<vue-latex
					expression="\textrm{length}(A)+1+\textrm{length}(B \frown (0) \frown C^+) = \textrm{length}(S)"
				/>，<vue-latex
					expression="S_{\textrm{length}(A)+1+i} = (B \frown (0) \frown C^+)_i-1"
				/>，以及 <vue-latex expression="S_\Box = (B \frown (0) \frown C^+)_\Box-1" />，可得
				<vue-latex
					expression="\{i \in \mathbb N | i < \textrm{length}(B \frown (0) \frown C^+) \land (B \frown (0) \frown C^+)_i < (B \frown (0) \frown C^+)_\Box\} = \{i \in \mathbb N | \textrm{length}(A)+1+i < \textrm{length}(S) \land S_{\textrm{length}(A)+1+i} < S_\Box\}"
				/>。因此，<vue-latex
					expression="\textrm{br}(B \frown (0) \frown C^+) = \max\{i \in \mathbb N | i < \textrm{length}(B \frown (0) \frown C^+) \land (B \frown (0) \frown C^+)_i < (B \frown (0) \frown C^+)_\Box\} = r-\textrm{length}(A)-1"
				/>。
				<br />
				因此，<vue-latex
					expression="\textrm{gp}(B \frown (0) \frown C^+) = \textrm{sub}(B \frown (0) \frown C^+,0,r-\textrm{length}(A)-1)"
				/>，所以
				<vue-latex
					expression="\textrm{gp}(B \frown (0) \frown C^+)^+ = \textrm{sub}((B \frown (0) \frown C^+)^+,0,r-\textrm{length}(A)-1) = \textrm{sub}(S,\textrm{length}(A)+1,r)"
				/>。另外，<vue-latex
					expression="\textrm{bp}(B \frown (0) \frown C^+) = \textrm{sub}(B \frown (0) \frown C^+,r-\textrm{length}(A)-1,\textrm{length}(B \frown (0) \frown C^+))"
				/>，所以
				<vue-latex
					expression="\textrm{bp}(B \frown (0) \frown C^+)^+ = \textrm{sub}((B \frown (0) \frown C^+)^+,r-\textrm{length}(A)-1,\textrm{length}(B \frown (0) \frown C^+)-1) = \textrm{sub}(S,r,\textrm{length}(S)-1)"
				/>。进一步，<vue-latex
					expression="\textrm{gp}(S) = \textrm{sub}(S,0,r),\ \textrm{bp}(S) = \textrm{sub}(S,r,\textrm{length}(S)-1)"
				/>。因此，<vue-latex
					expression="\textrm{expand}(B \frown (0) \frown C^+,n)^+ = \textrm{gp}(B \frown (0) \frown C^+)^+ \frown \underbrace{\textrm{bp}(B \frown (0) \frown C^+)^+ \frown \cdots \frown \textrm{bp}(B \frown (0) \frown C^+)^+}_{n} = \textrm{sub}(S,\textrm{length}(A)+1,r) \frown \underbrace{\textrm{bp}(S) \frown \cdots \frown \textrm{bp}(S)}_{n}"
				/>。因此，<vue-latex
					expression="\textrm{expand}(S,n) = \textrm{sub}(S,0,r) \frown \underbrace{\textrm{bp}(S) \frown \cdots \frown \textrm{bp}(S)}_{n} = A \frown (0) \frown \textrm{sub}(S,\textrm{length}(A)+1,r) \frown \underbrace{\textrm{bp}(S) \frown \cdots \frown \textrm{bp}(S)}_{n} = A \frown (0) \frown \textrm{expand}(B \frown (0) \frown C^+,n)^+"
				/>。<br />
				<span style="color: green">引理2.3奖励：推演能量巨幅加成朊病毒获取速度</span>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 4 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(8)
			"
		>
			<h3>引理3</h3>
			<button
				class="clickable_button"
				@click="stepProceed(9)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(9)"
				style="display: inline-block"
			>
				解锁引理3，消耗3.000e320推演能量
			</button>
			<template v-else>
				<p><vue-latex expression="\textrm{expand}" /> 的值域</p>
				<p>
					对于任意 <vue-latex expression="S \in P" /> 和
					<vue-latex expression="n \in \mathbb N" />，有
					<vue-latex expression="S = E" /> 或
					<vue-latex expression="\textrm{expand}(S,n) \in P" />。
				</p>
			</template>
			<div class="center-line"></div>
			<button
				class="clickable_button"
				@click="stepProceed(10)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(10)"
				style="display: inline-block"
			>
				证明引理3，消耗3.000e325推演能量
			</button>
			<template v-else>
				<p>
					使用基于 <vue-latex expression="P" /> 构造的结构归纳法。若
					<vue-latex expression="S = E" />，情况显然。若存在
					<vue-latex expression="(T,U) \in P^2" /> 满足
					<vue-latex expression="S = \textrm{gen}(T,U)" />，且两者均满足条件。若
					<vue-latex expression="U = E" />，则由引理 2.1，有
					<vue-latex expression="\textrm{expand}(S,n) = T \in P" />。接下来，假设存在
					<vue-latex expression="(V,W) \in P^2" /> 满足
					<vue-latex expression="U = \textrm{gen}(V,W)" />，且两者均满足条件。若
					<vue-latex expression="W = E" />，则
					<vue-latex expression="S = \textrm{gen}(T,\textrm{gen}(V,E))" />，由引理 2.2，有
					<vue-latex
						expression="\textrm{expand}(S,n) = T \frown \underbrace{(0) \frown V^+ \frown \cdots \frown (0) \frown V^+}_n"
					/>。此处对 <vue-latex expression="n" /> 使用数学归纳法，有
					<vue-latex expression="\textrm{expand}(S,0) = T \in P" />，且
					<vue-latex
						expression="\textrm{expand}(S,k+1) = \textrm{expand}(S,k) \frown (0) \frown V^+ = \textrm{gen} (\textrm{expand}(S,k),V)"
					/>，因此可以证明对于任意 <vue-latex expression="n \in \mathbb N" />，有
					<vue-latex expression="\textrm{expand}(S,n) \in P" />。若
					<vue-latex expression="W \neq E" />，则
					<vue-latex expression="S = \textrm{gen}(T,\textrm{gen}(V,W))" />，由引理 2.3，有
					<vue-latex
						expression="\textrm{expand}(S,n) = \textrm{gen}(T,\textrm{expand}(\textrm{gen}(V,W),n)) = \textrm{gen}(T,\textrm{expand}(U,n)) \in P"
					/>。 因此，对于任意 <vue-latex expression="S \in P" />，有
					<vue-latex expression="S = E" /> 或
					<vue-latex expression="\textrm{expand}(S,n) \in P" />。
				</p>
				<p>
					引理 2 是通过 <vue-latex expression="P" /> 的结构对
					<vue-latex expression="\textrm{expand}" /> 行为进行分类的方法。引理 3 表明
					<vue-latex expression="\textrm{expand}" /> 的输出
					<vue-latex expression="P" /> 的元素。
				</p>
				<p>
					通过 <vue-latex expression="P" /> 的结构递归定义映射
					<vue-latex expression="\textrm{trans} : P \to \varepsilon_0" />。注意
					<vue-latex expression="\varepsilon_0" /> 是对加法和
					<vue-latex expression="\omega" /> 幂封闭的序数。 - 若
					<vue-latex expression="S = E" />，则
					<vue-latex expression="\textrm{trans}(S) := 0" />。 - 若存在
					<vue-latex expression="(A,B) \in P^2" /> 满足
					<vue-latex expression="S = \textrm{gen}(A,B)" />，则
					<vue-latex
						expression="\textrm{trans}(S) := \textrm{trans}(A) + \omega^{\textrm{trans}(B)}"
					/>。
				</p>
				<p style="color: green">引理3效果:B6-R-1-3, B6-R-1-4的底数再一次翻倍</p>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 5 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(10)
			"
		>
			<h3>引理4</h3>
			<button
				class="clickable_button"
				@click="stepProceed(11)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(11)"
				style="display: inline-block"
			>
				解锁引理4，消耗1.000e690推演能量
			</button>
			<template v-else>
				<p><vue-latex expression="\textrm{expand}" /> 的递减性</p>
				<p>
					对于任意 <vue-latex expression="S \in P" /> 和
					<vue-latex expression="n \in \mathbb N" />，有
					<vue-latex expression="S = E" /> 或
					<vue-latex
						expression="\textrm{trans}(\textrm{expand}(S,n)) < \textrm{trans}(S)"
					/>。
				</p>
			</template>
			<div class="center-line"></div>
			<button
				class="clickable_button"
				@click="stepProceed(12)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(12)"
				style="display: inline-block"
			>
				证明引理4，消耗1.000e695推演能量
			</button>
			<template v-else>
				<p>
					使用基于 <vue-latex expression="P" /> 构造的结构归纳法。若
					<vue-latex expression="S = E" />，情况显然。若存在
					<vue-latex expression="(T,U) \in P^2" /> 满足
					<vue-latex expression="S = \textrm{gen}(T,U)" />，且两者均满足条件。若
					<vue-latex expression="U = E" />，则由引理 2.1，有
					<vue-latex expression="\textrm{expand}(S,n) = T \in P" />。接下来，假设存在
					<vue-latex expression="(V,W) \in P^2" /> 满足
					<vue-latex expression="U = \textrm{gen}(V,W)" />，且两者均满足条件。若
					<vue-latex expression="W = E" />，则
					<vue-latex expression="S = \textrm{gen}(T,\textrm{gen}(V,E))" />，由引理 2.2，有
					<vue-latex
						expression="\textrm{expand}(S,n) = T \frown \underbrace{(0) \frown V^+ \frown \cdots \frown (0) \frown V^+}_n"
					/>。此处对 <vue-latex expression="n" /> 使用数学归纳法，有
					<vue-latex expression="\textrm{expand}(S,0) = T \in P" />，且
					<vue-latex
						expression="\textrm{expand}(S,k+1) = \textrm{expand}(S,k) \frown (0) \frown V^+ = \textrm{gen} (\textrm{expand}(S,k),V)"
					/>，因此可以证明对于任意 <vue-latex expression="n \in \mathbb N" />，有
					<vue-latex expression="\textrm{expand}(S,n) \in P" />。若
					<vue-latex expression="W \neq E" />，则
					<vue-latex expression="S = \textrm{gen}(T,\textrm{gen}(V,W))" />，由引理 2.3，有
					<vue-latex
						expression="\textrm{expand}(S,n) = \textrm{gen}(T,\textrm{expand}(\textrm{gen}(V,W),n)) = \textrm{gen}(T,\textrm{expand}(U,n)) \in P"
					/>。 因此，对于任意 <vue-latex expression="S \in P" />，有
					<vue-latex expression="S = E" /> 或
					<vue-latex expression="\textrm{expand}(S,n) \in P" />。
				</p>
				<p>
					引理 2 是通过 <vue-latex expression="P" /> 的结构对
					<vue-latex expression="\textrm{expand}" /> 行为进行分类的方法。引理 3 表明
					<vue-latex expression="\textrm{expand}" /> 的输出
					<vue-latex expression="P" /> 的元素。
				</p>
				<p>
					通过 <vue-latex expression="P" /> 的结构递归定义映射
					<vue-latex expression="\textrm{trans} : P \to \varepsilon_0" />。注意
					<vue-latex expression="\varepsilon_0" /> 是对加法和
					<vue-latex expression="\omega" /> 幂封闭的序数。 - 若
					<vue-latex expression="S = E" />，则
					<vue-latex expression="\textrm{trans}(S) := 0" />。 - 若存在
					<vue-latex expression="(A,B) \in P^2" /> 满足
					<vue-latex expression="S = \textrm{gen}(A,B)" />，则
					<vue-latex
						expression="\textrm{trans}(S) := \textrm{trans}(A) + \omega^{\textrm{trans}(B)}"
					/>。
				</p>
				<p style="color: green">引理4效果:BMS推演速度双指数^1.2</p>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 6 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(12)
			"
		>
			<h3>引理5</h3>
			<button
				class="clickable_button"
				@click="stepProceed(13)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(13)"
				style="display: inline-block"
			>
				解锁引理5，消耗1.000e700推演能量
			</button>
			<template v-else>
				<p>
					对于任意
					<vue-latex expression="S\in P, a:\mathbb N \rightarrow \mathbb N" />，都存在
					<vue-latex expression="k \in \mathbb N" /> 使得
					<vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}]=E" />.
				</p>
			</template>
			<div class="center-line"></div>
			<button
				class="clickable_button"
				@click="stepProceed(14)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(14)"
				style="display: inline-block"
			>
				证明引理5，消耗1.000e1125推演能量
			</button>
			<template v-else>
				<b
					>假设这样的 <vue-latex expression="k \in \mathbb N" /> 不存在。则对于每个
					<vue-latex expression="k \in \mathbb N" />，有
					<vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}] \neq E" />，所以
					<vue-latex
						expression="\textrm{trans}(S[a_0][a_1]\cdots[a_{k-1}]) \neq 0"
					/>。因此，如果 <vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}]" /> 有定义，则
					<vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}][a_k]" />
					也有定义。通过数学归纳法，对于任意
					<vue-latex expression="k \in \mathbb N" />，<vue-latex
						expression="S[a_0][a_1]\cdots[a_{k-1}]"
					/>
					都有定义。然而，由引理 4，有
					<vue-latex
						expression="\textrm{trans}(S) > \textrm{trans}(S[a_0]) > \textrm{trans}(S[a_0][a_1]) > \cdots "
					/>，这是一个序数的无穷降链。这与序数的良基性矛盾。由反证法，存在
					<vue-latex expression="k \in \mathbb N" /> 使得
					<vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}] = E" />。</b
				><br />
				<p style="color: green">引理5效果:推演能量获取速度^1.5。</p>
			</template>
		</template>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 2" align="center">
		<convertTextToComponent :text="bmsdefinition" />
		<div class="center_line"></div>
		<PageSelect />
		<div class="center_line"></div>
		<template v-if="player.numbertheory.well_ordering.pages[1] == 0">
			<button
				class="clickable_button"
				@click="stepProceed(15)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(15)"
				style="display: inline-block"
			>
				定义引理1，消耗1.000e2435推演能量
			</button>
			<template v-else>
				<convertTextToComponent :text="bmswellorder1" />
				<button
					class="clickable_button"
					@click="stepProceed(16)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(16)"
					style="display: inline-block"
				>
					证明引理1，消耗1.000e2940推演能量
				</button>
				<template v-else>
					<convertTextToComponent :text="bmswellorder1prove" />
					<p style="color: green">效果: UNOCF第五效果×30,000</p>
					<button
						class="clickable_button"
						@click="stepProceed(17)"
						v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(17)"
					>
						解锁引理2，消耗<span v-if="player.retribution == 1">1.000e2960</span><span v-else>1.000e2975</span>推演能量
					</button>
				</template>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 1 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(17)
			"
		>
			<convertTextToComponent :text="bmswellorder2" />
			<button
				class="clickable_button"
				@click="stepProceed(18)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(18)"
			>
				证明引理2，消耗1.000e8320推演能量
			</button>
			<template v-else>
				<convertTextToComponent :text="bmswellorder2prove" />
				<p style="color: green">
					奖励：移除九头蛇能量的二重软上限，略微降低B6-R-2-1价格的增长速度。
				</p>
				<button
					class="clickable_button"
					@click="stepProceed(19)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(19)"
				>
					解锁引理3，消耗1.00e42,258推演能量
				</button>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 2 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(19)
			"
		>
			<convertTextToComponent :text="bmswellorder3" />
			<button
				class="clickable_button"
				@click="stepProceed(20)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(20)"
			>
				证明引理3，消耗<span v-if="player.retribution == 1">1.00e58,888</span><span v-else>1.00e75,000</span>推演能量
			</button>
			<template v-else>
				<convertTextToComponent :text="bmswellorder3prove" />
				<p style="color: green">奖励：大幅度加成BMS推演速度。</p>
				<button
					class="clickable_button"
					@click="stepProceed(21)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(21)"
				>
					解锁引理4，消耗<span v-if="player.retribution == 1">1.00e60,000</span><span v-else>1.00e500,000</span>推演能量
				</button>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 3 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(21)
			"
		>
			<convertTextToComponent :text="bmswellorder4" />
			<button
				class="clickable_button"
				@click="stepProceed(22)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(22)"
			>
				证明引理4，消耗<span v-if="player.retribution == 1">1.00e88,000</span><span v-else>1.0e1,000,000</span>推演能量
			</button>
			<template v-else>
				<convertTextToComponent :text="bmswellorder4prove" />
				<p style="color: green">奖励：大幅度加成BMS推演速度。</p>
				<button
					class="clickable_button"
					@click="stepProceed(23)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(23)"
				>
					证明BMS的良序性，消耗e100,000,000推演能量。
				</button>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 4 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(23)
			"
		>
			<convertTextToComponent :text="bmswellorder" />
			<p style="color: green">
				奖励：你可以进行第一次果报重置......在e150000000推演能量之后，BMS推演速度的slog+{{
					format(
						player.numbertheory.well_ordering.energy
							.log10()
							.sub(150000000)
							.div(500000000)
							.clampMin(0)
							.clampMax(1),
					)
				}},
			</p>
		</template>
	</div>
</template>
