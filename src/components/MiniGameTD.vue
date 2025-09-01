<script setup lang="ts">
import {
	BoxGameObject,
	DoorGameObject,
	EntityGameObject,
	GuardGameObject,
	HealthRecoveryGameObject,
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
    game_object: GameObject|null|undefined
}>()

function style() {
    if (props.game_object instanceof WallInvisibleGameObject) {
        return {
            border: "1px solid red"
        }
    }
    if (props.game_object instanceof WallGameObject) {
        return {
            'background-color': "var(--color)"
        }
    }
}
function class3() {
    if (props.game_object instanceof KeyGameObject || (props.game_object instanceof MoveableBoxGameObject) || (props.game_object instanceof SwitchGameObject) || (props.game_object instanceof PasswordGameObject) || (props.game_object instanceof DoorGameObject) || props.game_object instanceof GuardGameObject || props.game_object instanceof BoxGameObject) {
        return 'box-object'
    }
    if (props.game_object instanceof HealthRecoveryGameObject || props.game_object instanceof TeleporterGameObject || props.game_object instanceof OreGameObject) {
        return 'ore-object'
    }
}
</script>

<template>
    <td :class="class3()" :style="style()">
        <template v-if="game_object !== null && game_object !== undefined">
            <template v-if=" (game_object instanceof WallGameObject)  ">
            </template>
            <template v-else-if="game_object instanceof BoxGameObject">
                <td class="box-object" v-if="game_object.tier == 1" style="color: rgb(186, 110, 64)">
				    铜宝箱
			    </td>
                <td class="box-object" v-if="game_object.tier == 2" style="color: rgb(233, 233, 216)">
				    银宝箱
			    </td>
                <td class="box-object" v-if="game_object.tier == 3" style="color: rgb(218, 178, 115)">
				    金宝箱
			    </td>
            </template>
            <template v-else-if=" (game_object instanceof EntityGameObject)  ">
                {{ game_object.innerText=="" ? "守卫" : game_object.innerText }} <br>
                <span style="font-size: 10px" v-html="game_object.battleText()" />
            </template>
            <template v-else-if=" (game_object instanceof OreGameObject)  ">
                    矿石
            </template>
            <template v-else-if=" (game_object instanceof TeleporterGameObject)  ">
                    传送门
            </template>
            <template v-else-if=" (game_object instanceof HealthRecoveryGameObject)  ">
                    恢复血量+{{game_object.percent}}%
            </template>
            <template v-else-if=" (game_object instanceof DoorGameObject)  ">
                门
            </template>
            <template v-else-if=" (game_object instanceof SwitchGameObject)  ">
                {{ game_object.actived ? "开关：开": "开关：关" }}
            </template>
            <template v-else-if=" (game_object instanceof MoveableBoxGameObject)  ">
                箱子
            </template>
            <template v-else-if=" (game_object instanceof PasswordGameObject)  ">
                    密码门
            </template>
            <template v-else-if=" (game_object instanceof KeyGameObject)  ">
                    钥匙
            </template>
            <template v-else-if=" (game_object instanceof WallInvisibleGameObject)  ">
                    
            </template>
            <template v-else>
                {{ game_object.innerText=="" ? "不知道，反正是个游戏物体" : game_object.innerText  }}
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
td {
	height: 60px;
	width: 60px;
	font-size: smaller;
}
</style>
