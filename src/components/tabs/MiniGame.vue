<script setup lang="ts">
import { currentPlayerLV, hardResetMiniGame, keyboardEventListener } from '@/core/minigame';
import { player } from '@/core/save';
import ObjectNode from './developermode/ObjectNode';
import MiniGameTD from '../MiniGameTD.vue';
import { getCurrentBlock, getPlayerMap, isPlayerVisible } from '@/core/minigame/room';
import { handleKeyPress } from '@/core/minigame/minigame-loop';
import { meBattleInfo } from '@/core/minigame/battle';
</script>

<template>

    <div class="main">
        <div style="margin: auto;">
            玩家Numerorum<br/>
            当前生命值: {{ player.minigame.hp.toFixed(1) }}<br/>
            当前攻击力: {{ meBattleInfo().atk.toFixed(1) }}<br/>
            当前防御: {{ meBattleInfo().def.toFixed(1) }}<br/>
            当前LV: {{ currentPlayerLV() }}<br/>
            当前XP: {{ player.minigame.xp.toFixed(1) }}<br/>
            
            
            <br />
            描述：没做。<br />
        </div>
        <div style="display: flex; flex-direction: row; justify-content: center">
          <button @click="handleKeyPress('up')" class="clickable_button">↑</button>
          <button @click="handleKeyPress('down')" class="clickable_button">↓</button>
          <button @click="handleKeyPress('left')" class="clickable_button">←</button>
          <button @click="handleKeyPress('right')" class="clickable_button">→</button>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: center">
          <button @click="hardResetMiniGame" class="clickable_button">复位</button>
        </div>
        <br />
        <table>
            <tbody>
                <template v-for="row, y in getPlayerMap(player.minigame.current_room).map">
                    <tr>
                        <template v-for="block, x in row">
                            <template v-if="player.minigame.current_x!==x || player.minigame.current_y!==y">
                                <MiniGameTD v-if="isPlayerVisible(x, y)":game_object="block"></MiniGameTD>
                            </template>
                            
                            <td v-else style="background-image: url('/plot_image/NumerorumColor.png'); background-size: cover;"></td>
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
table{margin: auto;}
tr{
    height: 60px;
    
    &:empty {
        display: none
    }
}
td{ 
    height: 60px;
    width: 60px; 
    background-color: var(--background-color);
    border: 1px solid red;
}
</style>