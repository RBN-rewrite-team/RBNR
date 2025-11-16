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
import { component as cttc } from '../help/text-to-component-convert.tsx';
import prssdefinition from './ordinalnt5-content/prss-definition.txt?raw';
import prss1 from './ordinalnt5-content/prss-page-1-Pdef.txt?raw';
import prss2 from './ordinalnt5-content/prss-page-1.txt?raw';
import prss3 from './ordinalnt5-content/prss-page-2-1.txt?raw';
import prss4 from './ordinalnt5-content/prss-page-2-2.txt?raw';
import prss5 from './ordinalnt5-content/prss-page-2.txt?raw';
import prss6 from './ordinalnt5-content/prss-page-3-1.txt?raw';
import prss7 from './ordinalnt5-content/prss-page-4-1.txt?raw';
import prss8 from './ordinalnt5-content/prss-page-4-2.txt?raw';
import prss9 from './ordinalnt5-content/prss-page-4-3.txt?raw';
import prss10 from './ordinalnt5-content/prss-page-4-4.txt?raw';
import prss11 from './ordinalnt5-content/prss-page-5-1.txt?raw';
import prss12 from './ordinalnt5-content/prss-page-5-2.txt?raw';
import prss13 from './ordinalnt5-content/prss-page-6-1.txt?raw';
import prss14 from './ordinalnt5-content/prss-page-6-2.txt?raw';
import prss15 from './ordinalnt5-content/prss-page-7-1.txt?raw';
import prss16 from './ordinalnt5-content/prss-page-7-2.txt?raw';
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
		<cttc :text="prssdefinition" />
		<div class="center_line" />
		<PageSelect />
		<template v-if="player.numbertheory.well_ordering.pages[0] == 0">
			<div class="center_line" />
			<cttc :text="prss2" />

			<div class="center_line" />
			<p>下一步：定义由自然数构成的有限长数列的集合 P， P的递归定义是...</p>
			<div>
				<button
					class="clickable_button"
					@click="stepProceed(1)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(1)"
				>
					获得P的递归定义，消耗10推演能量</button
				><template v-else> <cttc :text="prss1" /> </template>
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
				<cttc :text="prss5" />
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
				><template v-else> <cttc :text="prss3" /> </template>
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
					<cttc :text="prss4" />

					<div class="center_line" />
					<span style="color: green"
						>引理1.2奖励：进一步削弱九头蛇能量的二重软上限，自动获得NRC5完成次数，朊病毒获取速度×(推演能量+1)^2，NRC6完成次数加成推演能量获取</span
					>
					<div class="center_line" />

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
			<cttc :text="prss6" />
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
			<cttc :text="prss7" />
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
				<cttc :text="prss8" />
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
				<cttc :text="prss9" />

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
				<cttc :text="prss10" />
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
			<template v-else> <cttc :text="prss11" /> </template>
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
				<cttc :text="prss12" />
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
			<template v-else> <cttc :text="prss13" /> </template>
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
				<cttc :text="prss14" />
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
			<template v-else> <cttc :text="prss15" /> </template>
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
				<b> <cttc :text="prss16" /> </b><br />
				<p style="color: green">引理5效果:推演能量获取速度^1.5。</p>
			</template>
		</template>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 2" align="center">
		<cttc :text="bmsdefinition" />
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
				<cttc :text="bmswellorder1" />
				<button
					class="clickable_button"
					@click="stepProceed(16)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(16)"
					style="display: inline-block"
				>
					证明引理1，消耗1.000e2940推演能量
				</button>
				<template v-else>
					<cttc :text="bmswellorder1prove" />
					<p style="color: green">效果: UNOCF第五效果×30,000</p>
					<button
						class="clickable_button"
						@click="stepProceed(17)"
						v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(17)"
					>
						解锁引理2，消耗<span v-if="player.retribution == 1">1.000e2960</span
						><span v-else>1.000e2975</span>推演能量
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
			<cttc :text="bmswellorder2" />
			<button
				class="clickable_button"
				@click="stepProceed(18)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(18)"
			>
				证明引理2，消耗1.000e8320推演能量
			</button>
			<template v-else>
				<cttc :text="bmswellorder2prove" />
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
			<cttc :text="bmswellorder3" />
			<button
				class="clickable_button"
				@click="stepProceed(20)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(20)"
			>
				证明引理3，消耗<span v-if="player.retribution == 1">1.00e58,888</span
				><span v-else>1.00e75,000</span>推演能量
			</button>
			<template v-else>
				<cttc :text="bmswellorder3prove" />
				<p style="color: green">奖励：大幅度加成BMS推演速度。</p>
				<button
					class="clickable_button"
					@click="stepProceed(21)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(21)"
				>
					解锁引理4，消耗<span v-if="player.retribution == 1">1.00e60,000</span
					><span v-else>1.00e500,000</span>推演能量
				</button>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 3 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(21)
			"
		>
			<cttc :text="bmswellorder4" />
			<button
				class="clickable_button"
				@click="stepProceed(22)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(22)"
			>
				证明引理4，消耗<span v-if="player.retribution == 1">1.00e88,000</span
				><span v-else>1.0e1,000,000</span>推演能量
			</button>
			<template v-else>
				<cttc :text="bmswellorder4prove" />
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
			<cttc :text="bmswellorder" />
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
