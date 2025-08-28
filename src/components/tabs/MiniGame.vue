<script setup lang="ts">
import { keyboardEventListener } from '@/core/minigame';
import { player } from '@/core/save';
import ObjectNode from './developermode/ObjectNode';
import MiniGameTD from '../MiniGameTD.vue';
import { getCurrentBlock, getPlayerCurrentMap } from '@/core/minigame/room';
import { handleKeyPress } from '@/core/minigame/minigame-loop';
</script>

<template>

    <div class="main">
        <div style="margin: auto;">
            玩家Numerorum<br/>
            当前生命值: {{ player.minigame.hp }}<br/>
            当前攻击力: NaN(还没做)<br/>
            <br />
            描述：何意味。<br />
        </div>
        <input placeholder="按箭头在这里按" @keydown="keyboardEventListener">
        <button @click="handleKeyPress('up')">上</button>
        <button @click="handleKeyPress('down')">下</button>
        <button @click="handleKeyPress('left')">左</button>
        <button @click="handleKeyPress('right')">右</button>
        <table>
            <tbody>
                <tr>
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
                    
                </tr>
            </tbody>
        </table>
    </div>
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