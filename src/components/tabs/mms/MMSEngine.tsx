import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import MMSDeduction from './MMSDeduction';
import { MMS, type RankMilestone } from '@/core/post-nonrec/mms';
import { formatWhole } from '@/utils/format';
import { player } from '@/core/save';
import type PowiainaNum from 'powiaina_num.js';
import { useUpdate } from '@/lib/useUpdate';
import { getMessage } from '@/utils/i18n';
function milestoneDisplay(mil: RankMilestone | undefined | null, currency?: string) {
	let eff: (undefined | [() => PowiainaNum, (x: PowiainaNum) => string]) | null = null;
	if (!mil) return <></>;

	eff = mil[2];
	return (
		<>
			<span
				innerHTML={getMessage('mms.rank.mil', {
					goal: `${currency} ${formatWhole(mil[0])}`,
					do: mil[1](),
				})}
			></span>
			{eff && (
				<>
					<br />
					{getMessage('upg.effect', { effect: eff[1](eff[0]()) })}
					<span style="display: none">{player.lastUpdated}</span>
				</>
			)}
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
							<b class="rank_text">{MMS.rank.getRankTierName(0)}</b>&nbsp;
							{formatWhole(player.hydra.mms.rank)}
							<div class={'rank_button'} onClick={() => MMS.rank.levelUp(0)}>
								{$t('mms.rank.reset.0')} <br />
								{getRankDisplay(
									0,
									player.hydra.mms.rank,
									MMS.rank.getRankTierName(0),
								)}
								<br />
								{$t('mms.rank.requirement', { up: MMS.rank.getRankTierName(0) })}
								<br />
								{formatWhole(MMS.rank.levelRequirement(0))}{' '}
								{$t('currency.charged_hydra')}
							</div>
							{MMS.rank.rankEnergies[0].unlocked() ? (
								<>
									<span style="font-size: 14px">
										<b>Rank Energy</b>&nbsp;
										{formatWhole(player.hydra.mms.rankEnergy)}
										<br />
										{MMS.rank.rankEnergies[0].effectDescription()}
									</span>
								</>
							) : (
								<></>
							)}
						</div>
						<div class="rank_div">
							<b class="rank_text">{MMS.rank.getRankTierName(1)}</b>&nbsp;
							{formatWhole(player.hydra.mms.tier)}
							<div class={'rank_button'} onClick={() => MMS.rank.levelUp(1)}>
								{$t('mms.rank.reset.1')} <br />
								{getRankDisplay(
									1,
									player.hydra.mms.tier,
									MMS.rank.getRankTierName(1),
								)}
								<br />
								{$t('mms.rank.requirement', { up: MMS.rank.getRankTierName(1) })}
								<br />
								{formatWhole(MMS.rank.levelRequirement(1))}{' '}
								{MMS.rank.getRankTierName(0)}
							</div>
						</div>
					</div>
					<br />
					{MMS.rank.rankMilestones[0].map(
						(x) =>
							x[0].lte(player.hydra.mms.rank) &&
							milestoneDisplay(x, MMS.rank.getRankTierName(0)),
					)}
					<br />
					{MMS.rank.rankMilestones[1].map(
						(x) =>
							x[0].lte(player.hydra.mms.tier) &&
							milestoneDisplay(x, MMS.rank.getRankTierName(1)),
					)}
				</div>
			</>
		);
	},
});
