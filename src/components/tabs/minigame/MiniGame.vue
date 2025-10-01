<script setup lang="ts">
import {
	currentPlayerLV,
	nextLVxp,
	hardResetMiniGame,
	keyboardEventListener,
	getWorldLevel,
	LVpercent,
	equipmentDisplay,
	equipmentAttribute,
	type CoreEquipment,
} from '@/core/minigame';
import { player } from '@/core/save';
import MiniGameTD from './MiniGameTD.vue';
import {
	isPlayerVisible,
	visibleBlocks,
	isTouched,
	removeReplaces,
	initializeEditorMap,
} from '@/core/minigame/room';
import { addReplace } from '@/core/minigame/replacement';
import { getCurrentBlock } from '@/core/minigame/block';
import { handleKeyPress } from '@/core/minigame/minigame-loop';
import {
	calculateRequiredAtkIncrease,
	calculateRequiredHpIncrease,
	guardBattleInfo,
	meBattleInfo,
	runBattleFast,
} from '@/core/minigame/battle';
import { range } from '@/utils/algorithm';
import { inPathData, temp } from '../../../core/temp-data';
import { format } from '@/utils/format';
import {
	EntityGameObject,
	GuardGameObject,
	MoveableBoxGameObject,
} from '@/core/minigame/game-object';
import ModalService from '@/utils/Modal';
import SkillTree from '../minigame/SkillTree.vue';
import { playerSafe, playerToDestination } from '@/core/minigame/path-searcher';
import MobileTable from './mobileTable.vue';
import NumerorumDetails from './NumerorumDetails.vue';

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
	console.log(room, x, y);
	let putedblock = false;
	if (isTouched(x, y)) {
		if (block instanceof MoveableBoxGameObject) {
			addReplace(room, x, y, '0', false);
			player.minigame.taking_box = true;
			temp.minigametip = '已拿起箱子（只能在玩家上下左右1格放下箱子）';
		} else if (block === null && player.minigame.taking_box) {
			addReplace(room, x, y, 'BOX', false);
			temp.minigametip = '已放下箱子';
			player.minigame.taking_box = false;
			putedblock = true;
		} else if (block instanceof EntityGameObject) {
			let guardinfo = block.getBattleInfo();
			let battlestatus = runBattleFast(meBattleInfo(), guardinfo);
			if (battlestatus.status == 'fail') {
				let req = calculateRequiredHpIncrease(meBattleInfo(), guardinfo);
				let req2 = calculateRequiredAtkIncrease(meBattleInfo(), guardinfo);
				ModalService.show({
					title: '是否继续战斗?',
					get content() {
						return `当前敌人你无法击败，按确定以继续战斗<br>附加信息: ${req.reason}；${req2.reason}`;
					},
					onConfirm() {
						block.interact(x, y);
					},
				});
			}
			return;
		}
	}
	console.log(!putedblock);
	if (player.minigame.ateditor) {
		// ModalService.show({content: "拜谢"})

		if (player.minigame.editor_mode == 'replace') {
			removeReplaces(room, x, y);
			addReplace(room, x, y, player.minigame.block, false);
		}
		if (player.minigame.editor_mode == 'remove') {
			removeReplaces(room, x, y);
		}
	} else if (!putedblock) {
		console.log(room, x, y);
		if (playerSafe(block)) {
			playerToDestination(x, y)
				.then(function () {
					temp.minigametip = '移动完成';
				})
				.catch(function () {
					temp.minigametip = '无法移动';
				});
		}
	}
	putedblock = false;
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
function changeCoreView(eq: CoreEquipment) {
	temp.coreViewEquipment = eq;
}

function equip(eq: CoreEquipment) {
	eq.equipped = true;
	player.minigame.coreEquipments[eq.position][0] = eq;
}

function unload(eq: CoreEquipment) {
	eq.equipped = false;
	delete player.minigame.coreEquipments[eq.position][0];
}

function isEquipped(eq: CoreEquipment) {
	return eq.equipped ?? false;
}
</script>

