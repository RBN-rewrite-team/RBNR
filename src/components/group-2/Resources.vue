<script setup lang="ts">
import { formatWhole, formatGain } from '@/utils/format';
import { player } from '@/core/save';
import { feature } from '@/core/global';
import { OrdinalUtils } from '@/utils/ordinal';
import Decimal from 'break_eternity.js';
import { Ordinal } from '@/lib/ordinal/';
import { format } from '@/utils/format';
import { temp } from '../../core/temp-data.ts';
import { getCurrentOrdinal } from '../../utils/y-seq.ts';
import { Garden } from '@/core/pt/garden.ts';
</script>
<template>
	<div>
		<div class="resources" style="font-size: 20px" id="resources">
			<div class="background">
				<div v-if="player.currentTab === 31">
					<div class="resource" style="margin-left: 15px">
						<div style="font-weight: bold; color: yellow">
							{{ $t('currency.想法') }}&nbsp;
							{{ format(player.garden.idea, 6) }}
						</div>
					</div>
					<div class="resource" style="margin-left: 350px">
						<div style="font-weight: bold; color: purple">
							{{ $t('currency.熵') }}&nbsp;
							{{ format(player.garden.entropy, 6) }}
						</div>
						<br />
						<div style="font-size: 14px; color: purple">
							{{
								$t('garden.entropydebuff', {
									effect: format(Garden.entropyEffect(), 7),
								})
							}}
						</div>
					</div>
					<div class="resource" style="margin-left: 685px">
						<div style="font-weight: bold; color: orange">
							{{ $t('currency.灵感') }}&nbsp;
							{{ format(player.garden.inspiration) }}
						</div>
					</div>
				</div>
				<div v-else>
					<div v-if="player.retribution == 0">
						<div
							v-if="!(player.firstResetBit & 0b1000)"
							style="margin-left: 15px"
							class="resource"
						>
							<div style="font-weight: bold; color: var(--suptitle-color)">
								{{ $t('res.number') }}&nbsp;
								<template v-if="player.singularity.t > 666.6666666">ω</template>
								<template v-else>{{ formatWhole(player.number) }}</template>
							</div>
							<div
								style="font-size: 17px; color: var(--title-color)"
								v-if="player.singularity.t < 666"
							>
								<span
									v-if="
										player.singularity.stage < 11 &&
										feature.SUCCESSOR.autoSuccessPerSecond().eq(0)
									"
									>{{ $t('res.number.required') }}</span
								>
								<span
									v-else
									v-html="
										formatGain(
											player.number,
											feature.resourceGain.number().value,
											'',
										)
									"
								></span
								>({{ formatWhole(player.totalNumber) }})
								<br />
								<span v-if="feature.resourceGain.number().softcaps > 0">
									{{
										$t('res.softcapped', {
											amount: feature.resourceGain
												.number()
												.softcaps.toString(),
										})
									}}
								</span>
							</div>
						</div>
						<div style="margin-left: 15px" class="resource" v-else>
							<div style="font-weight: bold; color: rgb(255, 63, 63)">
								{{ $t('res.ordinal') }}&nbsp;
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
									:expression="
										Ordinal.displayOrdinalColored(
											player.ordinal.number.floor(),
											feature.Ordinal.base(),
										)
									"
									v-else
								/>
							</div>
							<div
								style="font-size: 17px; color: rgb(255, 127, 127)"
								v-if="!player.upgrades[61]"
							>
								<span
									v-html="
										'(+' +
										OrdinalUtils.numberToOrdinal(
											feature.resourceGain.ordinalNumber().value,
											feature.Ordinal.base(),
										) +
										'/s)'
									"
								></span>
							</div>
							<div
								style="font-size: 17px; color: rgb(255, 127, 127)"
								v-if="!player.upgrades[61] && feature.Ordinal.speedDeri().gt(0)"
							>
								<span
									v-html="
										'(+' +
										OrdinalUtils.numberToOrdinal(
											feature.Ordinal.speedDeri(),
											feature.Ordinal.base(),
										) +
										'/s<sup>2</sup>)'
									"
								></span>
							</div>
							<div
								style="font-size: 17px; color: rgb(155, 125, 195)"
								v-if="player.upgrades[61]"
							>
								<span
									v-html="
										formatGain(temp.lastBMSDeduce, feature.Hydra.deduceSpeed(0))
									"
								></span>
							</div>
							<div
								style="font-size: 17px; color: rgb(155, 125, 195)"
								v-if="player.upgrades[61]"
							>
								({{
									$t('hydra.youhavededuced', {
										deduce: formatWhole(player.hydra.deduceOrdinal[0]),
									})
								}})
							</div>
						</div>
						<div
							style="margin-left: 265px"
							class="resource"
							id="showMP"
							v-if="
								(player.upgrades[13] || player.exponention.logarithm.in_dilate) &&
								player.singularity.stage < 10
							"
						>
							<div style="font-weight: bold; color: #009dd9">
								{{ $t('res.addpower') }}&nbsp;
								<div style="display: inline; text-shadow: #5acaff 1px 1px 2px">
									{{ formatWhole(player.addpower) }}
								</div>
							</div>
							<div style="font-size: 17px; color: #5acaff">
								<span v-if="feature.resourceGain.addpower().passive.eq(0)">
									(+{{ formatWhole(feature.resourceGain.addpower().value) }})
								</span>
								<span v-else>
									<span
										v-html="
											formatGain(
												player.addpower,
												feature.resourceGain
													.addpower()
													.passive.mul(
														feature.resourceGain.addpower().value,
													),
											)
										"
									/>
								</span>
								(!{{ formatWhole(player.totalAddpower) }})
								<br />
								<span v-if="feature.resourceGain.addpower().softcaps > 0">
									{{
										$t('res.softcapped', {
											amount: feature.resourceGain
												.addpower()
												.softcaps.toString(),
										})
									}}
								</span>
							</div>
						</div>
						<div
							style="margin-left: 515px"
							class="resource"
							v-if="
								(player.upgrades[26] || player.exponention.logarithm.in_dilate) &&
								player.singularity.stage < 9
							"
						>
							<div style="font-weight: bold; color: #cc33ff">
								{{ $t('res.mulpower') }}&nbsp;
								<div style="display: inline; text-shadow: #dd77dd 1px 1px 2px">
									{{ formatWhole(player.multiplication.mulpower) }}
								</div>
							</div>
							<div style="font-size: 17px; color: #cc33ff">
								<span v-if="feature.resourceGain.mulpower().passive.eq(0)">
									(+{{ formatWhole(feature.resourceGain.mulpower().value) }})
								</span>
								<span v-else>
									<span
										v-html="
											formatGain(
												player.multiplication.mulpower,
												feature.resourceGain
													.mulpower()
													.passive.mul(
														feature.resourceGain.mulpower().value,
													),
											)
										"
									/>
								</span>
								(!{{ formatWhole(player.multiplication.totalMulpower) }})
								<br />
								<span v-if="feature.resourceGain.mulpower().softcaps > 0">
									{{
										$t('res.softcapped', {
											amount: feature.resourceGain
												.mulpower()
												.softcaps.toString(),
										})
									}}
								</span>
							</div>
						</div>
						<div
							style="margin-left: 755px"
							class="resource"
							v-if="
								player.singularity.stage < 4 &&
								player.stat.highestMulpower.gte(new Decimal(2).pow(1024))
							"
						>
							<div style="font-weight: bold; color: rgb(127, 127, 255)">
								{{ $t('res.exppower') }}&nbsp;
								<div
									style="
										display: inline;
										text-shadow: rgb(0, 20, 127) 1px 1px 2px;
									"
								>
									{{ formatWhole(player.exponention.exppower) }}
								</div>
							</div>
							<div style="font-size: 17px; color: rgb(63, 63, 127)">
								<span v-if="feature.resourceGain.exppower().passive.eq(0)">
									(+{{ formatWhole(feature.resourceGain.exppower().value) }})
								</span>
								<span v-else>
									{{
										formatGain(
											player.exponention.exppower,
											feature.resourceGain
												.exppower()
												.passive.mul(feature.resourceGain.exppower().value),
										)
									}}
								</span>
								(!{{ formatWhole(player.exponention.totalExppower) }})
							</div>
						</div>
						<div
							style="margin-left: 365px"
							class="resource"
							v-if="player.upgrades[517]"
						>
							<div style="font-weight: bold; color: rgb(200, 190, 245)">
								{{ $t('res.hydra') }}&nbsp;
								<div
									style="
										display: inline;
										text-shadow: rgb(0, 20, 127) 1px 1px 2px;
									"
								>
									{{ formatWhole(player.hydra.power) }}
								</div>
								<br />
							</div>
							<div
								v-if="feature.Hydra.hydraPowerPassiveGeneration().gt(0)"
								style="font-size: 17px; display: inline; color: rgb(200, 190, 245)"
							>
								<span
									v-html="
										formatGain(
											player.hydra.power,
											feature.Hydra.hydraPowerPassiveGeneration(),
										)
									"
								/>
							</div>
						</div>
						<div
							style="margin-left: 685px"
							class="resource"
							v-if="player.upgrades['616S']"
						>
							<div style="font-weight: bold; color: rgb(201, 131, 0)">
								{{ $t('currency.非递归能量') }}&nbsp;
								<div
									style="
										display: inline;
										text-shadow: rgb(201, 131, 0) 1px 1px 2px;
									"
								>
									{{ formatWhole(player.nonrecu.power) }}
								</div>
								<br />
								<div
									v-if="true"
									style="
										font-size: 17px;
										display: inline;
										color: rgb(245, 193, 73);
									"
								>
									(+{{ formatWhole(feature.NON_RECURSIVE.gain()) }})
								</div>
							</div>
						</div>
					</div>
					<div class="resource" style="margin-left: 15px" v-if="player.retribution == 1">
						<div style="font-weight: bold; color: #5d8aa8">
							{{ $t('tab.ordinal') }}&nbsp;
							<vue-latex
								:expression="getCurrentOrdinal(player.hydra.deduceOrdinal[1])"
							/>
						</div>
					</div>
					<div class="resource" style="margin-left: 350px" v-if="player.retribution == 1">
						<div style="font-weight: bold; color: #007f00">
							{{ $t('res.compress') }}&nbsp;
							{{ formatWhole(player.hydra.compressedPower) }}
						</div>
					</div>
					<div style="margin-left: 685px" class="resource" v-if="player.upgrades['616S']">
						<div style="font-weight: bold; color: rgb(201, 131, 0)">
							{{ $t('currency.非递归能量') }}&nbsp;
							<div style="display: inline; text-shadow: rgb(201, 131, 0) 1px 1px 2px">
								{{ formatWhole(player.nonrecu.power) }}
							</div>
							<br />
							<div
								v-if="true"
								style="font-size: 17px; display: inline; color: rgb(245, 193, 73)"
							>
								(+{{ formatWhole(feature.NON_RECURSIVE.gain()) }})
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.resource {
	position: absolute;
	margin-top: 5px;
}
.background {
	width: 100%;
	overflow: auto;
}
* {
	white-space: nowrap;
}
</style>
