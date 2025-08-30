<script setup lang="ts">
import {
	currentPlayerLV,
	nextLVxp,
	hardResetMiniGame,
	keyboardEventListener,
} from '@/core/minigame';
import { player } from '@/core/save';
import ObjectNode from './developermode/ObjectNode';
import MiniGameTD from '../MiniGameTD.vue';
import {
	getCurrentBlock,
	getPlayerMap,
	getPlayerCurrentMap,
	isPlayerVisible,
	visibleBlocks,
	isTouched,
	addReplace,
} from '@/core/minigame/room';
import { handleKeyPress } from '@/core/minigame/minigame-loop';
import { meBattleInfo } from '@/core/minigame/battle';
import { range } from '@/utils/algorithm';
import { temp } from '../../core/temp-data';
import { format } from '@/utils/format';
import { MoveableBoxGameObject } from '@/core/minigame/game-object';

function spawn(id: number): void {
	((player.minigame.current_room = id),
		(player.minigame.current_x = 1n),
		(player.minigame.current_y = 1n));
	player.minigame.hp = meBattleInfo().hpMax;
	for (let k in player.minigame.replaces) {
		let repl = player.minigame.replaces[k]
		for(let i in repl) if(player.minigame.replaces[k][i].recover) delete player.minigame.replaces[k][i];

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
	if (isTouched(x,y) ) {
		if (block instanceof MoveableBoxGameObject){
			addReplace(
				room,x,y,'0',false
			)
			player.minigame.taking_box=true;
			temp.minigametip="已拿起箱子（只能在玩家上下左右1格放下箱子）"
		} else if (block===null){
			addReplace(
				room,x,y,'BOX',false
			)
			temp.minigametip="已放下箱子"
		}
	}
}
function atDEV() {
	return import.meta.env.DEV
}
</script>

<template>
	<div class="main">
		<div style="width: 400px; height: 200px; background-color: grey">
			Numerorum<br />
			<div style="position: relative; height: 50px; width: 400px; background-color: black">
				<div align="center" style="font-size: 17px">
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
			<button v-if="atDEV()">Enter Editor Mode</button>
			<table style="width: 100%">
				<tbody>
					<tr>
						<td>当前攻击力: {{ meBattleInfo().atk }}</td>
						<td>当前防御: {{ meBattleInfo().def }}</td>
					</tr>
					<tr>
						<td>当前LV: {{ currentPlayerLV() }}</td>
						<td
							:style="{
								'background-image':
									'linear-gradient(to right, green ' +
									(player.minigame.xp / nextLVxp()) * 100 +
									'%, black ' +
									(player.minigame.xp / nextLVxp()) * 100 +
									'%)',
							}"
						>
							当前XP: {{ player.minigame.xp }}/{{ nextLVxp() }}
						</td>
					</tr>
				</tbody>
				<tr>
					<td>
						矿石收集：{{ player.minigame.ore_gets }}<br />(+{{
							player.minigame.ore_gets * 0.25
						}}%全局速度)
					</td>
					<td>
						宝箱收集：<span
						style="color: rgb(186, 110, 64)" v-html="player.minigame.box_gets[0]" />/<span
						style="color: rgb(233, 233, 216)" v-html="player.minigame.box_gets[1]" />/<span
						style="color: rgb(218, 178, 115)" v-html="player.minigame.box_gets[2]" />
					</td>
				</tr>
				<tr>
					<td><button @click="spawn(0)">Dungeon 1</button></td>
				</tr>
			</table>
		</div>
		<br />
		<div style="display: flex; flex-direction: row; justify-content: center">
			<button @click="handleKeyPress('up')" class="clickable_button">↑</button>
			<button @click="handleKeyPress('down')" class="clickable_button">↓</button>
			<button @click="handleKeyPress('left')" class="clickable_button">←</button>
			<button @click="handleKeyPress('right')" class="clickable_button">→</button>
		</div>
		<div>
			X: {{ formatbigint(player.minigame.current_x) }}<br />
			Y: {{ formatbigint(player.minigame.current_y) }}
			<br />
			{{ temp.minigametip }}
		</div>
		<br />
		<table>
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
									@click="clickBlock(player.minigame.current_room, x, y, getCurrentBlock(player.minigame.current_room, x, y))"
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
</style>
