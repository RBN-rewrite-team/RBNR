<script setup lang="ts">
import { BoxGameObject, WallGameObject, type GameObject } from '@/core/minigame/game-object';

const props = defineProps<{
    game_object: GameObject|null|undefined
}>()
</script>

<template>
    <template v-if="game_object !== null && game_object !== undefined">
        <template v-if=" (game_object instanceof WallGameObject)  ">
            <td style="background-color: var(--color)">
                墙    
            </td>
        </template>
        <template v-else-if=" (game_object instanceof BoxGameObject)  ">
            <td class="box-object">
                宝箱    
            </td>
        </template>
        <template v-else>
            <td>Object Non-Existence</td>
        </template>
    </template>
    <template v-else-if="game_object === undefined"><td>
        ?
    </td></template>
    <template v-else-if="game_object === null"><td>
    </td></template>
    
</template>

<style lang="scss" scoped>
table{margin: auto;}
tr{
    height: 60px;
}
.box-object{
    background-color: gold;
}
td{ 
    height: 60px;
    width: 60px; 
    font-size: smaller;
}
</style>