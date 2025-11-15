<script setup lang="ts">
import { player } from '@/core/global';

function showChapter(id = 0): boolean {
	if (player.stat.chapter >= id) return false;
	if (player.stat.chapter < id - 1.000001) return false;

	if (id === 0) return player.singularity.t >= 675 || player.number.gt(0);
	if (id === 1) return player.singularity.t >= 675 || player.addpower.gt(0);
	if (id === 2) return player.singularity.t >= 675 || player.multiplication.mulpower.gt(0);
	if (id === 3) return player.singularity.t >= 675 || player.exponention.exppower.gt(0);
	if (id === 4) return player.singularity.t >= 675;
	if (id === 5) return player.upgrades['517'];
	if (id === 6) return player.nonrecu.power.gt(0);
	return false;
}
</script>

<template>
	<div v-if="showChapter(0)">
		<div class="chapter_background" style="color: var(--suptitle-color)">0</div>
		<div
			class="chapter_clickable"
			style="color: var(--suptitle-color); background-color: var(--title-color)"
			@click="player.stat.chapter = Math.max(player.stat.chapter, 0)"
		>
			{{ $t('chap.0.text') }}
		</div>
		<div class="chapter_text" style="color: var(--title-color)">
			{{ $t('chap.0.title') }}
		</div>
		<div class="chapter_text_b" style="color: var(--title-color)">
			{{ $t('chap.0.text1') }}
		</div>
	</div>

	<div v-if="showChapter(1)">
		<div class="chapter_background" style="color: #009dd9">+</div>
		<div
			class="chapter_clickable"
			style="color: #009dd9; background-color: #5acaff"
			@click="player.stat.chapter = Math.max(player.stat.chapter, 1)"
		>
			{{ $t('chap.1.text') }}
		</div>
		<div class="chapter_text" style="color: #5acaff">
			{{ $t('chap.1.title') }}
		</div>
		<div class="chapter_text_b" style="color: #5acaff">
			{{ $t('chap.1.text1') }}
		</div>
	</div>

	<div v-if="showChapter(2)">
		<div class="chapter_background" style="color: #cc33ff">×</div>
		<div
			class="chapter_clickable"
			style="color: #cc33ff; background-color: #dd77dd"
			@click="player.stat.chapter = Math.max(player.stat.chapter, 2)"
		>
			{{ $t('chap.2.text') }}
		</div>
		<div class="chapter_text" style="color: #dd77dd">{{ $t('chap.1.title') }}</div>
		<div class="chapter_text_b" style="color: #dd77dd">{{ $t('chap.1.text2') }}</div>
	</div>

	<div v-if="showChapter(3)">
		<div class="chapter_background" style="color: rgb(127, 127, 255)">↑</div>
		<div
			class="chapter_clickable"
			style="color: rgb(127, 127, 255); background-color: rgb(63, 63, 127)"
			@click="player.stat.chapter = Math.max(player.stat.chapter, 3)"
		>
			{{ $t('chap.3.text') }}
		</div>
		<div class="chapter_text" style="color: rgb(63, 63, 127)">{{ $t('chap.3.title') }}</div>
		<div class="chapter_text_b" style="color: rgb(63, 63, 127)">{{ $t('chap.3.text1') }}</div>
	</div>

	<div v-if="showChapter(4)">
		<div class="chapter_background" style="color: rgb(255, 63, 63)">ω</div>
		<div
			class="chapter_clickable"
			style="color: rgb(255, 63, 63); background-color: rgb(255, 127, 127)"
			@click="player.stat.chapter = Math.max(player.stat.chapter, 4)"
		>
			{{ $t('chap.4.text') }}
		</div>
		<div class="chapter_text" style="color: rgb(255, 127, 127)">{{ $t('chap.4.title') }}</div>
		<div class="chapter_text_b" style="color: rgb(255, 127, 127)">{{ $t('chap.4.title') }}</div>
	</div>

	<div v-if="showChapter(5)">
		<div class="chapter_background" style="color: rgb(155, 125, 195)">Ψ</div>
		<div
			class="chapter_clickable"
			style="color: rgb(155, 125, 195); background-color: rgb(200, 190, 245)"
			@click="player.stat.chapter = Math.max(player.stat.chapter, 5)"
		>
			{{ $t('chap.5.text') }}
		</div>
		<div class="chapter_text" style="color: rgb(200, 190, 245)">
			{{ $t('chap.5.title') }}
		</div>
		<div class="chapter_text_b" style="color: rgb(200, 190, 245)">
			{{ $t('chap.5.text1') }}
		</div>
	</div>

	<div v-if="showChapter(6)">
		<div class="chapter_background" style="color: #c98300">Ω</div>
		<div
			class="chapter_clickable"
			style="color: #c98300; background-color: rgb(245, 193, 73)"
			@click="player.stat.chapter = Math.max(player.stat.chapter, 6)"
		>
			{{ $t('chap.6.text') }}
		</div>
		<div class="chapter_text" style="color: rgb(245, 193, 73)">
			{{ $t('chap.6.title') }}
		</div>
		<div class="chapter_text_b" style="color: rgb(245, 193, 73)">
			{{ $t('chap.6.text2') }}
		</div>
	</div>
</template>
