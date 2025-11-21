import { player, feature } from '@/core/global';
import { temp } from '@/core/temp-data';
import { Ordinal } from '@/lib/ordinal';
import { formatGain, formatWhole } from '@/utils/format';
import { OrdinalUtils } from '@/utils/ordinal';
import { defineComponent } from 'vue';
import Resource from './Resource';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'PreRetributionRes',
	setup(props, ctx) {
		const $t = useI18n().t;
		return () => (
			<>
				<Resource
					reskey="res.ordinal"
					resdisplay={(() => (
						<>
							{player.upgrades[61] &&
							player.hydra.deduceOrdinal[0].gte('e3.773962424821541352e168') ? (
								<vue-latex
									expression={Ordinal.displayOrdinalColored(
										player.ordinal.number.floor(),
										feature.Ordinal.base(),
									)}
								/>
							) : (
								<span
									innerHTML={Ordinal.displayOrdinalColored(
										player.ordinal.number.floor(),
										feature.Ordinal.base(),
									)}
								></span>
							)}
						</>
					))()}
					posleft="15"
					rescolor="rgb(255, 63, 63)"
					rescolor2={player.upgrades[61] ? 'rgb(155,125,95)' : 'rgb(255, 127, 127)'}
					growingdisplay={() => {
						if (player.upgrades[61]) {
							return (
								<>
									<span
										innerHTML={formatGain(
											temp.lastBMSDeduce,
											feature.Hydra.deduceSpeed(0),
										)}
									></span>
									(
									{$t('hydra.youhavededuced', {
										deduce: formatWhole(player.hydra.deduceOrdinal[0]),
									})}
									)
								</>
							);
						}
						return (
							<>
								(+
								<span
									innerHTML={OrdinalUtils.numberToOrdinal(
										feature.resourceGain.ordinalNumber().value,
										feature.Ordinal.base(),
									)}
								></span>
								/s)
							</>
						);
					}}
				/>
				<Resource
					reskey="res.hydra"
					resdisplay={formatWhole(player.hydra.power)}
					show={player.upgrades[517]}
					posleft="365"
					rescolor="rgb(200, 190, 245)"
					rescolor2="rgb(200, 190, 245)"
					rescolor3="rgb(0, 20, 127)"
					growingdisplay={() => {
						return (
							<span
								innerHTML={formatGain(
									player.hydra.power,
									feature.Hydra.hydraPowerPassiveGeneration(),
								)}
							></span>
						);
					}}
				/>
			</>
		);
	},
});
