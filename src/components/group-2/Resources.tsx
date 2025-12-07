import { defineComponent } from 'vue';
import Resource from '../resources/Resource';
import { feature, player } from '@/core/global';
import { useUpdate } from '@/lib/useUpdate';
import { format, formatGain, formatWhole } from '@/utils/format';
import { useI18n } from 'vue-i18n';
import Decimal from 'break_eternity.js';
import { DC } from '@/core/constants';
import { Ordinal } from '@/lib/ordinal';
import PreOrdRes from '../resources/PreOrdRes';
import { OrdinalUtils } from '@/utils/ordinal';
import { temp } from '@/core/temp-data';
import PreRetributionRes from '../resources/PreRetributionRes';
import { getCurrentOrdinal } from '@/utils/y-seq';
import { Garden } from '@/core/pt/garden';
import { PTO } from '@/core/post-nonrec/pto';

export default defineComponent({
	name: 'Resources',
	setup(props, ctx) {
		const $t = useI18n().t;
		function nonrecRes() {
			return (
				<Resource
					reskey="currency.非递归能量"
					resdisplay={formatWhole(player.nonrecu.power)}
					show={player.upgrades['616S']}
					posleft="685"
					rescolor="rgb(201, 131, 0)"
					rescolor2="rgb(201, 131, 0)"
					growingdisplay={() => {
						return <>(+{formatWhole(feature.NON_RECURSIVE.gain())})</>;
					}}
				/>
			);
		}
		return () => (
			<>
				<div class="resources" style="font-size: 20px" id="resources">
					<div class="background">
						{player.firstResetBit & 0b1000 ? (
							player.currentTab !== 31 ? (
								<>
									{player.retribution == 0 ? (
										<PreRetributionRes />
									) : (
										<>
											<div class="resource" style="margin-left: 15px">
												<div style="font-weight: bold; color: #5d8aa8">
													{$t('tab.ordinal')}&nbsp;
													<vue-latex
														expression={getCurrentOrdinal(
															player.hydra.deduceOrdinal[1],
														)}
													/>
												</div>
											</div>
											<div class="resource" style="margin-left: 350px">
												<div style="font-weight: bold; color: #007f00">
													{$t('res.compress')}&nbsp;
													{formatWhole(player.hydra.compressedPower)}
												</div>
											</div>
										</>
									)}
									{nonrecRes()}
									{Garden.level().gte(10) && (
										<Resource
											reskey="res.ptpower"
											resdisplay={format(player.pt.power)}
											posleft="1000"
											rescolor="#00ffff"
											rescolor2="#00ffff"
											growingdisplay={() => {
												return <>(+{format(PTO.ptPowerGain())})</>;
											}}
										/>
									)}
								</>
							) : (
								<>
									<div class="resource" style="margin-left: 15px">
										<div style="font-weight: bold; color: yellow">
											{$t('currency.想法')}&nbsp;
											{format(player.garden.idea, 6)}
										</div>
									</div>
									<div class="resource" style="margin-left: 350px">
										<div style="font-weight: bold; color: purple">
											{$t('currency.熵')}&nbsp;
											{format(player.garden.entropy, 6)}
										</div>
										<br />
										<div style="font-size: 14px; color: purple">
											{$t('garden.entropydebuff', {
												effect: format(Garden.entropyEffect(), 7),
											})}
										</div>
									</div>
									<div class="resource" style="margin-left: 685px">
										<div style="font-weight: bold; color: orange">
											{$t('currency.灵感')}&nbsp;
											{format(player.garden.inspiration)}
										</div>
										<br />
										<div style="font-weight: bold; color: pink">
											{ $t('currency.焓') }&nbsp;
											{ formatWhole(player.garden.enthalpy) }
										</div>
									</div>
								</>
							)
						) : (
							<PreOrdRes />
						)}
					</div>
				</div>
			</>
		);
	},
});
