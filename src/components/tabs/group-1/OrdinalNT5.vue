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
	      <TDUpgrade upgid="U6R11"/>
	      <TDUpgrade upgid="U6R12"/>
	      <TDUpgrade upgid="U6R13"/>
	      </tr>
	  </tbody>
	  </table>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 1" align="center">
		初等序列<vue-latex expression="(a_0,a_1,\ldots,a_{m-1},a_m)" />定义如下：
		<vue-latex expression="1.\ () = 0" display-mode />
		<vue-latex expression="2.\ (\#,0) = (\#)+1" display-mode />
		<div>
			<vue-latex
				expression="3.\ (\#_1,{\color{Red} a_i,\#_2},a_k) = (\#_1,{\color{Red} a_i,\#_2},{\color{Blue} a_i,\#_2},\ldots)"
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
		<template v-if="player.numbertheory.well_ordering.pages[0] == 0">
		<div class="center_line" />
		<p>以下，用 <vue-latex expression="E" /> 表示空序列，用 <vue-latex expression="\frown" /> 表示数列之间的连接。</p>
		<p>
			对于数列 <vue-latex expression="S" />，用 <vue-latex expression="\textrm{length}(S)" /> 表示数列 <vue-latex expression="S" /> 的长度，用
			<vue-latex expression="S_n(n < \textrm{length}(S))" /> 表示 <vue-latex expression="S" /> 的第 <vue-latex expression="n" /> 项，
		</p>
		<p>
			用 <vue-latex expression="S_\Box" /> 表示 <vue-latex expression="S" /> 的末项，用
			<vue-latex expression="S^+" /> 表示 <vue-latex expression="S" /> 各项加 <vue-latex expression="1" /> 后的数列。
		</p>
		<p>
			对于数列 <vue-latex expression="S" /> 和满足 <vue-latex expression="m" /> <vue-latex expression="\le n \le \textrm{length}(S)" /> 的自然数
			<vue-latex expression="m,n" />，<br>将满足 <vue-latex expression="T_x = S_{m+x}(\textrm{if}\ x < n-m)" /> 且
			<vue-latex expression="\textrm{length}(T) = n-m" /> 的唯一数列 <vue-latex expression="T" /> 表示为
			<vue-latex expression="\textrm{sub}(S,m,n)" />。
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
				<h3>引理1<span v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(3)">(未证明)</span></h3>
				<p>1. 对于任意 <vue-latex expression="P" /> 的元素 <vue-latex expression="S" />，有 <vue-latex expression="S" /> = <vue-latex expression="E" /> 或 <vue-latex expression="S_0 = 0" />。</p>
				<p>
					2. 对于任意 <vue-latex expression="P" /> 的元素 <vue-latex expression="A,B,C,D" />，若
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
	    		  使用基于 <vue-latex expression="P" /> 构造的结构归纳法证明。<br>若 <vue-latex expression="S = E" />，则显然有 <vue-latex expression="S = E" /> 或 <vue-latex expression="S_0 = 0" />。<br>若存在 <vue-latex expression="(s,t) \in P^2" /> 满足 <vue-latex expression="S = s \frown (0) \frown t^+" />，且两者均满足条件。<br>若 <vue-latex expression="s = E" />，则 <vue-latex expression="S = s \frown (0) \frown t^+ = E \frown (0) \frown t^+ = (0) \frown t^+"/>，所以 <vue-latex expression="S_0 = 0" />。<br>若 <vue-latex expression="s_0 = 0" />，则由于 <vue-latex expression="S = s \frown (0) \frown t^+" />，有 <vue-latex expression="S_0 = 0" />。<br>通过结构归纳法，表明对于任意 <vue-latex expression="P" /> 的元素 <vue-latex expression="S" />，有 <vue-latex expression="S = E" /><br><br>
	    		  <span style="color: green">引理1.1奖励：你可以自动更新溶液数量，九头蛇能量第二软上限变得更弱，推演能量获取速度×10。</span>
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
	    		  证明其逆否命题。<br>即，由 <vue-latex expression="A \neq C"/> 或 <vue-latex expression="B \neq D"/> 推导出 <vue-latex expression="A \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"/>。<br>若 <vue-latex expression="A \neq C"/>，则要么 <vue-latex expression="\textrm{length}(A) \neq \textrm{length}(C)"/>，要么存在 <vue-latex expression="n < \textrm{length}(A)"/> 满足 <vue-latex expression="A_n \neq C_n"/>。<br>若 <vue-latex expression="\textrm{length}(A) \neq \textrm{length}(C)"/>（不失一般性，设 <vue-latex expression="\textrm{length}(A) < \textrm{length}(C)"/>），<br>则 <vue-latex expression="(C \frown (0) \frown D^+)_{\textrm{length}(C)} = ((0) \frown D^+)_{0} = 0"/>。<br>另一方面，<vue-latex expression="(A \frown (0) \frown B^+)_{\textrm{length}(C)} = ((0) \frown B^+)_{\textrm{length}(C) - \textrm{length}(A)} = B^+_{\textrm{length}(C) - \textrm{length}(A) -1} > 0"/>，<br>因此第 <vue-latex expression="\textrm{length}(C)"/> 项不相等，故 <vue-latex expression="A \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"/>。<br>若存在 <vue-latex expression="n < \textrm{length}(A)"/> 满足 <vue-latex expression="A_n \neq C_n"/>，则对于该 <vue-latex expression="n"/>，有 <vue-latex expression="(A \frown (0) \frown B^+)_n \neq (C \frown (0) \frown D^+)_n"/>，<br>所以 <vue-latex expression="A \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"/>。<br>若 <vue-latex expression="A = C"/> 且 <vue-latex expression="B \neq D"/>，则 <vue-latex expression="A \frown (0) \frown B^+ = C \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"/>。<br>综上，若 <vue-latex expression="A \neq C"/> 或 <vue-latex expression="B \neq D"/>，则 <vue-latex expression="A \frown (0) \frown B^+ \neq C \frown (0) \frown D^+"/>。<br><br>
	    		  <span style="color: green">引理1.2奖励：进一步削弱九头蛇能量的二重软上限，自动获得NRC5完成次数，朊病毒获取速度×(推演能量+1)^2，NRC6完成次数加成推演能量获取</span>
		      <div class="center_line" />
		      <vue-latex expression="P"/> 是由 <vue-latex expression="E"/> 和函数 <vue-latex expression="(A,B) \mapsto A \frown (0) \frown B^+"/> 生成的函数，引理 1.2 断言了自由生成（即 <vue-latex expression="P"/> 的元素不会以两种不同的方式表示）。<br>由于该函数在后续证明中非常重要，将其简记为 <vue-latex expression="\textrm{gen}(A,B) := A \frown (0) \frown B^+"/>。<br>
		      <button
	    			class="clickable_button"
		    		@click="stepProceed(4)"
		    		v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(4)"
		    		style="display: inline-block"
	    		>
	    			定义初等序列展开函数，消耗1.000e15推演能量</button
	    		>
	    		</template>
			</div>
		</template>
		<template v-if="player.numbertheory.well_ordering.pages[0] == 2 &&player.numbertheory.well_ordering.steps_proceeded.includes(4)">
		  定义函数 <vue-latex expression="\textrm{expand} : (P \setminus \{E\}) \times \mathbb N \to \mathbb N^{<\omega}"/> 如下。<br>注意定义域的元素 <vue-latex expression="S"/> 非空，因此 <vue-latex expression="S_□"/> 是确定的。<br>
