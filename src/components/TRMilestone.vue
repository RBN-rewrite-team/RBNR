<script lang="ts" setup>
import { milestones } from '@/core/mechanic';
import { format, formatWhole } from '@/utils/format';
import { player } from '@/core/global';

const props = defineProps<{
	id: keyof typeof milestones;
}>();
const id = props.id as keyof typeof player.milestones;
</script>

<template>
	<tr>
		<td>
			<div class="milestone" :class="{ done: player.milestones[id] }">
				<h3 style="display: inline-block">
					{{ milestones[id].displayName }}: {{ format(milestones[id].requirement) }}
					{{ milestones[id].currency }}
				</h3>
				<br />
				<span v-html="milestones[id].description" />
			</div>
		</td>
	</tr>
</template>

<style lang="scss" scoped>
.milestone {
	width: 500px;
	height: 70px;
	border: 2px solid red;
	text-align: center;

	&.done {
		border-color: green;
	}
}

tr {
	height: 70px;
}
</style>
