<script setup lang="ts">
import {
	currentPlayerLV,
	nextLVxp,
	hardResetMiniGame,
	keyboardEventListener,
	getWorldLevel,
	LVpercent,
} from '@/core/minigame';
import { player } from '@/core/save';
import ObjectNode from '../developermode/ObjectNode';
import MiniGameTD from '../../group-2/MiniGameTD.vue';
import {
	getCurrentBlock,
	getPlayerMap,
	getPlayerCurrentMap,
	isPlayerVisible,
	visibleBlocks,
	isTouched,
	addReplace,
	removeReplaces,
	initializeEditorMap,
} from '@/core/minigame/room';
import { handleKeyPress } from '@/core/minigame/minigame-loop';
import { meBattleInfo } from '@/core/minigame/battle';
import { range } from '@/utils/algorithm';
import { temp } from '../../../core/temp-data';
import { format } from '@/utils/format';
import { MoveableBoxGameObject } from '@/core/minigame/game-object';
import ModalService from '@/utils/Modal';
import SkillTree from '../minigame/SkillTree.vue';

function spawn(id: number): void {
	((player.minigame.current_room = id),
		(player.minigame.current_x = 1n),
		(player.minigame.current_y = 1n));
	player.minigame.hp = meBattleInfo().hpMax;
	if (!player.minigame.visited.includes(id)) player.minigame.visited.push(id);
	for (let k in player.minigame.replaces) {
		let repl = player.minigame.replaces[k];
		for (let i in repl)
			if (player.minigame.replaces[k][i].recover) delete player.minigame.replaces[k][i];
	}
}
function formatbigint(b: bigint) {
	if (b < 1000n) return b.toString();
	let a = b.toString();
	let l = a.length - 1;
	a = a.slice(0, 7);
	a = a.slice(0, 1) + '.' + a.slice(1, 7) + 'e' + l.toString();
	return a;
}

/**
 * 此次更新修复了某些人总是说“你 妈 的”的问题
 */