若 <vue-latex expression="S_□ = 0"/>，则 <vue-latex expression="\textrm{expand}(S) := \textrm{sub}(S,0,\textrm{length}(S)-1)"/>。<br>
若 <vue-latex expression="S_□ > 0"/>，则（由引理1.1）<vue-latex expression="0 \in \{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_□\}"/>，因此 <vue-latex expression="\{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_□\}"/> 非空。<br>
定义 <vue-latex expression="\textrm{br}(S) := \max \{i \in \mathbb N | i < \textrm{length}(S) \land S_i < S_□\}"/>。<br>
定义 <vue-latex expression="\textrm{gp}(S) := \textrm{sub}(S,0,\textrm{br}(S))"/>。<br>
定义 <vue-latex expression="\textrm{bp}(S) := \textrm{sub}(S,\textrm{br}(S),\textrm{length}(S)-1)"/>。<br>
定义 <vue-latex expression="\textrm{expand}(S) := \textrm{gp}(S) \frown \underbrace{\textrm{bp}(S) \frown \cdots \frown \textrm{bp}(S)}_{n}"/>。<br>
<button
	    			class="clickable_button"
		    		@click="stepProceed(5)"
		    		v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(5)"
		    		style="display: inline-block"
	    		>
	    			解锁引理2，消耗1.0000e17推演能量</button
	    		>
		</template>
		<template v-if="player.numbertheory.well_ordering.pages[0] == 3 &&player.numbertheory.well_ordering.steps_proceeded.includes(5)">
<h3>引理2</h3>
<p>1.  对于任意 <vue-latex expression="A \in P"/>，有 <vue-latex expression="\textrm{expand}(\textrm{gen}(A,E),n) = A"/>。</p>
<p>2.  对于任意 <vue-latex expression="(A,B) \in P^2"/>，<br>有 <vue-latex expression="\textrm{expand}(\textrm{gen}(A,\textrm{gen}(B,E)),n) = A \frown \underbrace{(0) \frown B^+ \frown \cdots \frown (0) \frown B^+}_n"/>。</p>
<p>3.  对于任意 <vue-latex expression="(A,B,C) \in P^2 \times (P \setminus \{E\})"/>，<br>有 <vue-latex expression="\textrm{expand}(\textrm{gen}(A,\textrm{gen}(B,C)),n) = \textrm{gen}(A,\textrm{expand}(\textrm{gen}(B,C),n))"/>。</p>
		      <h2>证明</h2>
		      1.
					<button
	    			class="clickable_button"
		    		@click="stepProceed(6)"
		    		v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(6)"
		    		style="display: inline-block"
	    		>
	    			证明引理2.1，消耗1.0000e35推演能量</button
	    		><template v-else>
	    		  令 <vue-latex expression="S := \textrm{gen}(A,E)"/>，则 <vue-latex expression="S = A \frown (0) \frown E^+ = A \frown (0)"/>，<br>所以 <vue-latex expression="S_□ = 0"/>。因此，<vue-latex expression="\textrm{expand}(S,n) = \textrm{sub}(S,0,\textrm{length}(S)-1) = A"/>。<br>
	    		  <span style="color: green">引理2.1奖励：九头蛇能量第二软上限再次变得更弱。九头蛇溶液加成推演能量获取</span>
	    		</template>
		</template>
	</div>
</template>
