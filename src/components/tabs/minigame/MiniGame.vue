<script setup lang="ts">
import { player } from '@/core/save';
import { initializeEditorMap } from '@/core/minigame/room';
import { handleKeyPress } from '@/core/minigame/minigame-loop';
import { temp } from '../../../core/temp-data';
import SkillTree from '../minigame/SkillTree.vue';
import MobileTable from './mobileTable.vue';
import NumerorumDetails from './NumerorumDetails.vue';
import DungeonTable from './DungeonTable.vue';
import EquipCore from './EquipCore.vue';

function atDEV() {
	return import.meta.env.DEV;
}
function enterEditor() {
	if (atDEV()) {
		player.minigame.ateditor = true;
		player.minigame.current_room = -999;
		player.minigame.current_x = 1n;
		player.minigame.current_y = 1n;
	}
}
function exitEditor() {
	if (atDEV()) {
		player.minigame.ateditor = !true;
		player.minigame.current_room = 0;
		player.minigame.current_x = 1n;
		player.minigame.current_y = 1n;
	}
}
</script>
<!-- v-if="(temp.dungeonsSP == 2 || temp.innerWidth >= 800) && !temp.openingCore" -->
<template>
	<div class="main">
		<!-- <MobileTable />
		<NumerorumDetails />
		<br />
		<EquipCore />
		<div
			style="
				position: absolute;
				left: 125px;
				bottom: 100px;
				height: 300px;
				width: 300px;
				z-index: 5;
			"
		>
			<button
				@click="handleKeyPress('up', $t)"
				class="movement_button"
				style="top: 50px; left: 150px"
			>
				↑
			</button>
			<button
				@click="handleKeyPress('down', $t)"
				class="movement_button"
				style="top: 250px; left: 150px"
			>
				↓
			</button>
			<button
				@click="handleKeyPress('left', $t)"
				class="movement_button"
				style="top: 150px; left: 50px"
			>
				←
			</button>
			<button
				@click="handleKeyPress('right', $t)"
				class="movement_button"
				style="top: 150px; left: 250px"
			>
				→
			</button>
		</div>
		<div
			style="position: absolute; left: 75%; top: 20px; transform: translateX(-50%)"
			v-if="(temp.dungeonsSP == 2 || temp.innerWidth >= 800) && !temp.openingCore"
		>
			<table>
				<tbody>
					<tr>
						<td style="width: 200px">
							X: {{ formatbigint(player.minigame.current_x) }}<br />
							Y: {{ formatbigint(player.minigame.current_y) }} {{ $t('dung.a') }}
							{{ player.minigame.skillpoint.toFixed(3) }}
						</td>
						<td style="width: 200px">
							<span v-html="temp.minigametip" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<br />
		<DungeonTable />
		<div
			v-if="
				(temp.dungeonsSP == 1 && temp.innerWidth < 800) ||
				(temp.innerWidth >= 800 && !temp.openingCore)
			"
		>
			{{ $t('studies.dung.title') }}<br />
			<div
				style="
					overflow: auto;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					width: 50%;
					height: 80%;
					bottom: 0;
					scrollbar-width: none;
				"
			>
				<SkillTree></SkillTree>
			</div>
		</div> -->
	</div>
</template>

<style lang="scss" scoped></style>
