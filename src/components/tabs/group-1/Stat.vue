<script lang="ts" setup>
import { player } from '@/core/save';
import { feature } from '@/core/global';
import { format, physicalScale } from '@/utils/format';
import { OrdinalUtils } from '@/utils/ordinal';
import { Ordinal } from '@/lib/ordinal/';
import {
	getOrdinalLevel,
	ordinalNormal,
	getBMSOLReq,
} from '../../../core/ordinal/ordinal-level.ts';
import { Moon } from 'lunarphase-js';
import { ref, onMounted, onUnmounted } from 'vue';

const LunarMap = {
	New: '新月',
	'Waxing Crescent': '峨眉月',
	'First Quarter': '上弦月',
	'Waxing Gibbous': '盈凸月',
	Full: '满月',
	'Waning Gibbous': '亏凸月',
	'Last Quarter': '下弦月',
	'Waning Crescent': '残月',
};

function getCNLunarPhase() {
	const phase = Moon.lunarPhase();
	return LunarMap[phase] ?? phase;
}

let updateKey = ref(0);
let interval = setInterval(() => updateKey.value++);
onUnmounted(() => clearInterval(interval));
</script>

<template>
	<div class="main">
		<template v-if="player.singularity.t < 666 + 2 / 3">
			<p>你最高的数值是: {{ format(player.stat.highestNumber) }}</p>
			<p>你最高的加法能量是: {{ format(player.stat.hightestAddpower) }}</p>
			<p>你最高的乘法能量是: {{ format(player.stat.highestMulpower) }}</p>
			<p>你最高的指数能量是: {{ format(player.stat.highestExppower) }}</p>
			<p>你产生了 {{ format(player.stat.totalNumber) }} 数值</p>
			<p>你产生了 {{ format(player.stat.totalAddpower) }} 加法能量</p>
			<p>你产生了 {{ format(player.stat.totalMulpower) }} 乘法能量</p>
			<p>你产生了 {{ format(player.stat.totalExppower) }} 指数能量</p>
			<p v-html="physicalScale(player.number)"></p>
		</template>
		<div v-if="player.singularity.t > 666 + 2 / 3" style="position: relative">
			<span
				style="
					opacity: 0.2;
					position: absolute;
					left: 50%;
					top: -30%;
					font-size: 500px;
					line-height: 300px;
					transform: translateX(-50%);
				"
				>ω</span
			><br />

			<div>
				当前序数等级：{{ getOrdinalLevel() }}<br />
				累计最高序数等级：{{ player.stat.highestOrdLevel }}<br />
				下一序数等级要求：<vue-latex
					:expression="
						getOrdinalLevel() < ordinalNormal.length
							? OrdinalUtils.numberToLaTeXOrdinal(
									new Ordinal(ordinalNormal?.[getOrdinalLevel()]?.[0]).toDecimal(
										feature.Ordinal.base(),
									),
									feature.Ordinal.base(),
								)
							: '\\textit{way too large}'
					"
					v-if="!player.upgrades[61]"
				/>
				<vue-latex :expression="getBMSOLReq(getOrdinalLevel())" />
			</div>
		</div>
		<p>
			你已经玩了
			{{ format((Date.now() - player.saveCreateTime) / 1000 / 31536000) }}年。
		</p>
		<p :key="updateKey">
			(北半球)月相：{{ getCNLunarPhase() }}，月龄占比：{{
				format(Moon.lunarAgePercent() * 100, 7)
			}}%，地月距离：{{ format(Moon.lunarDistance() * 6371000) }}米
		</p>
	</div>
</template>
