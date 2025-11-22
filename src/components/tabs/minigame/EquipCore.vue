<script setup lang="ts">
import { temp } from '@/core/temp-data';
import { equipmentDisplay, type CoreEquipment } from '@/core/minigame';
import { player } from '@/core/save';
import { equipmentAttribute } from '@/core/minigame';
import { useI18n } from 'vue-i18n';
function equip(eq: CoreEquipment) {
	eq.equipped = true;
	player.minigame.coreEquipments[eq.position][0] = eq;
}

function unload(eq: CoreEquipment) {
	eq.equipped = false;
	player.minigame.coreEquipments[eq.position].splice(0, 1); // commit q changed `delete` to `splice`
}

function isEquipped(eq: CoreEquipment) {
	return eq.equipped ?? false;
}
function changeCoreView(eq: CoreEquipment) {
	temp.coreViewEquipment = eq;
}
const $t = useI18n().t;
function equipInformation() {
	if (!temp.coreViewEquipment) return '';
	const attr = equipmentAttribute(temp.coreViewEquipment);
	return $t('dung.core.info', {
		a: attr.realLevel.toFixed(1),
		b: (temp.coreViewEquipment.rarity ** 2 * 100).toFixed(1),
		c: attr.hea.toFixed(1),
		d: attr.atk.toFixed(1),
		e: attr.def.toFixed(1),
	});
	// return `真实等级{{
	// 	equipmentAttribute(temp.coreViewEquipment).realLevel.toFixed(1)
	// }}(稀有度加成{{ (temp.coreViewEquipment.rarity ** 2 * 100).toFixed(1) }}%)<br />
	// 生命值+{{ equipmentAttribute(temp.coreViewEquipment).hea.toFixed(1) }}<br />
	// 攻击力+{{ equipmentAttribute(temp.coreViewEquipment).atk.toFixed(1) }}<br />
	// 防御力+{{ equipmentAttribute(temp.coreViewEquipment).def.toFixed(1) }}<br />`;
}
</script>

<template>
	<div class="main">
		<div
			style="margin: auto; width: 400px; margin-top: 5px; border: 2px solid red"
			align="center"
		>
			{{ $t('dung.core.checkfor') }}
			<div
				style="height: 200px; width: 95%; border: 2px solid red; position: relative"
				:style="{ 'border-color': temp.coreViewColor() }"
			>
				<div v-if="temp.coreViewEquipment !== null">
					<span v-html="equipmentDisplay(temp.coreViewEquipment, $t)" />
					<span v-if="isEquipped(temp.coreViewEquipment)">{{
						$t('dung.core.equiped', {
							a: '',
						})
					}}</span>
					<br />
					<span v-html="equipInformation()"></span>
					<div style="position: absolute; bottom: 0; width: 100%; height: 50px">
						<div
							style="height: 40px; width: 25%; border: 2px solid red"
							v-if="!(temp.coreViewEquipment.equipped ?? false)"
							@click="equip(temp.coreViewEquipment)"
						>
							{{ $t('dung.core.equip') }}
						</div>
						<div
							style="height: 40px; width: 25%; border: 2px solid orange"
							v-else
							@click="unload(temp.coreViewEquipment)"
						>
							{{ $t('dung.core.unequip') }}
						</div>
					</div>
				</div>
			</div>
			<div style="height: 400px; width: 95%; border: 2px solid red; overflow: auto">
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
								{{
									$t('dung.core.equiped', {
										a: $t('dung.core.position.hea'),
									})
								}}<br /><span
									v-html="
										equipmentDisplay(player.minigame.coreEquipments.hea[0], $t)
									"
								/>
							</div>
							<div
								style="height: 50px; width: 100%; border: 2px solid var(--color)"
								v-else
							>
								{{
									$t('dung.core.notequiped', {
										a: $t('dung.core.position.hea'),
									})
								}}
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
								{{
									$t('dung.core.equiped', {
										a: $t('dung.core.position.atk'),
									})
								}}<br /><span
									v-html="
										equipmentDisplay(player.minigame.coreEquipments.atk[0], $t)
									"
								/>
							</div>
							<div
								style="height: 50px; width: 100%; border: 2px solid var(--color)"
								v-else
							>
								{{
									$t('dung.core.notequiped', {
										a: $t('dung.core.position.atk'),
									})
								}}
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
								{{
									$t('dung.core.equiped', {
										a: $t('dung.core.position.def'),
									})
								}}<br /><span
									v-html="
										equipmentDisplay(player.minigame.coreEquipments.def[0], $t)
									"
								/>
							</div>
							<div
								style="height: 50px; width: 100%; border: 2px solid var(--color)"
								v-else
							>
								{{
									$t('dung.core.notequiped', {
										a: $t('dung.core.position.def'),
									})
								}}
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
					<span v-html="equipmentDisplay(item, $t)" />
				</div>
			</div>
		</div>
	</div>
</template>
