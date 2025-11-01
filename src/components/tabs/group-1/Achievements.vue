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
const numberdisplay = () => {
	const a = player.stat.chapter >= 4 ? "<span style='color: red'>所有推演速度</span>" : '数值';
	return a;
};
</script>

<template>
	<div style="height: 20px"></div>
	<div class="upgrade" style="height: 20px">
		<div style="width: 500px; line-height: 20px">
			你有&nbsp;{{ player.achievements.length }}&nbsp;成就点<br />
			成就目前只做到了指数层级重置
		</div>
	</div>
	<div class="upgrade" style="min-height: 30px">
		<div style="width: 450px; line-height: 30px">
			成就点使<span v-html="numberdisplay()"></span>获取
			<div style="display: inline; font-weight: bold; color: #169500">^1.0000</div>
			<br />
			公式：
		</div>
	</div>
	<vue-latex
		expression="\frac{\frac{d}{dx} \left[ \int_0^x \prod_{n=1}^{10} \left( \frac{\sin^2(nt) + \cos^2(nt)}{\sum_{k=1}^{10} e^{\ln(\sec^2(kt) - \tan^2(kt))}} \right) dt \right]}{\frac{\partial}{\partial x} \left[ \int_0^x \prod_{m=1}^{10} \left( \frac{\cosh^2(mu) - \sinh^2(mu)}{\sum_{p=1}^{10} \left( \csc^2(pu) - \cot^2(pu) \right)} \right) du \right]} \times \frac{\sum_{j=1}^{1} \frac{j}{j}}{\prod_{i=1}^{1} \frac{i}{i}} \times \frac{\oint_{|z|=1} \frac{1}{z} dz}{\oint_{|z|=1} \frac{1}{z} dz}+\\ \frac{d^2}{dx^2}\left[\int_0^x \left( \prod_{n=1}^{5} \left( \frac{\tan^2(nt) - \sec^2(nt) + 1}{\sum_{k=1}^{3} \ln(e^{\coth^2(kt) - \mathrm{csch}^2(kt)})} \right) \right) dt \right] \times \frac{\oint_{|z|=3} \left( \frac{z^5 - 5z^3 + 4z}{z^4 - 5z^2 + 4} - 1 \right) dz}{\lim_{\epsilon \to 0} \frac{1}{\epsilon} \int_{-\epsilon}^{\epsilon} \left( \frac{\sinh^2(u) - \cosh^2(u) + 1}{u^2 + 1} \right) du}"
		display-mode
	></vue-latex>
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
					}}&nbsp;<span v-html="getTempSelectedAch().title"></span
				></b>
			</p>
			<p v-if="showSelectedAchievementsDesc()" v-html="getTempSelectedAch().desc"></p>

			<p>奖励：1成就点</p>
		</div>
	</div>
</template>
