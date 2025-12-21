import { defineComponent } from 'vue';
import Side from './components/menu/Side.vue';
import Newsticker from './components/group-2/Newsticker.vue';
import Resources from './components/group-2/Resources.tsx';
import AdditionResetButton from './components/group-2/AdditionResetButton.vue';
import MultipResetButton from './components/group-2/MultipResetButton.vue';
import ExpResetButton from './components/group-2/ExpResetButton.vue';
import NonRecursionResetButton from './components/group-2/NonRecursionResetButton.vue';
import Tabs from './components/Tabs.vue';
import BlackHole from './components/group-2/BlackHole.vue';
import RetributionAnimation from './components/tabs/group-1/RetributionAnimation.vue';
import Chapter from './components/group-2/Chapter.vue';
import PlotView from './components/tabs/plot/PlotView.vue';
import { player } from './core/save';
import { DC } from './core/constants';
import P from './core/performance.tsx';
import Notifies from './components/notify/Notifies.tsx';
import EnterTheCardinalWorld from './components/cardinal/EnterTheCardinalWorld.tsx';
export default defineComponent({
	name: 'App',
	setup() {
		return () => (
			<>
				<Side />
				<P />
				<Notifies />
				<div class="content">
					{player.options.ui.newsbar ? (
						<div class="news" id="newsbar">
							<div class="background">
								<Newsticker />
							</div>
						</div>
					) : (
						''
					)}
					<Resources />
					<div class="main-content" id="main">
						<div
							class="background"
							style={{
								marginLeft: '0px',
								marginTop: '0px',
								paddingLeft: '-5px',
							}}
						>
							{player.upgrades[13] && player.singularity.stage < 10 ? (
								<AdditionResetButton />
							) : (
								''
							)}
							{player.upgrades[26] && player.singularity.stage < 9 ? (
								<MultipResetButton />
							) : (
								''
							)}
							{player.singularity.stage < 4 &&
							player.stat.highestMulpower.gte(DC.D_2P1024) ? (
								<ExpResetButton />
							) : (
								''
							)}
							{player.upgrades['616S'] ? <NonRecursionResetButton /> : ''}
							<Tabs />
						</div>
					</div>
				</div>
				<BlackHole />
				<RetributionAnimation />
				<Chapter />
				<PlotView />
				<EnterTheCardinalWorld />
			</>
		);
	},
});
