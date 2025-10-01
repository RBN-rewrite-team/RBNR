<script setup lang="ts">
import { temp } from '@/core/temp-data';
</script>

<template>
	<table
		style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100px; z-index: 6"
		v-if="temp.innerWidth < 800"
	>
		<tbody>
			<tr>
				<td style="width: 25%" @click="temp.dungeonsSP = 0">人物属性</td>
				<td style="width: 25%" @click="temp.dungeonsSP = 1">技能树</td>
				<td style="width: 25%" @click="temp.dungeonsSP = 2">
					{{ temp.openingCore ? '核心' : '地下城' }}
				</td>
				<td style="width: 25%" @click="temp.dungeonsSP = 3">？？？</td>
			</tr>
		</tbody>
	</table>
</template>