<template>
	<div class="main">
		<MobileTable />
		<NumerorumDetails />
		<br />
		<div
			style="
				position: absolute;
				right: 0px;
				top: 50px;
				height: 80%;
				width: 400px;
				z-index: 5;
				border: 2px solid red;
			"
			align="center"
			v-if="(temp.dungeonsSP == 2 || temp.innerWidth >= 800) && temp.openingCore"
		>
			核心(点击查看信息)
			<div
				style="height: 40%; width: 95%; border: 2px solid red; position: relative"
				:style="{ 'border-color': temp.coreViewColor() }"
			>
				<div v-if="temp.coreViewEquipment !== null">
					<span v-html="equipmentDisplay(temp.coreViewEquipment)" />
					<span v-if="isEquipped(temp.coreViewEquipment)">(已装备)</span>
					<br />
					真实等级{{
						equipmentAttribute(temp.coreViewEquipment).realLevel.toFixed(1)
					}}(稀有度加成{{ (temp.coreViewEquipment.rarity ** 2 * 100).toFixed(1) }}%)<br />
					生命值+{{ equipmentAttribute(temp.coreViewEquipment).hea.toFixed(1) }}<br />
					攻击力+{{ equipmentAttribute(temp.coreViewEquipment).atk.toFixed(1) }}<br />
					防御力+{{ equipmentAttribute(temp.coreViewEquipment).def.toFixed(1) }}<br />
					<div style="position: absolute; bottom: 0; width: 100%; height: 50px">
						<div
							style="height: 40px; width: 25%; border: 2px solid red"
							v-if="!(temp.coreViewEquipment.equipped ?? false)"
							@click="equip(temp.coreViewEquipment)"
						>
							装备
						</div>
						<div
							style="height: 40px; width: 25%; border: 2px solid orange"
							v-else
							@click="unload(temp.coreViewEquipment)"
						>
							取消装备
						</div>
					</div>
				</div>
			</div>
			<div style="height: 50%; width: 95%; border: 2px solid red; overflow: auto">
				<table>
					<tbody>
						<td style="width: 30%; border: 0px solid red">
							<div
								v-if="player.minigame.coreEquipments.hea.length > 0"
								style="height: 50px; width: 100%; border: 2px solid red"
								:style="{
									'border-color': temp.coreViewColor(
										player.minigame.coreEquipments.hea[0],
									),
								}"
								@click="changeCoreView(player.minigame.coreEquipments.hea[0])"
							>
								装备的支持部<br /><span
									v-html="equipmentDisplay(player.minigame.coreEquipments.hea[0])"
								/>
							</div>
							<div
								style="height: 50px; width: 100%; border: 2px solid var(--color)"
								v-else
							>
								未装备支持部
							</div>
						</td>
						<td style="width: 30%; border: 0px solid red">
							<div
								v-if="player.minigame.coreEquipments.atk.length > 0"
								style="height: 50px; width: 100%; border: 2px solid red"
								:style="{
									'border-color': temp.coreViewColor(
										player.minigame.coreEquipments.atk[0],
									),
								}"
								@click="changeCoreView(player.minigame.coreEquipments.atk[0])"
							>
								装备的打击部<br /><span
									v-html="equipmentDisplay(player.minigame.coreEquipments.atk[0])"
								/>
							</div>
							<div
								style="height: 50px; width: 100%; border: 2px solid var(--color)"
								v-else
							>
								未装备打击部
							</div>
						</td>
						<td style="width: 30%; border: 0px solid red">
							<div
								v-if="player.minigame.coreEquipments.def.length > 0"
								style="height: 50px; width: 100%; border: 2px solid red"
								:style="{
									'border-color': temp.coreViewColor(
										player.minigame.coreEquipments.def[0],
									),
								}"
								@click="changeCoreView(player.minigame.coreEquipments.def[0])"
							>
								装备的防御部<br /><span
									v-html="equipmentDisplay(player.minigame.coreEquipments.def[0])"
								/>
							</div>
							<div
								style="height: 50px; width: 100%; border: 2px solid var(--color)"
								v-else
							>
								未装备防御部
							</div>
						</td>
					</tbody>
				</table>

				<div
					style="
						display: inline-block;
						width: calc(90% / 3 - 20px);
						margin: 10px;
						border: 2px solid red;
					"
					v-for="(item, index) in player.minigame.storeEquipments.sort(function (a, b) {
						return -a.level * a.rarity ** 2 + b.level * b.rarity ** 2;
					})"
					:key="index"
					:style="{ 'border-color': temp.coreViewColor(item) }"
					@click="changeCoreView(item)"
				>
					<span v-html="equipmentDisplay(item)" />
				</div>
			</div>
		</div>
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
		<table
			:style="{
				position: 'absolute',
				left: temp.dungeonsSP == 2 && temp.innerWidth < 800 ? '25%' : '75%',
				top: temp.dungeonsSP == 2 && temp.innerWidth < 800 ? '25%' : '50%',
				transform: 'translate(-50%, -50%)',
				'z-index': '5',
			}"
			v-if="(temp.dungeonsSP == 2 || temp.innerWidth >= 800) && !temp.openingCore"
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
									v-if="isPlayerVisible(x, y) && !inPathData(x, y)"
									@mousedown="
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
								<td
									v-else-if="inPathData(x, y)"
									style="
										background-color: green;
										height: 60px;
										width: 60px;
										min-height: 60px;
										min-width: 60px;
									"
								></td>
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
