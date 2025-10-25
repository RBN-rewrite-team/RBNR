<script setup lang="ts">
import { player } from './core/global.ts';
import Decimal from 'break_eternity.js';

import Chapter from './components/group-2/Chapter.vue';

import Side from './components/group-2/Side.vue';
import NewsTicker from './components/group-2/Newsticker.vue';
import Successor from './components/tabs/group-1/Successor.vue';
import Settings from './components/tabs/group-1/Settings.vue';
import Addition from './components/tabs/group-1/Addition.vue';
import Multip from './components/tabs/group-1/Multip.vue';
import PF from './components/tabs/group-1/PF.vue';
import NumberTheory from './components/tabs/group-1/NumberTheory.vue';
import Stat from './components/tabs/group-1/Stat.vue';
import MultipChals from './components/tabs/group-1/MultipChals.vue';
import About from './components/tabs/group-1/About.vue';

import AdditionResetButton from './components/group-2/AdditionResetButton.vue';
import MultipResetButton from './components/group-2/MultipResetButton.vue';
import ExpResetButton from './components/group-2/ExpResetButton.vue';
import NonRecursionResetButton from './components/group-2/NonRecursionResetButton.vue';
import Resources from './components/group-2/Resources.vue';

import ExpUpgrades from './components/tabs/group-1/ExpUpgrades.vue';
import Achievements from './components/tabs/group-1/Achievements.vue';
import ChessBoard from './components/tabs/group-1/ChessBoard.vue';
import Logarithm from './components/tabs/group-1/Logarithm.vue';
import LogDilate from './components/tabs/group-1/LogDilate.vue';

import SingularityGenerator from './components/tabs/group-1/SingularityGenerator.vue';
import BlackHole from './components/group-2/BlackHole.vue';
import Ordinal from './components/tabs/group-1/Ordinal.vue';
import OrdinalNT from './components/tabs/ordinalnt/OrdinalNT.vue';
import Help from './components/tabs/help/Help.vue';
import Accelerator from './components/tabs/group-1/Accelerator.vue';
import TimeShard from './components/tabs/group-1/TimeShard.vue';
import Hydra from './components/tabs/group-1/Hydra.vue';
import HydraDilute from './components/tabs/group-1/HydraDilute.vue';

import PlotTab from './components/tabs/plot/PlotTab.vue';
import SaveBank from './components/tabs/group-1/SaveBank.vue';
import PlotView from './components/tabs/plot/PlotView.vue';
import NonRecursionMilestones from './components/tabs/nonrecursion/NonRecursionMilestones.vue';
import NonRecursionFactor from './components/tabs/nonrecursion/NonRecursionFactor.vue';
import NonRecursionTabChal from './components/tabs/nonrecursion/NonRecursionTabChal.vue';
import StudyTree from './components/tabs/nonrecursion/StudyTree.vue';
import MiniGame from './components/tabs/minigame/MiniGame.vue';
import AutomatorEditor from './components/tabs/group-1/AutomatorEditor.vue';
import NonRecursionTabUpgrade from './components/tabs/nonrecursion/NonRecursionTabUpgrade.vue';
import YEngine from './components/tabs/y/YEngine.vue';
import NonRecursionUNOCF from './components/tabs/nonrecursion/NonRecursionUNOCF.vue';

import Retribution from './components/tabs/group-1/Retribution.vue';
import RetributionAnimation from './components/tabs/group-1/RetributionAnimation.vue';
import DeveloperMode from './components/tabs/devonly/DeveloperMode.vue';

import Analysis from './components/tabs/pt/Analysis.vue';
import AnalysisMilestones from './components/tabs/pt/AnalysisMilestones.vue';
import { temp } from './core/temp-data.ts';
</script>

<template>
	<Side />
	<div class="content">
		<div class="news" v-if="player.options.ui.newsbar" id="newsbar">
			<div class="background">
				<NewsTicker />
			</div>
		</div>
		<!-- <p v-if="temp.useMobileStyle">拜谢</p> -->
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
				<!-- <span class="corrupted_text">hyw</span> -->
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
				<NonRecursionTabUpgrade v-if="player.currentTab === 25"></NonRecursionTabUpgrade>
				<NonRecursionUNOCF v-if="player.currentTab === 26"></NonRecursionUNOCF>
				<YEngine v-if="player.currentTab === 27"></YEngine>
				<Retribution v-if="player.currentTab === 28" />
				<Analysis v-if="player.currentTab === 29" />
				<AnalysisMilestones v-if="player.currentTab === 30" />
				<AutomatorEditor v-if="player.currentTab === 167" />
				<PlotTab v-if="player.currentTab === 200" />
				<SaveBank v-if="player.currentTab === 300" />
				<MiniGame v-if="player.currentTab === 1225" />
				<DeveloperMode v-if="player.currentTab === 500" />
			</div>
		</div>
	</div>
	<BlackHole />
	<RetributionAnimation />
	<Chapter />
	<PlotView />
</template>