function clickBlock(room: number, x: bigint, y: bigint, block: ReturnType<typeof getCurrentBlock>) {
	if (isTouched(x, y)) {
		if (block instanceof MoveableBoxGameObject) {
			addReplace(room, x, y, '0', false);
			player.minigame.taking_box = true;
			temp.minigametip = '已拿起箱子（只能在玩家上下左右1格放下箱子）';
		} else if (block === null && player.minigame.taking_box) {
			addReplace(room, x, y, 'BOX', false);
			temp.minigametip = '已放下箱子';
		}
	}
	if (player.minigame.ateditor) {
		// ModalService.show({content: "拜谢"})

		if (player.minigame.editor_mode == 'replace') {
			removeReplaces(room, x, y);
			addReplace(room, x, y, player.minigame.block, false);
		}
		if (player.minigame.editor_mode == 'remove') {
			removeReplaces(room, x, y);
		}
	}
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
		<table
			style="position: absolute; bottom: 0; left: 0; width: 100%; height: 100px; z-index: 6"
			v-if="temp.innerWidth < 800"
		>
			<tbody>
				<tr>
					<td style="width: 25%" @click="temp.dungeonsSP = 0">人物属性</td>
					<td style="width: 25%" @click="temp.dungeonsSP = 1">技能树</td>
					<td style="width: 25%" @click="temp.dungeonsSP = 2">地下城</td>
					<td style="width: 25%" @click="temp.dungeonsSP = 3">？？？</td>
				</tr>
			</tbody>
		</table>
		<div
			style="
				position: absolute;
				left: 0%;
				width: 400px;
				height: 200px;
				background-color: grey;
				z-index: 6;
			"
			v-if="temp.dungeonsSP == 0 || temp.innerWidth >= 800"
		>
			Numerorum<br />
			<div style="position: relative; height: 50px; width: 400px; background-color: black">
				<div align="center" style="font-size: 17px; color: white">
					生命值：{{ meBattleInfo().hp }}/{{ meBattleInfo().hpMax }}({{
						Math.ceil((meBattleInfo().hp / meBattleInfo().hpMax) * 100)
					}}%)
				</div>
				<div
					:style="{
						position: 'absolute',
						height: '25px',
						width: (meBattleInfo().hp / meBattleInfo().hpMax) * 400 + 'px',
						'background-color': 'red',
					}"
				></div>
			</div>
			<table style="width: 100%">
				<tbody>
					<tr>
						<td>当前攻击力: {{ meBattleInfo().atk }}</td>
						<td>当前防御: {{ meBattleInfo().def }}</td>
					</tr>
					<tr>
						<td>
							当前LV: {{ currentPlayerLV() }}<br />
							(世界等级: {{ getWorldLevel() }})
						</td>
						<td
							:style="{
								'background-image':
									'linear-gradient(to right, green ' +
									LVpercent() * 100 +
									'%, black ' +
									LVpercent() * 100 +
									'%)',
								color: 'white',
							}"
						>
							当前XP: {{ player.minigame.xp }}/{{ nextLVxp() }}
						</td>
					</tr>
					<tr>
						<td>
							矿石收集：{{ player.minigame.ore_gets }}<br />(+{{
								player.minigame.ore_gets * 0.25
							}}%全局速度)
						</td>
						<td>
							宝箱收集：<span
								style="color: rgb(186, 110, 64)"
								v-html="player.minigame.box_gets[0]"
							/>/<span
								style="color: rgb(233, 233, 216)"
								v-html="player.minigame.box_gets[1]"
							/>/<span
								style="color: rgb(218, 178, 115)"
								v-html="player.minigame.box_gets[2]"
							/>
						</td>
					</tr>
					<tr>
						<td><button @click="spawn(0)">Dungeon 1</button></td>
						<td v-if="player.minigame.visited.includes(1)">
							<button @click="spawn(1)">Dungeon 2</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<br />
		<div
			style="
				position: absolute;
				left: 125px;
				bottom: 100px;
				height: 300px;
				width: 300px;
				z-index: 5;
			"
			v-if="temp.dungeonsSP == 2 || temp.innerWidth >= 800"
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
			v-if="player.minigame.ateditor"
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
			v-if="temp.dungeonsSP == 2 || temp.innerWidth >= 800"
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
		<table
			:style="{
				position: 'absolute',
				left: temp.dungeonsSP == 2 && temp.innerWidth < 800 ? '25%' : '75%',
				top: temp.dungeonsSP == 2 && temp.innerWidth < 800 ? '25%' : '50%',
				transform: 'translate(-50%, -50%)',
			}"
			v-if="temp.dungeonsSP == 2 || temp.innerWidth >= 800"
		>
			<tbody>
				<template
					v-for="y in range(
						player.minigame.current_y - visibleBlocks(),
						player.minigame.current_y + visibleBlocks() + 1n,
					)"
				>
					<tr>
						<template
							v-for="x in range(
								player.minigame.current_x - visibleBlocks(),
								player.minigame.current_x + visibleBlocks() + 1n,
							)"
						>
							<template
								v-if="
									player.minigame.current_x !== x ||
									player.minigame.current_y !== y
								"
							>
								<MiniGameTD
									v-if="isPlayerVisible(x, y)"
									@click="
										clickBlock(
											player.minigame.current_room,
											x,
											y,
											getCurrentBlock(player.minigame.current_room, x, y),
										)
									"
									:game_object="
										getCurrentBlock(player.minigame.current_room, x, y)
									"
								></MiniGameTD>
							</template>

							<td
								v-else
								style="
									background-image: url('/plot_image/NumerorumColor.png');
									background-size: cover;
									border: 1px solid gold;
								"
							></td>
						</template>
					</tr>
				</template>
				<!-- <tr>
                    <MiniGameTD :game_object="getCurrentBlock(getPlayerCurrentMap(), player.minigame.current_x-1,player.minigame.current_y-1)"></MiniGameTD>
                    <MiniGameTD :game_object="getCurrentBlock(getPlayerCurrentMap(), player.minigame.current_x,player.minigame.current_y-1)"></MiniGameTD>
                    <MiniGameTD :game_object="getCurrentBlock(getPlayerCurrentMap(), player.minigame.current_x+1,player.minigame.current_y-1)"></MiniGameTD>
                    
                </tr>
                <tr>
                    <MiniGameTD :game_object="getCurrentBlock(getPlayerCurrentMap(), player.minigame.current_x-1,player.minigame.current_y)"></MiniGameTD>
                    
                    <td>Player</td>
                    <MiniGameTD :game_object="getCurrentBlock(getPlayerCurrentMap(), player.minigame.current_x+1,player.minigame.current_y)"></MiniGameTD>
                    
                </tr>
                <tr>
                    <MiniGameTD :game_object="getCurrentBlock(getPlayerCurrentMap(), player.minigame.current_x-1,player.minigame.current_y+1)"></MiniGameTD>
                    <MiniGameTD :game_object="getCurrentBlock(getPlayerCurrentMap(), player.minigame.current_x,player.minigame.current_y+1)"></MiniGameTD>
                    <MiniGameTD :game_object="getCurrentBlock(getPlayerCurrentMap(), player.minigame.current_x+1,player.minigame.current_y+1)"></MiniGameTD>
                    
                </tr> -->
			</tbody>
		</table>
		<div v-if="temp.dungeonsSP == 1 || temp.innerWidth >= 800">
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
table {
	margin: auto;
}
tr {
	height: 60px;

	&:empty {
		display: none;
	}
}
td {
	height: 60px;
	width: 60px;
	background-color: var(--background-color);
	border: 1px solid red;
}
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
