<script setup lang="ts">
import TRMilestone from '@/components/TRMilestone.vue';
import StudyTree from './StudyTree.vue';
import { formatWhole } from '@/utils/format';
import { addTheories, theoriesCost } from '@/core/nonrecu/studies';
import { getTotalTheories } from '@/core/nonrecu/total-theories';
import { Currencies, getCurrency } from '@/core/currencies';
import { player } from '@/core/global';
import { temp } from '@/core/temp-data';
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
					<TRMilestone :id="'nonrec_' + i" v-for="i in 10" :key="i"></TRMilestone>
				</table>
			</template>
		</div>
		<div class="subpage">
			<div class="subpagetitle" @click="temp.nonrecpagevisit[1] = !temp.nonrecpagevisit[1]">非递归研究</div>
			<template v-if="temp.nonrecpagevisit[1]">
				<p>
					你一共有<b style="color: #c98300; font-size: 30px">{{
						formatWhole(getTotalTheories())
					}}</b
					>非递归理论，还剩下{{ formatWhole(getCurrency(Currencies.NRT)) }}。
				</p>
				<StudyTree />
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
