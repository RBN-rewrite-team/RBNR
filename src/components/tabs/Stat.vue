<script lang="ts" setup>
import { player } from '@/core/save';
import { format, physicalScale } from '@/utils/format';
import { getOrdinalLevel, ordinalDatas } from "../../core/ordinal/ordinal-level.ts"
</script>

<template>
	<div class="main">
		<template v-if="player.singularity.t < 666+2/3">
			<p>你最高的数值是: {{ format(player.stat.highestNumber) }}</p>
			<p>你最高的加法能量是: {{ format(player.stat.hightestAddpower) }}</p>
			<p>你最高的乘法能量是: {{ format(player.stat.highestMulpower) }}</p>
			<p>你产生了 {{ format(player.stat.totalNumber) }} 数值</p>
			<p>你产生了 {{ format(player.stat.totalAddpower) }} 加法能量</p>
			<p>你产生了 {{ format(player.stat.totalMulpower) }} 乘法能量</p>
			<p v-html="physicalScale(player.number)"></p>
		</template>
		<div v-if="player.singularity.t > 666+2/3" style="position: relative">
			<span style="opacity: 0.2;
  position: absolute;
  left: 50%;
  top: -30%;
  font-size: 500px;
  line-height: 300px;
  transform: translateX(-50%);">ω</span><br>
  
      <div>
			  当前序数等级：{{getOrdinalLevel()}}<br>
			  下一序数等级要求：<vue-latex :expression="ordinalDatas[getOrdinalLevel()] ?? '\\textit{way too large}'" />
			</div>
		</div>
	</div>
</template>
