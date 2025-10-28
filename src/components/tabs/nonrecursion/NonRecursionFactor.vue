<script setup lang="ts">
import { format, formatWhole } from '@/utils/format';
import { player, feature } from '@/core/global';
import { temp } from '@/core/temp-data';
function gainFactor(): string {
	const ADD_EFF = 0,
		MUL_EFF = 1,
		POW_EFF = 2,
		DIL_EFF = 3,
		EXP_EFF = 4;
	let string = '';
	const factor = feature.NON_RECURSIVE.gainFactor();
	for (const i in factor) {
		const f = factor[i];
		if (f[1] == ADD_EFF) string += f[0] + ': +' + format(f[2]) + '<br>';
		else if (f[1] == MUL_EFF) string += f[0] + ': x' + format(f[2]) + '<br>';
		else if (f[1] == POW_EFF) string += f[0] + ': ^' + format(f[2]) + '<br>';
		else if (f[1] == DIL_EFF) string += f[0] + ': 底数为10的指数^' + format(f[2]) + '<br>';
		else if (f[1] == EXP_EFF) string += f[0] + ': ' + format(f[2]) + '^<br>';
	}
	return string;
}
</script>
<template v-if="temp.nonrecpagevisit[1]">
	当前重置后会获得的非递归能量：{{ formatWhole(feature.NON_RECURSIVE.gain()) }}<br />
	因素：<br />
	<span v-html="gainFactor()" />
</template>
