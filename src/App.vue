<script setup lang="ts">
import {
	format,
	formatWhole,
	formatGain,
	formatLaTeX,
	formatLaTeXWhole,
	notations,
	notationNamesMap,
} from '@/utils/format';
import { player, feature } from './core/global.ts';
import { UPGRADES, BUYABLES, SOFTCAPS, buyables } from './core/mechanic.ts';
import Decimal from 'break_eternity.js';

import Chapter from './components/Chapter.vue';

import Side from './components/Side.vue';
import NewsTicker from './components/Newsticker.vue';
import TDChallenge from './components/TDChallenge.vue';
import Successor from './components/tabs/Successor.vue';
import Settings from './components/tabs/Settings.vue';
import Addition from './components/tabs/Addition.vue';
import Multip from './components/tabs/Multip.vue';
import PF from './components/tabs/PF.vue';
import NumberTheory from './components/tabs/NumberTheory.vue';
import Stat from './components/tabs/Stat.vue';
import MultipChals from './components/tabs/MultipChals.vue';

import AdditionResetButton from './components/AdditionResetButton.vue';
import MultipResetButton from './components/MultipResetButton.vue';
import ExpResetButton from './components/ExpResetButton.vue';
import { predictableRandom } from './utils/algorithm.ts';
import Resources from './components/Resources.vue';

import ExpUpgrades from './components/tabs/ExpUpgrades.vue';
import Achievements from './components/tabs/Achievements.vue';
import ChessBoard from './components/tabs/ChessBoard.vue';
import Logarithm from './components/tabs/Logarithm.vue';
import LogDilate from './components/tabs/LogDilate.vue';

import SingularityGenerator from './components/tabs/SingularityGenerator.vue';
import BlackHole from './components/BlackHole.vue';
import Ordinal from './components/tabs/Ordinal.vue';
import OrdinalNT from './components/tabs/OrdinalNT.vue';
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
				<Successor v-if="player.currentTab === 0" />
				<Settings v-if="player.currentTab === 1" />
				<Addition v-if="player.currentTab === 2" />
				<Multip v-if="player.currentTab === 4" />
				<PF v-if="player.currentTab === 5" />
				<NumberTheory v-if="player.currentTab === 6 && !player.upgrades[58]" />
				<Stat v-if="player.currentTab === 7" />
				<MultipChals v-if="player.currentTab === 8" />
				<ExpUpgrades v-if="player.currentTab === 9" />
				<ChessBoard v-if="player.currentTab === 10" />
				<Achievements v-if="player.currentTab === 11" />
				<Logarithm v-if="player.currentTab === 12" />
				<LogDilate v-if="player.currentTab === 13" />
				<SingularityGenerator v-if="player.currentTab === 14" />
				<Ordinal v-if="player.currentTab === 15" />
				<OrdinalNT v-if="player.currentTab === 6 && player.upgrades[58]" />
				<div class="main" v-if="player.currentTab === 3">
					<h1>大数之路重制版</h1>
					版本: v0.4<br />
					制作组名单(排名不分先后)：<br />
					静火Ω<br />
					VeryrrDefine<br />
					010000000a7<br />
					Seanxlx<br />
					EdenGameMaster<br />
					6左爷6<br />
				</div>
			</div>
		</div>
	</div>
	<BlackHole />
	<Chapter />
</template>

<style scoped></style>
