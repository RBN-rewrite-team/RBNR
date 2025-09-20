<script setup lang="ts">
import { player } from './core/global.ts';
import Decimal from 'break_eternity.js';

import Chapter from './components/Chapter.vue';

import Side from './components/Side.vue';
import NewsTicker from './components/Newsticker.vue';
import Successor from './components/tabs/Successor.vue';
import Settings from './components/tabs/Settings.vue';
import Addition from './components/tabs/Addition.vue';
import Multip from './components/tabs/Multip.vue';
import PF from './components/tabs/PF.vue';
import NumberTheory from './components/tabs/NumberTheory.vue';
import Stat from './components/tabs/Stat.vue';
import MultipChals from './components/tabs/MultipChals.vue';
import About from './components/tabs/About.vue';

import AdditionResetButton from './components/AdditionResetButton.vue';
import MultipResetButton from './components/MultipResetButton.vue';
import ExpResetButton from './components/ExpResetButton.vue';
import NonRecursionResetButton from './components/NonRecursionResetButton.vue';
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
import Help from './components/tabs/Help.vue';
import Accelerator from './components/tabs/Accelerator.vue';
import TimeShard from './components/tabs/TimeShard.vue';
import Hydra from './components/tabs/Hydra.vue';
import HydraDilute from './components/tabs/HydraDilute.vue';

import PlotTab from './components/tabs/plot/PlotTab.vue';
import SaveBank from './components/tabs/SaveBank.vue';
import PlotView from './components/tabs/plot/PlotView.vue';
import NonRecursionMilestones from './components/tabs/nonrecursion/NonRecursionMilestones.vue';
import NonRecursionFactor from './components/tabs/nonrecursion/NonRecursionFactor.vue';
import NonRecursionTabChal from './components/tabs/nonrecursion/NonRecursionTabChal.vue';
import StudyTree from './components/tabs/nonrecursion/StudyTree.vue';
import MiniGame from './components/tabs/MiniGame.vue';
import AutomatorEditor from './components/tabs/AutomatorEditor.vue';
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
				<NonRecursionResetButton v-if="player.upgrades['616S']" />
				<Settings v-if="player.currentTab === 1" />
				<Addition v-if="player.currentTab === 2" />
				<About v-if="player.currentTab === 3" />
				<Multip v-if="player.currentTab === 4" />
				<PF v-if="player.currentTab === 5" />
				<NumberTheory v-if="player.currentTab === 6 && !player.upgrades[58]" />
				<OrdinalNT v-if="player.currentTab === 6 && player.upgrades[58]" />
				<Stat v-if="player.currentTab === 7" />
				<MultipChals v-if="player.currentTab === 8" />
				<ExpUpgrades v-if="player.currentTab === 9" />
				<ChessBoard v-if="player.currentTab === 10" />
				<Achievements v-if="player.currentTab === 11" />
				<Logarithm v-if="player.currentTab === 12" />
				<LogDilate v-if="player.currentTab === 13" />
				<SingularityGenerator v-if="player.currentTab === 14" />
				<Ordinal v-if="player.currentTab === 15" />
				<Help v-if="player.currentTab === 16" />
				<Accelerator v-if="player.currentTab === 17" />
				<TimeShard v-if="player.currentTab === 18" />
				<Hydra v-if="player.currentTab === 19" />
				<HydraDilute v-if="player.currentTab === 20" />
				<NonRecursionMilestones v-if="player.currentTab === 21" />
				<NonRecursionTabChal v-if="player.currentTab === 22" />
				<NonRecursionFactor v-if="player.currentTab === 23" />
				<StudyTree v-if="player.currentTab === 24" />
				<AutomatorEditor v-if="player.currentTab === 167" />
				<PlotTab v-if="player.currentTab === 200" />
				<SaveBank v-if="player.currentTab === 300" />
				<MiniGame v-if="player.currentTab === 1225" />
			</div>
		</div>
	</div>
	<BlackHole />
	<Chapter />
	<PlotView />
</template>
