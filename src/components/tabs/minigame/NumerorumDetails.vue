<script setup lang="ts">
import PrimaryButton from '@/components/ui/PrimaryButton';
import { currentPlayerLV, getWorldLevel, LVpercent, nextLVxp } from '@/core/minigame';
import { meBattleInfo } from '@/core/minigame/battle';
import { player } from '@/core/save';
import { temp } from '@/core/temp-data';

function spawn(id: number): void {
	player.minigame.current_room = id;
	player.minigame.current_x = 1n;
	player.minigame.current_y = 1n;
	player.minigame.hp = meBattleInfo().hpMax;
	if (!player.minigame.visited.includes(id)) player.minigame.visited.push(id);
	player.minigame.interact = 1003;
	for (const k in player.minigame.replaces) {
		const repl = player.minigame.replaces[k];
		for (const i in repl)
			if (player.minigame.replaces[k][i].recover) delete player.minigame.replaces[k][i];
	}
	setTimeout(() => {
		if (player.minigame.interact == 1003) player.minigame.interact = 0;
	}, 200);
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

<!-- v-if="temp.dungeonsSP == 0 || temp.innerWidth >= 800" -->
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
	>
		Numerorum<br />
		<div style="position: relative; height: 50px; width: 400px; background-color: black">
			<div align="center" style="font-size: 17px; color: white">
				{{ $t('dung.hp') }}{{ meBattleInfo().hp.toFixed(1) }}/{{
					meBattleInfo().hpMax.toFixed(1)
				}}({{ Math.ceil((meBattleInfo().hp / meBattleInfo().hpMax) * 100) }}%)
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
					<td>{{ $t('dung.atk') }}{{ meBattleInfo().atk.toFixed(1) }}</td>
					<td>{{ $t('dung.def') }}{{ meBattleInfo().def.toFixed(1) }}</td>
				</tr>
				<tr>
					<td>
						{{ $t('dung.lv') }}{{ currentPlayerLV().toFixed(0) }}<br />
						{{
							$t('dung.wlv', {
								lv: getWorldLevel().toFixed(1),
							})
						}}
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
						{{ $t('dung.xp') }}{{ player.minigame.xp.toFixed(0) }}/{{
							nextLVxp().toFixed(0)
						}}
					</td>
				</tr>
				<tr style="height: 100px">
					<td>
						{{ $t('dung.ore') }}{{ player.minigame.ore_gets }}<br />{{
							$t('dung.ore.1', {
								effect: player.minigame.ore_gets * 0.25,
							})
						}}
					</td>
					<td>
						<PrimaryButton
							@click="player.options.openOreEffect = !player.options.openOreEffect"
							:style="{
								fontSize: '8px',
							}"
						>
							{{
								$t('set.status', {
									label: $t('dung.ore.2'),
									status: $t(
										player.options.openOreEffect
											? 'set.status.on'
											: 'set.status.off',
									),
								})
							}}
						</PrimaryButton>
					</td>
				</tr>
				<tr>
					<td>
						{{ $t('dung.boxes.collect')
						}}<span
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
					<td>
						<PrimaryButton @click="spawn(0)">Dungeon 1</PrimaryButton><br />
						<PrimaryButton @click="spawn(1)" v-if="player.minigame.visited.includes(1)">
							Dungeon 2
						</PrimaryButton>
					</td>
				</tr>
				<tr>
					<td>
						{{ $t('dung.core') }}({{ $t('dung.core.equip')
						}}{{
							player.minigame.coreEquipments.hea.length +
							player.minigame.coreEquipments.atk.length +
							player.minigame.coreEquipments.def.length
						}}/3)<br /><br />
						{{ $t('dung.core.storeequipments') }}<br />{{
							player.minigame.storeEquipments.length
						}}/50<span style="color: cyan"
							>({{ $t('dung.core.levels.5') }}x{{
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
