<script setup lang="ts">
import { WallGameObject, type GameObject } from '@/core/minigame/game-object';

const props = defineProps<{
    game_object: GameObject|null|undefined
}>()
</script>

<template>
    <template v-if="game_object !== null && game_object !== undefined">
        <template v-if=" (game_object instanceof WallGameObject)  ">
            <td>
                墙    
            </td>
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
td{ 
    height: 60px;
    width: 60px; 
    background-color: var(--background-color);
    border: 1px solid red;
}
</style>