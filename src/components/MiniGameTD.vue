<script setup lang="ts">
import {
	BoxGameObject,
	DoorGameObject,
	GuardGameObject,
	HealthRecoveryGameObject,
	KeyGameObject,
	OreGameObject,
	PasswordGameObject,
	TeleporterGameObject,
	WallGameObject,
	WallInvisibleGameObject,
	type GameObject,
} from '@/core/minigame/game-object';

const props = defineProps<{
	game_object: GameObject | null | undefined;
}>();
</script>

<template>
	<template v-if="game_object !== null && game_object !== undefined">
		<template v-if="game_object instanceof WallGameObject">
			<td style="background-color: var(--color)"></td>
		</template>
		<template v-else-if="game_object instanceof BoxGameObject">
			<td class="box-object" v-if="game_object.tier == 1" style="color: rgb(186, 110, 64)">
				铜宝箱
			</td>
		</template>
		<template v-else-if="game_object instanceof GuardGameObject">
			<td class="box-object">
				{{ game_object.innerText == '' ? '守卫' : game_object.innerText }}
			</td>
		</template>
		<template v-else-if="game_object instanceof OreGameObject">
			<td class="ore-object">矿石</td>
		</template>
		<template v-else-if="game_object instanceof TeleporterGameObject">
			<td class="ore-object">传送门</td>
		</template>
		<template v-else-if="game_object instanceof HealthRecoveryGameObject">
			<td class="ore-object">恢复血量+{{ game_object.percent }}%</td>
		</template>
		<template v-else-if="game_object instanceof DoorGameObject">
			<td class="box-object">门</td>
		</template>
		<template v-else-if="game_object instanceof PasswordGameObject">
			<td class="box-object">密码门</td>
		</template>
		<template v-else-if="game_object instanceof KeyGameObject">
			<td class="box-object">钥匙</td>
		</template>
		<template v-else-if="game_object instanceof WallInvisibleGameObject"
			><td style="border: 1px solid red"></td
		></template>
		<template v-else>
			<td>
				{{
					game_object.innerText == '' ? '不知道，反正是个游戏物体' : game_object.innerText
				}}
			</td>
		</template>
	</template>
	<template v-else-if="game_object === undefined"><td>?</td></template>
	<template v-else-if="game_object === null"><td></td></template>
</template>

<style lang="scss" scoped>
table {
	margin: auto;
}
tr {
	height: 60px;
}
.box-object {
	background-color: gold;
	color: var(--background-color);
}
.ore-object {
	background-color: rgb(0, 81, 255);
	color: var(--background-color);
}
td {
	height: 60px;
	width: 60px;
	font-size: smaller;
}
</style>
