<script setup lang="ts">
import {
	BoxGameObject,
	DoorGameObject,
	EntityGameObject,
	GuardGameObject,
	HealthRecoveryGameObject,
	HighPlaceClimbGameObject,
	HighPlaceGameObject,
	KeyGameObject,
	MoveableBoxGameObject,
	OreGameObject,
	PasswordGameObject,
	SwitchGameObject,
	TeleporterGameObject,
	WallGameObject,
	WallInvisibleGameObject,
	type GameObject,
} from '@/core/minigame/game-object';

const props = defineProps<{
	game_object: GameObject | null | undefined;
}>();

function style() {
	if (props.game_object instanceof WallInvisibleGameObject) {
		return {
			border: '1px solid red',
		};
	}
	if (props.game_object instanceof WallGameObject) {
		return {
			'background-color': 'var(--color)',
		};
	}
}
function class3() {
	if (
		props.game_object instanceof KeyGameObject ||
		props.game_object instanceof MoveableBoxGameObject ||
		props.game_object instanceof SwitchGameObject ||
		props.game_object instanceof PasswordGameObject ||
		props.game_object instanceof DoorGameObject ||
		props.game_object instanceof GuardGameObject ||
		props.game_object instanceof BoxGameObject
	) {
		return 'box-object';
	}
	if (
		props.game_object instanceof HealthRecoveryGameObject ||
		props.game_object instanceof TeleporterGameObject ||
		props.game_object instanceof OreGameObject
	) {
		return 'ore-object';
	}
	if (
		props.game_object instanceof HighPlaceClimbGameObject ||
		props.game_object instanceof HighPlaceGameObject
	)
		return 'highplace';
}
</script>

<template>
	<td :class="class3()" :style="style()">
		<template v-if="game_object !== null && game_object !== undefined">
			<template v-if="game_object instanceof WallGameObject"> </template>
			<template v-else-if="game_object instanceof BoxGameObject">
				<td
					class="box-object"
					v-if="game_object.tier == 1"
					style="color: rgb(186, 110, 64)"
				>
					{{ $t('dung.boxes.0') }}
				</td>
				<td
					class="box-object"
					v-if="game_object.tier == 2"
					style="color: rgb(233, 233, 216)"
				>
					{{ $t('dung.boxes.1') }}
				</td>
				<td
					class="box-object"
					v-if="game_object.tier == 3"
					style="color: rgb(218, 178, 115)"
				>
					{{ $t('dung.boxes.2') }}
				</td>
			</template>
			<template v-else-if="game_object instanceof EntityGameObject">
				{{ game_object.innerText == '' ? $t('dung.guard') : game_object.innerText }} <br />
				<span style="font-size: 10px" v-html="game_object.battleText($t)" />
			</template>
			<template v-else-if="game_object instanceof HighPlaceClimbGameObject" class="highplace"
				>↑</template
			>
			<template v-else-if="game_object instanceof HighPlaceGameObject"></template>
			<template v-else-if="game_object instanceof OreGameObject">
				{{ $t('dung.ore.3') }}
			</template>
			<template v-else-if="game_object instanceof TeleporterGameObject">
				{{ $t('dung.teleport') }}
			</template>
			<template v-else-if="game_object instanceof HealthRecoveryGameObject">
				{{
					$t('dung.healthrec', {
						percent: game_object.percent,
					})
				}}
			</template>
			<template v-else-if="game_object instanceof DoorGameObject">
				{{ $t('dung.door') }}
			</template>
			<template v-else-if="game_object instanceof SwitchGameObject">
				{{
					$t('dung.switch', {
						status: $t(game_object.actived ? 'set.status.on' : 'set.status.off'),
					})
				}}
			</template>
			<template v-else-if="game_object instanceof MoveableBoxGameObject">
				{{ $t('dung.moveablebox') }}
			</template>
			<template v-else-if="game_object instanceof PasswordGameObject">
				{{ $t('dung.pwddoor') }}
			</template>
			<template v-else-if="game_object instanceof KeyGameObject">
				{{ $t('dung.key') }}
			</template>
			<template v-else-if="game_object instanceof WallInvisibleGameObject"> </template>
			<template v-else>
				{{
					game_object.innerText == ''
						? "This object's display is lost"
						: game_object.innerText
				}}
			</template>
		</template>
		<template v-else-if="game_object === undefined">?</template>
	</td>
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
.highplace {
	background-color: grey;
}
td {
	height: 60px;
	width: 60px;
	min-height: 60px;
	min-width: 60px;
	font-size: smaller;
}
</style>
