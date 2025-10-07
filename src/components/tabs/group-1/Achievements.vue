<script setup lang="ts">
import {
	achievements,
	getAchTag,
	getTempSelectedAch,
	showSelectedAchievementsDesc,
} from '@/core/achievements';
import { player } from '@/core/save';
import { temp } from '@/core/temp-data';
import { VueLatex } from 'vatex';
import { computed } from 'vue';
const numberdisplay = () => {
	let a = player.stat.chapter >= 4 ? "<span style='color: red'>???</span>" : '数值';
	return a;
};
</script>

<template>
	<div style="height: 20px"></div>
	<div class="upgrade" style="height: 20px">
		<div style="width: 400px; line-height: 20px">
			你有&nbsp;{{ player.achievements.length }}&nbsp;成就点
		</div>
	</div>
	<div class="upgrade" style="height: 30px">
		<div style="width: 250px; line-height: 30px">
			成就点使<span v-html="numberdisplay()"></span>获取
			<div style="display: inline; font-weight: bold; color: #169500">×1.000</div>
			<br />
			公式：
			<br />
			<vue-latex expression="(x^2)^{\sin^2x+\cos^2x-\frac{e^{2i\pi+x}}{\exp(x)}}"></vue-latex>
		</div>
	</div>
	<div style="margin-top: 80px">
		<div class="upgrade" style="height: auto" v-for="row in Object.entries(achievements)">
			<div
				:class="
					player.achievements.includes(ach[1].id)
						? 'achievement_button_bought'
						: 'achievement_button'
				"
				v-for="ach in Object.entries(row[1])"
				@click="temp.select_ach = [parseInt(row[0]), parseInt(ach[0])]"
			>
				{{ getAchTag(ach, row) }}
			</div>
		</div>
	</div>
	<div class="upgrade" style="height: auto; margin-top: 30px">
		<div
			:class="
				player.achievements.includes(getTempSelectedAch().id)
					? 'autobuyer_bought'
					: 'autobuyer'
			"
			id="achievementText"
			style="line-height: 16px; font-size: 16px"
		>
			<p style="font-size: 10px">
				<b
					>{{
						getAchTag(
							[String(temp.select_ach[1]), getTempSelectedAch()],
							[temp.select_ach[0]],
						)
					}}&nbsp;{{ getTempSelectedAch().title }}</b
				>
			</p>
			<p v-if="showSelectedAchievementsDesc()">{{ getTempSelectedAch().desc }}</p>

			<p>奖励：1成就点</p>
		</div>
	</div>
</template>
