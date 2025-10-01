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
			Your Numerorum is
			{{ format((Date.now() - player.saveCreateTime) / 1000 / 31536000) }} years old.
		</p>
	</div>
</template>
