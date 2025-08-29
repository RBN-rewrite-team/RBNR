<script setup lang="ts">
import { currentPlayerLV, nextLVxp, keyboardEventListener } from '@/core/minigame';
import { player } from '@/core/save';
import ObjectNode from './developermode/ObjectNode';
import MiniGameTD from '../MiniGameTD.vue';
import { getCurrentBlock, getPlayerCurrentMap } from '@/core/minigame/room';
import { handleKeyPress } from '@/core/minigame/minigame-loop';
import { meBattleInfo } from '@/core/minigame/battle';

function spawn(id: number): void {
	player.minigame.current_room = id, player.minigame.current_x = 1, player.minigame.current_y = 1;
}
</script>

<template>

    <div class="main">
        <input placeholder="按箭头在这里按" @keydown="keyboardEventListener">
        <button @click="handleKeyPress('up')">上</button>
        <button @click="handleKeyPress('down')">下</button>
        <button @click="handleKeyPress('left')">左</button>
        <button @click="handleKeyPress('right')">右</button>
        <table style="width: 500px; height: 500px">
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
        <div style="margin: auto; position: absolute; left: 0%; top: 0%; width: 400px; height: 200px; background-color: grey;">
            Numerorum<br/>
            <div style="position: relative; height: 50px; width: 400px; background-color: black">
				<div align="center" style="font-size: 17px">生命值：{{meBattleInfo().hp}}/{{meBattleInfo().hpMax}}({{Math.ceil(meBattleInfo().hp / meBattleInfo().hpMax * 100)}}%)</div>
				<div :style="{position: 'absolute', height: '25px', width: meBattleInfo().hp / meBattleInfo().hpMax * 400 + 'px', 'background-color': 'red'}"></div>
			</div>
            <table style="width: 100%">
			<tbody>
			<tr>
			<td>当前攻击力: {{ meBattleInfo().atk }}</td>
            <td>当前防御: {{ meBattleInfo().def }}</td>
			</tr>
			<tr>
			<td>当前LV: {{ currentPlayerLV() }}</td>
            <td :style="{'background-image': 'linear-gradient(to right, green ' + (player.minigame.xp / nextLVxp() * 100) + '%, black ' + (player.minigame.xp / nextLVxp() * 100) + '%)'}">当前XP: {{ player.minigame.xp }}/{{ nextLVxp() }}</td>
			</tr>
			</tbody>
			<tr>
			<td>矿石收集：{{player.minigame.ore_gets}}<br>(+{{player.minigame.ore_gets * 0.25}}%全局速度)</td>
			</tr>
			<tr>
			<td><button @click="spawn(0)">Dungeon 1</button></td>
			</tr>
			</table>
        </div>
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