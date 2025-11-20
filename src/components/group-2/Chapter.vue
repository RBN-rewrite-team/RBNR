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
const chapters = [
	{
		id: 0,
		symbol: '0',
		color: `var(--suptitle-color)`,
		color2: `var(--title-color)`,
	},
	{
		id: 1,
		symbol: '+',
		color: `#009dd9`,
		color2: `#5acaff`,
	},
	{
		id: 2,
		symbol: '×',
		color: `#cc33ff`,
		color2: `#dd77dd`,
	},
	{
		id: 3,
		symbol: '↑',
		color: `rgb(127, 127, 255)`,
		color2: `rgb(63, 63, 127)`,
	},
	{
		id: 4,
		symbol: 'ω',
		color: `rgb(255, 63, 63)`,
		color2: `rgb(255, 127, 127)`,
	},
	{
		id: 5,
		symbol: 'Ψ',
		color: `rgb(155, 125, 195)`,
		color2: `rgb(200, 190, 245)`,
	},
	{
		id: 6,
		symbol: 'Ω',
		color: `#c98300`,
		color2: `rgb(245, 193, 73)`,
	},
] as const;
</script>

<template>
	<template v-for="i in 7">
		<div
			v-if="showChapter(i - 1)"
			@click="player.stat.chapter = Math.max(player.stat.chapter, chapters[i - 1].id)"
		>
			<div class="chapter_background" :style="{ color: chapters[i - 1].color }">
				{{ chapters[i - 1].symbol }}
			</div>
			<div
				class="chapter_clickable"
				:style="{ color: chapters[i - 1].color, backgroundColor: chapters[i - 1].color2 }"
				@click="player.stat.chapter = Math.max(player.stat.chapter, chapters[i - 1].id)"
			>
				{{ $t('chapa' + (i - 1).toString() + '.text') }}
			</div>
			<div
				class="chapter_text"
				:style="{ backgroundColor: chapters[i - 1].color2 }"
				@click="player.stat.chapter = Math.max(player.stat.chapter, chapters[i - 1].id)"
			>
				{{ $t('chapa' + (i - 1).toString() + '.title') }}
			</div>
			<div class="chapter_text_b" :style="{ backgroundColor: chapters[i - 1].color2 }">
				{{ $t('chapa' + (i - 1).toString() + '.text1') }}
			</div>
		</div>
	</template>
</template>
