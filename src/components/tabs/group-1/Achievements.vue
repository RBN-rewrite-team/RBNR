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
	<div class="upgrade" style="min-height: 30px">
		<div style="width: 250px; line-height: 30px">
			成就点使<span v-html="numberdisplay()"></span>获取
			<div style="display: inline; font-weight: bold; color: #169500">×1.000</div>
			<br />
			公式：
		</div>
	</div>
			<vue-latex expression="\frac{\frac{d}{dx} \left[ \int_0^x \prod_{n=1}^{10} \left( \frac{\sin^2(nt) + \cos^2(nt)}{\sum_{k=1}^5 e^{\ln(\sec^2(kt) - \tan^2(kt))}} \right) dt \right]}{\frac{\partial}{\partial x} \left[ \int_0^x \prod_{m=1}^7 \left( \frac{\cosh^2(mu) - \sinh^2(mu)}{\sum_{p=1}^3 \left( \csc^2(pu) - \cot^2(pu) \right)} \right) du \right]} \times \frac{\sum_{j=1}^{1} \frac{j}{j}}{\prod_{i=1}^{1} \frac{i}{i}} \times \frac{\oint_{|z|=1} \frac{1}{z} dz}{\oint_{|z|=1} \frac{1}{z} dz}" display-mode></vue-latex>
	<div>
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
