<script lang="ts" setup>
import { milestones } from '@/core/mechanic';
import { format } from '@/utils/format';
import { player } from '@/core/global';
import { i18n } from '@/utils/i18n';

const props = defineProps<{
	id: keyof typeof milestones;
}>();
const id = props.id as keyof typeof player.milestones;
</script>

<template>
	<tr>
		<td>
			<div
				class="milestone"
				:class="{ done: player.milestones[id] }"
				v-if="milestones[id].show"
			>
				<h3 style="display: inline-block" v-if="milestones[id].req ?? 0">
					{{ milestones[id].displayName }}:
					<span v-html="milestones[id].reqDescription" />
				</h3>
				<h3 style="display: inline-block" v-else>
					{{ milestones[id].displayName }}: {{ format(milestones[id].requirement) }}
					{{ $t(`currency.${milestones[id].currency}`) }}
				</h3>
				<br />
				<span
					v-html="
						// i18n.global.locale.value == 'zh-CN'
						milestones[id].description
						// : milestones[id].description2
					"
				/>
			</div>
		</td>
	</tr>
</template>

<style lang="scss" scoped>
tr {
	height: 70px;
}
</style>
