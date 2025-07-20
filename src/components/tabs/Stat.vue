<script lang="ts" setup>
import { player } from '@/core/save';
import { format } from '@/utils/format';
</script>

<template>
	<div class="main">
		<p>你最高的数字是: {{ format(player.stat.highestNumber) }}</p>
		<p>你最高的加法能量是: {{ format(player.stat.hightestAddpower) }}</p>
		<p>你最高的乘法能量是: {{ format(player.stat.highestMulpower) }}</p>
		<p>你产生了 {{ format(player.stat.totalNumber) }} 数字</p>
		<p>你产生了 {{ format(player.stat.totalAddpower) }} 加法能量</p>
		<p>你产生了 {{ format(player.stat.totalMulpower) }} 乘法能量</p>
	</div>
</template>
