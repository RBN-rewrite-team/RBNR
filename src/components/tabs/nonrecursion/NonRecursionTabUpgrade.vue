<script lang="ts" setup>
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import {player} from '@/core/save';
</script>

<template>
	<div class="main">
		<table align="center">
			<tbody>
				<tr>
					<TDUpgrade upgid="71"></TDUpgrade>
					<TDUpgrade upgid="72"></TDUpgrade>
					<TDUpgrade upgid="73"></TDUpgrade>
					<TDUpgrade upgid="74"></TDUpgrade>
				</tr>
				<tr><template v-if="player.milestones.nonrec_26">
					<TDUpgrade upgid="75"></TDUpgrade>
					<TDUpgrade upgid="76"></TDUpgrade>
				</template></tr>
			</tbody>
		</table>
	</div>
</template>
