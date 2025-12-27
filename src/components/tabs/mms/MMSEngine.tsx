import { defineComponent, ref, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import MMSDeduction from './MMSDeduction';
import { MMS, type RankMilestone } from '@/core/post-nonrec/mms';
import { formatWhole, format } from '@/utils/format';
import { player } from '@/core/save';
import type PowiainaNum from 'powiaina_num.js';
import { useUpdate } from '@/lib/useUpdate';
import { getMessage } from '@/utils/i18n';
import UpgradesPN from '@/components/upg/UpgradesPN';
function milestoneDisplay(mil: RankMilestone | undefined | null, currency?: string) {
	let eff: (undefined | [() => PowiainaNum, (x: PowiainaNum) => string]) | null = null;
	if (!mil) return <></>;

	eff = mil[3];
	return (
		<>
			{mil[2].map((x) => (
				<>
					<button
						style={{
							border:
								'2px solid ' +
								MMS.rank.rankMilTags.filter((item) => {
									return item.id === x;
								})[0].color,
							backgroundColor: 'var(--background-color)',
							color: MMS.rank.rankMilTags.filter((item) => {
								return item.id === x;
							})[0].color,
							width: '60px',
							height: '30px',
						}}
					>
						{x}
					</button>
				</>
			))}
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
				</>
			)}
			<br />
		</>
	);
}
function tagAccord(tagOpened: { [key: string]: boolean }, pending: string[]) {
	if (pending.length === 0) return true;
	for (let i = 0; i < pending.length; i++) {
		if (tagOpened[pending[i]]) return true;
	}
	return false;
}
function getRankDisplay(q: number, rank: PowiainaNum, currency?: string) {
	let mil = MMS.rank.getRankMilestones(q, rank);
	return milestoneDisplay(mil, currency);
}
export default defineComponent({
	name: 'MMSEngine',
	setup() {
		const $t = useI18n().t;
		const tag = ref({}) as Ref<{ [key: string]: boolean }>;
		return () => (
			<>
				<div class="main">
					<p style="color: grey; table-align: center">{$t('mms.t')}</p>
					<b style="color: cyan">
						{$t('mms.staticExp')}&nbsp;{format(MMS.staticExp())}
					</b>
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
								{MMS.rank.getRankTierName(0)}{' '}
								{formatWhole(MMS.rank.levelRequirement(1))}
							</div>
							{MMS.rank.rankEnergies[1].unlocked() ? (
								<>
									<span style="font-size: 14px">
										<b>Tier Energy</b>&nbsp;
										{formatWhole(player.hydra.mms.tierEnergy)}
										<br />
										{MMS.rank.rankEnergies[1].effectDescription()}
									</span>
								</>
							) : (
								<></>
							)}
						</div>
						{player.hydra.mms.tier.gte(4) || player.hydra.mms.tri.gte(1) ? (
							<>
								<div class="rank_div">
									<b class="rank_text">{MMS.rank.getRankTierName(2)}</b>&nbsp;
									{formatWhole(player.hydra.mms.tri)}
									<div class={'rank_button'} onClick={() => MMS.rank.levelUp(2)}>
										{$t('mms.rank.reset.2')} <br />
										{getRankDisplay(
											2,
											player.hydra.mms.tri,
											MMS.rank.getRankTierName(2),
										)}
										<br />
										{$t('mms.rank.requirement', {
											up: MMS.rank.getRankTierName(2),
										})}
										<br />
										{MMS.rank.getRankTierName(1)}{' '}
										{formatWhole(MMS.rank.levelRequirement(2))}
									</div>
								</div>
							</>
						) : (
							<></>
						)}

						{player.hydra.mms.tri.gte(10) || player.hydra.mms.tetr.gte(1) ? (
							<>
								<div class="rank_div">
									<b class="rank_text">{MMS.rank.getRankTierName(3)}</b>&nbsp;
									{formatWhole(player.hydra.mms.tetr)}
									<div class={'rank_button'} onClick={() => MMS.rank.levelUp(3)}>
										{$t('mms.rank.reset.3')} <br />
										{getRankDisplay(
											3,
											player.hydra.mms.tri,
											MMS.rank.getRankTierName(3),
										)}
										<br />
										{$t('mms.rank.requirement', {
											up: MMS.rank.getRankTierName(3),
										})}
										<br />
										{MMS.rank.getRankTierName(2)}{' '}
										{formatWhole(MMS.rank.levelRequirement(3))}
									</div>
								</div>
							</>
						) : (
							<></>
						)}
					</div>
					<br />
					{MMS.rank.rankMilTags.map((x) => (
						<>
							<button
								style={{
									border: '2px solid ' + x.color,
									backgroundColor: 'var(--background-color)',
									color: x.color,
									width: '60px',
									height: '30px',
									opacity: tag.value[x.id] ? 1 : 0.5,
								}}
								onClick={() => {
									tag.value[x.id] = !tag.value[x.id];
								}}
							>
								{x.id}
							</button>
						</>
					))}
					<br />
					{MMS.rank.rankMilestones[0].map(
						(x) =>
							x[0].lte(player.hydra.mms.rank) &&
							tagAccord(tag.value, x[2]) &&
							milestoneDisplay(x, MMS.rank.getRankTierName(0)),
					)}
					{player.hydra.mms.tier.gte(1) ? (
						<>
							<br />
						</>
					) : (
						<></>
					)}
					{MMS.rank.rankMilestones[1].map(
						(x) =>
							x[0].lte(player.hydra.mms.tier) &&
							tagAccord(tag.value, x[2]) &&
							milestoneDisplay(x, MMS.rank.getRankTierName(1)),
					)}
					{player.hydra.mms.tri.gte(1) ? (
						<>
							<br />
						</>
					) : (
						<></>
					)}
					{MMS.rank.rankMilestones[2].map(
						(x) =>
							x[0].lte(player.hydra.mms.tri) &&
							tagAccord(tag.value, x[2]) &&
							milestoneDisplay(x, MMS.rank.getRankTierName(2)),
					)}

					{/* <UpgradesPN upgids={[['u631']]} /> */}
				</div>
			</>
		);
	},
});
