<script setup lang="ts">
import { temp, inPathData } from '@/core/temp-data';
import { range } from '@/utils/algorithm';
import { player } from '@/core/save';
import { visibleBlocks, isPlayerVisible, removeReplaces, isTouched } from '@/core/minigame/room';
import { addReplace } from '@/core/minigame/replacement';
import {
	runBattleFast,
	meBattleInfo,
	calculateRequiredHpIncrease,
	calculateRequiredAtkIncrease,
} from '@/core/minigame/battle';
import { getCurrentBlock } from '@/core/minigame/block';
import { MoveableBoxGameObject, EntityGameObject } from '@/core/minigame/game-object';
import { playerSafe, playerToDestination } from '@/core/minigame/path-searcher';
import ModalService from '@/utils/Modal';
import MiniGameTD from './MiniGameTD.vue';
import { useI18n } from 'vue-i18n';
const $t = useI18n().t;
function clickBlock(room: number, x: bigint, y: bigint, block: ReturnType<typeof getCurrentBlock>) {
	console.log(room, x, y);
	let putedblock = false;
	if (isTouched(x, y)) {
		if (block instanceof MoveableBoxGameObject) {
			addReplace(room, x, y, '0', false);
			player.minigame.taking_box = true;
			temp.minigametip = $t('dung.moveablebox.pick');
		} else if (block === null && player.minigame.taking_box) {
			addReplace(room, x, y, 'BOX', false);
			temp.minigametip = $t('dung.moveablebox.put');
			player.minigame.taking_box = false;
			putedblock = true;
		} else if (block instanceof EntityGameObject) {
			// const guardinfo = block.getBattleInfo();
			// const battlestatus = runBattleFast(meBattleInfo(), guardinfo);
			// if (battlestatus.status == 'fail') {
			// 	const req = calculateRequiredHpIncrease(meBattleInfo(), guardinfo);
			// 	const req2 = calculateRequiredAtkIncrease(meBattleInfo(), guardinfo);
			// 	ModalService.show({
			// 		title: '是否继续战斗?',
			// 		get content() {
			// 			return `当前敌人你无法击败，按确定以继续战斗<br>附加信息: ${req.reason}；${req2.reason}`;
			// 		},
			// 		onConfirm() {
			// 			block.interact(x, y, 'other', $t);
			// 		},
			// 	});
			// }
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
			playerToDestination(x, y, $t)
				.then(function () {
					temp.minigametip = $t('dung.movement.complete');
				})
				.catch(function () {
					temp.minigametip = $t('dung.movement.unable');
				});
		}
	}
	putedblock = false;
}
</script>

<template>
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
								player.minigame.current_x !== x || player.minigame.current_y !== y
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
								:game_object="getCurrentBlock(player.minigame.current_room, x, y)"
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
								background-image: url('./plot_image/NumerorumColor.png');
								background-size: cover;
								border: 1px solid gold;
							"
						></td>
					</template>
				</tr>
			</template>
		</tbody>
	</table>
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
	transition-duration: 0s;
}
</style>
