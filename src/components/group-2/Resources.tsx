import { defineComponent } from 'vue';
import Resource from '../resources/Resource';
import { feature, player } from '@/core/global';
import { useUpdate } from '@/lib/useUpdate';
import { formatGain, formatWhole } from '@/utils/format';
import { useI18n } from 'vue-i18n';
import Decimal from 'break_eternity.js';
import { DC } from '@/core/constants';
import { Ordinal } from '@/lib/ordinal';
import PreOrdRes from '../resources/PreOrdRes';
import { OrdinalUtils } from '@/utils/ordinal';
import { temp } from '@/core/temp-data';

export default defineComponent({
	name: 'Resources',
	setup(props, ctx) {
		const $t = useI18n().t;

		return () => (
			<>
				<div class="resources" style="font-size: 20px" id="resources">
					<div class="background">
						{player.firstResetBit & 0b1000 ? (
							<>
								<Resource
									reskey="res.ordinal"
									resdisplay={(() => (
										<>
											{player.upgrades[61] &&
											player.hydra.deduceOrdinal[0].gte(
												'e3.773962424821541352e168',
											) ? (
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
									rescolor2={
										player.upgrades[61]
											? 'rgb(155,125,95)'
											: 'rgb(255, 127, 127)'
									}
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
														deduce: formatWhole(
															player.hydra.deduceOrdinal[0],
														),
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
								{/* <div style="margin-left: 15px" class="resource">
                            <div style="font-weight: bold; color: rgb(255, 63, 63)">
                                &nbsp;

                                <span
                                    v-html="
                                        Ordinal.displayOrdinalColored(
                                            player.ordinal.number.floor(),
                                            feature.Ordinal.base(),
                                        )
                                    "
                                    v-if="
                                        !(
                                            player.upgrades[61] &&
                                            player.hydra.deduceOrdinal[0].gte(
                                                'e3.773962424821541352e168',
                                            )
                                        )
                                    "
                                />
                                <vue-latex
                                    expression="
                                        Ordinal.displayOrdinalColored(
                                            player.ordinal.number.floor(),
                                            feature.Ordinal.base(),
                                        )
                                    "
                                />
                            </div> */}
								{/* // <div
                            //     style="font-size: 17px; color: rgb(255, 127, 127)"
                            //     v-if="!player.upgrades[61]"
                            // >
                            //     <span
                            //         v-html="
                            //             '(+' +
                            //             OrdinalUtils.numberToOrdinal(
                            //                 feature.resourceGain.ordinalNumber().value,
                            //                 feature.Ordinal.base(),
                            //             ) +
                            //             '/s)'
                            //         "
                            //     ></span>
                            // </div>
                            // <div
                            //     style="font-size: 17px; color: rgb(255, 127, 127)"
                            //     v-if="!player.upgrades[61] && feature.Ordinal.speedDeri().gt(0)"
                            // >
                            //     <span
                            //         v-html="
                            //             '(+' +
                            //             OrdinalUtils.numberToOrdinal(
                            //                 feature.Ordinal.speedDeri(),
                            //                 feature.Ordinal.base(),
                            //             ) +
                            //             '/s<sup>2</sup>)'
                            //         "
                            //     ></span>
                            // </div>
                            // <div
                            //     style="font-size: 17px; color: rgb(155, 125, 195)"
                            //     v-if="player.upgrades[61]"
                            // >
                            //     <span
                            //         v-html="
                            //             formatGain(temp.lastBMSDeduce, feature.Hydra.deduceSpeed(0))
                            //         "
                            //     ></span>
                            // </div>
                            // <div
                            //     style="font-size: 17px; color: rgb(155, 125, 195)"
                            //     v-if="player.upgrades[61]"
                            // >
                            //     ({{
                            //         $t('hydra.youhavededuced', {
                            //             deduce: formatWhole(player.hydra.deduceOrdinal[0]),
                            //         })
                            //     }})
                            // </div> */}
							</>
						) : (
							<PreOrdRes />
						)}
					</div>
				</div>
			</>
		);
	},
});
