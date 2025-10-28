<script setup lang="ts">
import { equipmentDisplay, equipmentAttribute, type CoreEquipment } from '@/core/minigame';
import { player } from '@/core/save';
import { initializeEditorMap } from '@/core/minigame/room';
import { handleKeyPress } from '@/core/minigame/minigame-loop';
import { temp } from '../../../core/temp-data';
import SkillTree from '../minigame/SkillTree.vue';
import MobileTable from './mobileTable.vue';
import NumerorumDetails from './NumerorumDetails.vue';
import DungeonTable from './DungeonTable.vue';
import EquipCore from './EquipCore.vue';

function formatbigint(b: bigint) {
	if (b < 1000n) return b.toString();
	let a = b.toString();
	const l = a.length - 1;
	a = a.slice(0, 7);
	a = a.slice(0, 1) + '.' + a.slice(1, 7) + 'e' + l.toString();
	return a;
}

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

<template>
	<div class="main">
		<MobileTable />
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
			v-if="(temp.dungeonsSP == 2 || temp.innerWidth >= 800) && !temp.openingCore"
		>
			<button
				@click="handleKeyPress('up')"
				class="movement_button"
				style="top: 50px; left: 150px"
			>
				↑
			</button>
			<button
				@click="handleKeyPress('down')"
				class="movement_button"
				style="top: 250px; left: 150px"
			>
				↓
			</button>
			<button
				@click="handleKeyPress('left')"
				class="movement_button"
				style="top: 150px; left: 50px"
			>
				←
			</button>
			<button
				@click="handleKeyPress('right')"
				class="movement_button"
				style="top: 150px; left: 250px"
			>
				→
			</button>
			<button
				class="clickable_button"
				v-if="atDEV()"
				@click="enterEditor"
				style="position: absolute; top: 90%"
			>
				编辑模式
			</button>
			<button
				class="clickable_button"
				v-if="atDEV()"
				@click="exitEditor"
				style="position: absolute; top: 100%"
			>
				退出编辑模式
			</button>
		</div>
		<div
			v-if="player.minigame.ateditor && !temp.openingCore"
			style="display: flex; flex-direction: row; justify-content: center"
		>
			<button class="clickable_button" @click="player.minigame.editor_mode = 'replace'">
				放置方块
			</button>
			<button class="clickable_button" @click="player.minigame.editor_mode = 'remove'">
				移除方块
			</button>
			<button class="clickable_button" @click="player.minigame.block = 'W'">
				切换方块类型为 墙
			</button>
			<button class="clickable_button" @click="player.minigame.block = '0'">
				切换方块类型为 空气
			</button>
			<button class="clickable_button" @click="player.minigame.block = 'FAKEWALL'">
				切换方块类型为 假墙
			</button>
		</div>
		<div
			v-if="player.minigame.ateditor"
			style="display: flex; flex-direction: row; justify-content: center"
		>
			<button class="clickable_button" @click="initializeEditorMap">地图方块初始化</button>
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
							Y: {{ formatbigint(player.minigame.current_y) }} 技能点:
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
			技能树<br />
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
		</div>
	</div>
</template>

<style lang="scss" scoped>
.movement_button {
	position: absolute;
	width: 80px;
	height: 80px;
	transform: translate(-50%, -50%);
	background-color: var(--background-color);
	color: var(--color);
	font-size: 30px;
	border: 2px solid var(--color);
}
</style>
