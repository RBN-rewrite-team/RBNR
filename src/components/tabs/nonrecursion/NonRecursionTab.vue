<script setup lang="ts">
import TRMilestone from '@/components/TRMilestone.vue';
import StudyTree from './StudyTree.vue';
import { format, formatWhole } from '@/utils/format';
import { addTheories, theoriesCost } from '@/core/nonrecu/studies';
import { getTotalTheories } from '@/core/nonrecu/total-theories';
import { Currencies, getCurrency } from '@/core/currencies';
import { player, feature } from '@/core/global';
import { temp } from '@/core/temp-data';
function gainFactor(): string {
	const ADD_EFF = 0, MUL_EFF = 1, POW_EFF = 2, DIL_EFF = 3, EXP_EFF = 4;
	let string = '';
	let factor = feature.NON_RECURSIVE.gainFactor();
	for(let i in factor)
	{
		let f = factor[i];
		if(f[1] == ADD_EFF) string += f[0] + ': +' + format(f[2]) + '<br>';
		else if(f[1] == MUL_EFF) string += f[0] + ': x' + format(f[2]) + '<br>';
		else if(f[1] == POW_EFF) string += f[0] + ': ^' + format(f[2]) + '<br>';
		else if(f[1] == DIL_EFF) string += f[0] + ': 底数为10的指数^' + format(f[2]) + '<br>';
		else if(f[1] == EXP_EFF) string += f[0] + ': ' + format(f[2]) + '^<br>';
	}
	return string;
}
</script>

<template>
	<div class="main" align="center">
		<br>
		<div class="subpage">
			<div class="subpagetitle" @click="temp.nonrecpagevisit[0] = !temp.nonrecpagevisit[0]">非递归里程碑</div>
			<template v-if="temp.nonrecpagevisit[0]">
				<p>
					你非递归重置了<b style="color: #c98300; font-size: 30px">{{
						formatWhole(player.nonrecu.resetTimes)
					}}</b
					>次。
				</p>
				<table align="center">
					<TRMilestone :id="'nonrec_' + i" v-for="i in 15" :key="i"></TRMilestone>
				</table>
			</template>
		</div>
		<div class="subpage" style="position: relative">
			<div class="subpagetitle" @click="temp.nonrecpagevisit[1] = !temp.nonrecpagevisit[1]">能量因素</div>
			<template v-if="temp.nonrecpagevisit[1]">
				当前重置后会获得的非递归能量：{{formatWhole(feature.NON_RECURSIVE.gain())}}<br>
				因素：<br>
				<span v-html="gainFactor()" />
			</template>
		</div>
		<div class="subpage" style="position: relative">
			<div class="subpagetitle" @click="temp.nonrecpagevisit[2] = !temp.nonrecpagevisit[2]">非递归研究</div>
			<template v-if="temp.nonrecpagevisit[2]">
				<p>
					你一共有<b style="color: #c98300; font-size: 30px">{{
						formatWhole(getTotalTheories())
					}}</b
					>非递归理论，还剩下{{ formatWhole(getCurrency(Currencies.NRT)) }}。
				</p>
				<div style="height: 400px; overflow: auto">
				<StudyTree />
				</div>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.studies_row {
	display: flex;
	justify-content: center;
}
.studies_row > .study {
	margin: 7px;
}
.subpage {
	width: 80%;
	padding: 5px;
	border: 2px solid rgb(245, 193, 73);
}
.subpagetitle {
	width: 100%;
	border: 2px solid rgb(245, 193, 73);
	color: #c98300;
	font-size: 24px;
}
</style>
