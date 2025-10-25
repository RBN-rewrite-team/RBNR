<script lang="ts" setup>
import { formatWhole } from '@/utils/format';
</script>

<template>
	<div class="main">
		<p>
			你有 <b style="color: cyan; font-size: 30px">{{ formatWhole(NaN) }}</b> 证明论解析次数
		</p>
		<p>没做完，不要管</p>
	</div>
</template>
