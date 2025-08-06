<script lang="ts" setup>
import { player } from '@/core/save';
import { format, physicalScale } from '@/utils/format';
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
			<p>你最高的数值是: ω</p>
			<p>你最高的加法能量是: ω</p>
			<p>你最高的乘法能量是: ω</p>
			<p>你产生了 ω 数值</p>
			<p>你产生了 ω 加法能量</p>
			<p>你产生了 ω 乘法能量</p>
			<p style="color: red">不对啊， 这个数值，加法能量，乘法能量是什么东西，我怎么不知道</p>
			<span style="opacity: 0.2;
  position: absolute;
  left: 50%;
  top: -30%;
  font-size: 500px;
  line-height: 300px;
  transform: translateX(-50%);">ω</span>
		</div>
	</div>
</template>
