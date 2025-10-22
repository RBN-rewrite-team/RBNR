<script setup lang="ts">
import { currentPlayerLV, getWorldLevel, LVpercent, nextLVxp } from '@/core/minigame';
import { meBattleInfo } from '@/core/minigame/battle';
import { player } from '@/core/save';
import { temp } from '@/core/temp-data';

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

function openCore() {
	temp.openingCore = !temp.openingCore;
	if (temp.openingCore && temp.coreViewEquipment !== null) {
		if (player.minigame.storeEquipments.length == 0) {
			if (player.minigame.coreEquipments.hea.length == 0) {
				if (player.minigame.coreEquipments.atk.length == 0) {
					if (player.minigame.coreEquipments.def.length == 0) {
						temp.openingCore = !temp.openingCore;
						return;
					}
					temp.coreViewEquipment = player.minigame.coreEquipments.def[0];
				}
				temp.coreViewEquipment = player.minigame.coreEquipments.atk[0];
			}
			temp.coreViewEquipment = player.minigame.coreEquipments.hea[0];
		}
		temp.coreViewEquipment = player.minigame.storeEquipments[0];
	}
}
</script>

<template>
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
				生命值：{{ meBattleInfo().hp.toFixed(1) }}/{{ meBattleInfo().hpMax.toFixed(1) }}({{
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
					<td>当前攻击力: {{ meBattleInfo().atk.toFixed(1) }}</td>
					<td>当前防御: {{ meBattleInfo().def.toFixed(1) }}</td>
				</tr>
				<tr>
					<td>
						当前LV: {{ currentPlayerLV().toFixed(0) }}<br />
						(世界等级: {{ getWorldLevel().toFixed(1) }})
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
						当前XP: {{ player.minigame.xp.toFixed(0) }}/{{ nextLVxp().toFixed(0) }}
					</td>
				</tr>
				<tr>
					<td>
						矿石收集：{{ player.minigame.ore_gets }}<br />(+{{
							player.minigame.ore_gets * 0.25
						}}%全局速度)
						<button
							class="clickable-button"
							@click="player.options.openOreEffect = !player.options.openOreEffect"
						>
							开启矿石效果: {{ player.options.openOreEffect ? '开' : '关' }}
						</button>
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
					<td>
						<button @click="spawn(0)">Dungeon 1</button><br />
						<button @click="spawn(1)" v-if="player.minigame.visited.includes(1)">
							Dungeon 2
						</button>
					</td>
					<td>
						<button @click="openCore()">
							核心(装备{{
								player.minigame.coreEquipments.hea.length +
								player.minigame.coreEquipments.atk.length +
								player.minigame.coreEquipments.def.length
							}}/3)</button
						><br />
						仓库装备：{{ player.minigame.storeEquipments.length }}/50<span
							style="color: cyan"
							>(不朽x{{
								player.minigame.storeEquipments.filter((item) => {
									return item.rarity >= 1.9;
								}).length
							}})</span
						>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss" scoped>
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
