<script setup lang="ts">
import { player } from './core/global.ts';
import Decimal from 'break_eternity.js';

import Chapter from './components/group-2/Chapter.vue';

import Side from './components/menu/Side.vue';
import NewsTicker from './components/group-2/Newsticker.vue';

import AdditionResetButton from './components/group-2/AdditionResetButton.vue';
import MultipResetButton from './components/group-2/MultipResetButton.vue';
import ExpResetButton from './components/group-2/ExpResetButton.vue';
import NonRecursionResetButton from './components/group-2/NonRecursionResetButton.vue';
import Resources from './components/group-2/Resources.vue';

import BlackHole from './components/group-2/BlackHole.vue';

import { temp } from './core/temp-data.ts';

import Tabs from './components/Tabs.vue';
import RetributionAnimation from './components/tabs/group-1/RetributionAnimation.vue';
import PlotView from './components/tabs/plot/PlotView.vue';
</script>

<template>
	<Side />
	<div class="content">
		<div class="news" v-if="player.options.ui.newsbar" id="newsbar">
			<div class="background">
				<NewsTicker />
			</div>
		</div>
		<Resources />
		<div class="main-content" id="main">
			<div class="background">
				<AdditionResetButton v-if="player.upgrades[13] && player.singularity.stage < 10" />
				<MultipResetButton v-if="player.upgrades[26] && player.singularity.stage < 9" />
				<ExpResetButton
					v-if="
						player.singularity.stage < 4 &&
						player.stat.highestMulpower.gte(new Decimal(2).pow(1024))
					"
				/>
				<NonRecursionResetButton v-if="player.upgrades['616S']" />
				<Tabs />
			</div>
		</div>
	</div>
	<BlackHole />
	<RetributionAnimation />
	<Chapter />
	<PlotView />
</template>
