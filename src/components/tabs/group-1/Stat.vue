<script lang="ts" setup>
import { player } from '@/core/save';
import { feature } from '@/core/global';
import { format, formatTime, physicalScale } from '@/utils/format';
import { OrdinalUtils } from '@/utils/ordinal';
import { Ordinal } from '@/lib/ordinal/';
import {
	getOrdinalLevel,
	ordinalNormal,
	getBMSOLReq,
} from '../../../core/ordinal/ordinal-level.ts';
import { LunarPhase, Moon } from 'lunarphase-js';
import { ref, onUnmounted } from 'vue';
import Mountain from '../y/Mountain.vue';
import ResetTables from '../stat/ResetTables.tsx';
import CenterLine from '@/components/ui/CenterLine.vue';
import { currencyName, Currencies } from '@/core/currencies.ts';
import { useI18n } from 'vue-i18n';
import { i18n } from '@/utils/i18n.ts';
const $t = useI18n().t;
const LunarMap = {
	New: '新月',
	'Waxing Crescent': '峨眉月',
	'First Quarter': '上弦月',
	'Waxing Gibbous': '盈凸月',
	Full: '满月',
	'Waning Gibbous': '亏凸月',
	'Last Quarter': '下弦月',
	'Waning Crescent': '残月',
} as const;

function getCNLunarPhase() {
	const phase = Moon.lunarPhase();
	return LunarMap[phase] ?? phase;
}

const updateKey = ref(0);
const interval = setInterval(() => updateKey.value++);
onUnmounted(() => clearInterval(interval));
function highestIs(cur: Currencies, p: string) {
	return $t('stat.highest', { currency: currencyName(cur, $t), amount: p });
}
function produced(cur: Currencies, p: string) {
	return $t('stat.produced', { currency: currencyName(cur, $t), amount: p });
}
function phase() {
	return $t('stat.moon', {
		phase:
			i18n.global.locale.value == 'zh-CN'
				? getCNLunarPhase()
				: Moon.lunarPhase() + Moon.lunarPhaseEmoji(),
		age: format(Moon.lunarAgePercent() * 100, 7),
		distance: format(Moon.lunarDistance() * 6371000),
	});
	// (北半球)月相：{{
	// 			i18n.global.locale.value == 'zh-CN' ? getCNLunarPhase() : Moon.lunarPhase()
	// 		}}，月龄占比：{{ format(Moon.lunarAgePercent() * 100, 7) }}%，地月距离：{{
	// 			format(Moon.lunarDistance() * 6371000)
	// 		}}米
}
</script>

<template>
	<div class="main">
		<template v-if="player.singularity.t < 666 + 2 / 3">
			<p>{{ highestIs(Currencies.NUMBER, format(player.stat.highestNumber)) }}</p>
			<p>{{ highestIs(Currencies.ADDITION_POWER, format(player.stat.hightestAddpower)) }}</p>
			<p>
				{{
					highestIs(Currencies.MULTIPLICATION_POWER, format(player.stat.highestMulpower))
				}}
			</p>
			<p>
				{{ highestIs(Currencies.EXPONENTION_POWER, format(player.stat.highestExppower)) }}
			</p>
			<p>{{ produced(Currencies.NUMBER, format(player.stat.totalNumber)) }}</p>
			<p>{{ produced(Currencies.ADDITION_POWER, format(player.stat.totalAddpower)) }}</p>
			<p>
				{{ produced(Currencies.MULTIPLICATION_POWER, format(player.stat.totalMulpower)) }}
			</p>
			<p>
				{{ produced(Currencies.EXPONENTION_POWER, format(player.stat.totalExppower)) }}
			</p>
			<p v-if="i18n.global.locale.value == 'zh-CN'" v-html="physicalScale(player.number)"></p>
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

			<div v-if="player.retribution === 0">
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
			{{
				$t('stat.youhaveplayed', {
					time: formatTime((Date.now() - player.saveCreateTime) / 1000),
				})
			}}
		</p>
		<p :key="updateKey" v-html="phase()"></p>
		<Mountain v-if="player.retribution === 1" />
		<CenterLine />
		<template v-if="player.stat.recent10PTOReset.length >= 1">
			<h1>证明论重置记录</h1>
			<ResetTables :data="player.stat.recent10PTOReset" currency="拜谢" />
		</template>
		<template v-if="player.stat.recent10NonRecReset.length >= 1">
			<h1>非递归重置记录</h1>
			<ResetTables :data="player.stat.recent10NonRecReset" currency="非递归能量" />
		</template>
	</div>
</template>
