import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import MMSDeduction from './MMSDeduction';
import { MMS, type RankMilestone } from '@/core/post-nonrec/mms';
import { formatWhole } from '@/utils/format';
import { player } from '@/core/save';
import type PowiainaNum from 'powiaina_num.js';
function milestoneDisplay(mil: RankMilestone | undefined | null, currency?: string) {
	let eff: (undefined | [() => PowiainaNum, (x: PowiainaNum) => string]) | null = null;
	if (!mil) return <></>;

	eff = mil[2];
	return (
		<>
			On
			{currency && (
				<>
					&nbsp;{currency} {formatWhole(mil[0])}
				</>
			)}
			, {mil[1]()}.
			{eff && <><br />Currently: {eff[1](eff[0]())}</>}
			<br />
		</>
	);
}
function getRankDisplay(q: number, rank: PowiainaNum, currency?: string) {
	let mil = MMS.rank.getRankMilestones(q, rank);
	return milestoneDisplay(mil, currency);
}
export default defineComponent({
	name: 'MMSEngine',
	setup() {
		const $t = useI18n().t;
		return () => (
			<>
				<div class="main">
					<p style="color: grey; table-align: center">{$t('mms.t')}</p>
					<div
						style={{
							margin: 'auto',
						}}
					>
						<MMSDeduction />
					</div>
					<div
						style={{
							margin: 'auto',
						}}
					>
						<div class="rank_div">
							<b class="rank_text">Rank</b>&nbsp;{formatWhole(player.hydra.mms.rank)}
							<div class={'rank_button'} onClick={() => MMS.rank.levelUp(0)}>
								Reset your MMS progression & 充能九头蛇能量, but Rank up. <br />
								{getRankDisplay(0, player.hydra.mms.rank, 'Rank')}
								<br />
								To Rank up, requires <br />
								{formatWhole(MMS.rank.levelRequirement(0))} 充能九头蛇能量
							</div>
						</div>
						<div class="rank_div">
							<b class="rank_text">Tier</b>&nbsp;{formatWhole(player.hydra.mms.tier)}
							<div class={'rank_button'}>
								Reset your Rank, MMS progression & 充能九头蛇能量, but Tier up.{' '}
								<br />
								<br />
								To Tier up, requires <br />
								{formatWhole(MMS.rank.levelRequirement(1))} Rank
							</div>
						</div>
					</div>
					{MMS.rank.rankMilestones[0].map(
						(x) => x[0].lte(player.hydra.mms.rank) && milestoneDisplay(x, 'Rank'),
					)}
				</div>
			</>
		);
	},
});
