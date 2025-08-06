<script setup lang="ts">
import {player, feature} from '@/core/global';

function showChapter(id = 0): boolean {
	if(player.stat.chapter >= id) return false;
	if(player.stat.chapter < id - 1.000001) return false;
	
	if(id === 0) return player.singularity.t >= 675 || player.number.gt(0);
	if(id === 1) return player.singularity.t >= 675 || player.addpower.gt(0);
	if(id === 2) return player.singularity.t >= 675 || player.multiplication.mulpower.gt(0);
	if(id === 3) return player.singularity.t >= 675 || player.exponention.exppower.gt(0);
	if(id === 4) return player.singularity.t >= 675;
	return;
}
</script>

<template>
	<div v-if="showChapter(0)">
		<div class="chapter_background" style="color: var(--suptitle-color)">
			0
		</div>
		<div class="chapter_clickable" style="color: var(--suptitle-color); background-color: var(--title-color)"
		onclick="player.stat.chapter = Math.max(player.stat.chapter, 0)">
			众里寻数
		</div>
		<div class="chapter_text" style="color: var(--title-color)">
			序章
		</div>
		<div class="chapter_text_b" style="color: var(--title-color)">
			后继
		</div>
	</div>
	
	<div v-if="showChapter(1)">
		<div class="chapter_background" style="color: #009dd9">
			+
		</div>
		<div class="chapter_clickable" style="color: #009dd9; background-color: #5acaff"
		onclick="player.stat.chapter = Math.max(player.stat.chapter, 1)">
			嗜数成癖
		</div>
		<div class="chapter_text" style="color: #5acaff">
			第一章
		</div>
		<div class="chapter_text_b" style="color: #5acaff">
			加法
		</div>
	</div>
	
	<div v-if="showChapter(2)">
		<div class="chapter_background" style="color: #cc33ff">
			×
		</div>
		<div class="chapter_clickable" style="color: #cc33ff; background-color: #dd77dd"
		onclick="player.stat.chapter = Math.max(player.stat.chapter, 2)">
			知难而上
		</div>
		<div class="chapter_text" style="color: #dd77dd">
			第二章
		</div>
		<div class="chapter_text_b" style="color: #dd77dd">
			乘法
		</div>
	</div>
	
	<div v-if="showChapter(3)">
		<div class="chapter_background" style="color: rgb(127, 127, 255)">
			↑
		</div>
		<div class="chapter_clickable" style="color: rgb(127, 127, 255); background-color: rgb(63, 63, 127)"
		onclick="player.stat.chapter = Math.max(player.stat.chapter, 3)">
			步履维艰
		</div>
		<div class="chapter_text" style="color: rgb(63, 63, 127)">
			第三章
		</div>
		<div class="chapter_text_b" style="color: rgb(63, 63, 127)">
			指数
		</div>
	</div>
	
	<div v-if="showChapter(4)">
		<div class="chapter_background" style="color: rgb(255, 63, 63)">
			ω
		</div>
		<div class="chapter_clickable" style="color: rgb(255, 63, 63); background-color: rgb(255, 127, 127)"
		onclick="player.stat.chapter = Math.max(player.stat.chapter, 4)">
			超越无限
		</div>
		<div class="chapter_text" style="color: rgb(255, 127, 127)">
			第四章
		</div>
		<div class="chapter_text_b" style="color: rgb(255, 127, 127)">
			序数
		</div>
	</div>
</template>