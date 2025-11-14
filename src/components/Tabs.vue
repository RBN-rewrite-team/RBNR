<script lang="ts" setup>
import { computed, type Component } from 'vue';
import { player } from '../core/global.ts';

import Successor from './tabs/group-1/Successor.vue';
import Settings from './tabs/group-1/Settings.vue';
import Addition from './tabs/group-1/Addition.vue';
import Multip from './tabs/group-1/Multip.vue';
import PF from './tabs/group-1/PF.vue';
import NumberTheory from './tabs/group-1/NumberTheory.vue';
import Stat from './tabs/group-1/Stat.vue';
import MultipChals from './tabs/group-1/MultipChals.vue';
import About from './tabs/group-1/About.vue';
import ExpUpgrades from './tabs/group-1/ExpUpgrades.vue';
import Achievements from './tabs/group-1/Achievements.vue';
import ChessBoard from './tabs/group-1/ChessBoard.vue';
import Logarithm from './tabs/group-1/Logarithm.vue';
import LogDilate from './tabs/group-1/LogDilate.vue';
import Ordinal from './tabs/group-1/Ordinal.vue';
import OrdinalNT from './tabs/ordinalnt/OrdinalNT.vue';
import Help from './tabs/help/Help.vue';
import Accelerator from './tabs/group-1/Accelerator.vue';
import TimeShard from './tabs/group-1/TimeShard.vue';
import Hydra from './tabs/group-1/Hydra.vue';
import HydraDilute from './tabs/group-1/HydraDilute.vue';
import PlotTab from './tabs/plot/PlotTab.vue';
import SaveBank from './tabs/group-1/SaveBank.vue';
import NonRecursionMilestones from './tabs/nonrecursion/NonRecursionMilestones.vue';
import NonRecursionFactor from './tabs/nonrecursion/NonRecursionFactor.vue';
import NonRecursionTabChal from './tabs/nonrecursion/NonRecursionTabChal.vue';
import StudyTree from './tabs/nonrecursion/StudyTree.vue';
import MiniGame from './tabs/minigame/MiniGame.vue';
import AutomatorEditor from './tabs/group-1/AutomatorEditor.tsx';
import NonRecursionTabUpgrade from './tabs/nonrecursion/NonRecursionTabUpgrade.vue';
import YEngine from './tabs/y/YEngine.vue';
import NonRecursionUNOCF from './tabs/nonrecursion/NonRecursionUNOCF.vue';
import Retribution from './tabs/group-1/Retribution.vue';
import DeveloperMode from './tabs/devonly/DeveloperMode.vue';
import Analysis from './tabs/pt/Analysis.vue';
import AnalysisMilestones from './tabs/pt/AnalysisMilestones.vue';
import SingularityGenerator from './tabs/group-1/SingularityGenerator.vue';
import Garden from '@/components/tabs/garden/Garden.tsx';

const tabComponents: {
	[key: string]: Component | (() => Component);
} = {
	0: Successor,
	1: Settings,
	2: Addition,
	3: About,
	4: Multip,
	5: PF,
	6: () => (player.upgrades[58] ? OrdinalNT : NumberTheory),
	7: Stat,
	8: MultipChals,
	9: ExpUpgrades,
	10: ChessBoard,
	11: Achievements,
	12: Logarithm,
	13: LogDilate,
	14: SingularityGenerator,
	15: Ordinal,
	16: Help,
	17: Accelerator,
	18: TimeShard,
	19: Hydra,
	20: HydraDilute,
	21: NonRecursionMilestones,
	22: NonRecursionTabChal,
	// 23: NonRecursionFactor,
	24: StudyTree,
	25: NonRecursionTabUpgrade,
	26: NonRecursionUNOCF,
	27: YEngine,
	28: Retribution,
	29: Analysis,
	30: AnalysisMilestones,
	31: Garden,
	200: PlotTab,
	300: SaveBank,
	500: DeveloperMode,
	1225: MiniGame,
};

const currentComponent = computed(() => {
	const componentGetter = tabComponents[player.currentTab as keyof typeof tabComponents];

	if (!componentGetter) {
		return null;
	}

	return typeof componentGetter === 'function'
		? (componentGetter as () => Component)()
		: componentGetter;
});
</script>

<template>
	<component :is="currentComponent" />
	<AutomatorEditor />
</template>
