<script setup lang="ts">
import { player, feature } from '@/core/global';
import { format, formatWhole, formatGain, formatTime, formatPercent } from '@/utils/format';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import TDBuyable from '../../group-2/TDBuyable.vue';
import { OrdinalUtils } from '@/utils/ordinal';
import Decimal from 'break_eternity.js';
import { Dilute } from '@/core/hydra/dilute';
import { Ordinal } from '@/lib/ordinal/';
import { temp } from '@/core/temp-data.ts';
import { PTEffects } from '@/core/pt';
import Baixie from '@/components/group-2/Baixie.vue';
import { Hydra } from '@/core/hydra/hydra';
import HydraDeduceOrdinal from '../hydra/HydraDeduceOrdinal.vue';

import { useI18n } from 'vue-i18n';

const $t = useI18n().t;

function powerFactorHTML(): string {
	let s = '';
	s += format(player.hydra.powerMult[0]);
	if (!feature.Hydra.powerExtraMult().eq(1))
		s +=
			' x <span style="color: rgb(155, 125, 195)">' +
			format(feature.Hydra.powerExtraMult()) +
			'</span>';
	if (!feature.Hydra.powerExp().eq(1))
		s = '(' + s + ')<sup>' + format(feature.Hydra.powerExp()) + '</sup>';
	if (!feature.Hydra.powerExpNerf().eq(1))
		s +=
			'<sup><span style="color: red"> x ' +
			format(feature.Hydra.powerExpNerf()) +
			'</span></sup>';
	const ft = feature.Hydra.powerGainBase();
	const nf = feature.Hydra.powerSoftcapNerf(ft);
	const nf2 = feature.Hydra.powerGainAfterSoftcap(ft);
	const nf3 = feature.Hydra.logSoftcapNerf(nf2);
	if (nf3.eq(1)) s += '<span style="color: var(--color)"> = ' + format(ft) + '</span>';
	if (!nf.eq(1)) {
		s += '<sup style="color: rgb(127, 0, 0)">' + format(nf) + '</sup>';
		if (feature.Hydra.logSoftcapNerf(nf2).eq(1))
			s += '<span style="color: var(--color)"> = ' + format(nf2) + '</span>';
	}
	if (!nf3.eq(1)) {
		s +=
			'<span style="color: var(--color)"> = ln<sup style="color: #c98300">' +
			format(nf3) +
			'</sup></span>';
		s += '<span style="color: var(--color)">(' + format(nf2) + ')</span>';
		s +=
			'<span style="color: var(--color)"> = ' +
			format(feature.Hydra.powerGainAfterSoftcap2(nf2)) +
			'</span>';
	}
	return s;
}

function autoResetButton() {
	return $t('hydra.autoreset', {
		status: $t(player.hydra.autoHydraReset ? 'set.status.on' : 'set.status.off'),
	});
}
</script>

<template>
	<div class="main" align="center">
		<div v-if="player.retribution >= 1">
			<span style="color: red; display: block; height: 50px"
				><h3>
					{{ $t('res.ordinal') }}
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
								player.hydra.deduceOrdinal[0].gte('e3.773962424821541352e168')
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
					/></h3
			></span>
			<span
				>{{
					$t('hydra.youhavededuced', {
						deduced: formatWhole(player.hydra.deduceOrdinal[0]),
					})
				}}<span v-html="formatGain(temp.lastBMSDeduce, feature.Hydra.deduceSpeed(0))"
			/></span>
			<div style="font-weight: bold; color: rgb(200, 190, 245)">
				{{ $t('res.hydra') }}&nbsp;
				<div style="display: inline; text-shadow: rgb(0, 20, 127) 1px 1px 2px">
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
						formatGain(player.hydra.power, feature.Hydra.hydraPowerPassiveGeneration())
					"
				/>
			</div>
		</div>
		<br />
		<h3 style="color: rgb(200, 190, 245)" v-html="powerFactorHTML()"></h3>
		<span v-if="PTEffects.effectToHydraEnergyLogSoftCap().gt(0)" class="corrupted_text"
			>九头蛇对数软上限已被减弱{{
				formatPercent(PTEffects.effectToHydraEnergyLogSoftCap().div(100))
			}}，实际软上限效果为/{{ format(Hydra.slogSoftcapEffect()) }}<Baixie
		/></span>
		<table style="width: 100%">
			<tbody>
				<tr>
					<td style="width: 50%">
						<HydraDeduceOrdinal />
					</td>
					<td>
						<button
							class="hydra-button-reset"
							@click="feature.Hydra.hydraReset(player.hydra.visiting)"
							v-hold="{
								handler: {
									onProgress() {
										feature.Hydra.hydraReset(player.hydra.visiting);
									},
								},
							}"
						>
							<span class="hydra-text">
								<h2 style="color: rgb(200, 190, 245)">{{ $t('hydra.reset') }}</h2>
								<h3 style="color: rgb(155, 125, 195)">
									+{{ format(feature.Hydra.powerGain())
									}}{{ $t('currency.hydra') }}
								</h3>
								<br />
								{{
									$t('hydra.currentresetmakesmu', {
										effect: format(
											feature.Hydra.deduceEff(player.hydra.visiting).mul(
												player.hydra.deduceOrdinal[player.hydra.visiting],
											),
										),
									})
								}}
							</span>
						</button>
					</td>
					<td style="width: 30px">
						<button
							class="hydra-button"
							@click="player.hydra.autoHydraReset = !player.hydra.autoHydraReset"
							v-html="autoResetButton()"
						></button>
					</td>
				</tr>
			</tbody>
		</table>
		<table style="width: 100%; transform: translateY(-40px)">
			<tbody>
				<tr>
					<td style="width: 25%">
						<button class="hydra-button-short" @click="feature.Hydra.prestige(0)">
							<span class="hydra-text-short">
								<span v-if="feature.Hydra.pUnlock(0)">
									<h3>
										{{ $t('hydra.prestiges.1') }}({{
											formatWhole(player.hydra.prestige[0])
										}})
									</h3>
									<span
										v-html="
											$t('hydra.prestiges.1.desc', {
												from: format(feature.Hydra.prestigeEff(0, false)),
												to: format(
													feature.Hydra.prestigeEff(0, true).max(
														feature.Hydra.prestigeEff(0, false),
													),
												),
												aft: format(
													feature.Hydra.prestigeEff(0, false, true).max(
														1,
													),
												),
											})
										"
									></span>
								</span>
								<span v-else>{{ $t('hydra.prestiges.1.lock') }}</span>
							</span>
						</button>
					</td>
					<td style="width: 25%">
						<button class="hydra-button-short" @click="feature.Hydra.prestige(1)">
							<span class="hydra-text-short">
								<span v-if="feature.Hydra.pUnlock(1)">
									<h3>
										{{ $t('hydra.prestiges.2') }}({{
											formatWhole(player.hydra.prestige[1])
										}})
									</h3>
									<span
										v-html="
											$t('hydra.prestiges.2.desc', {
												from: format(feature.Hydra.prestigeEff(1, false)),
												to: format(
													feature.Hydra.prestigeEff(1, true).max(
														feature.Hydra.prestigeEff(1, false),
													),
												),
											})
										"
									></span>
								</span>
								<span v-else>{{ $t('hydra.prestiges.2.lock') }}</span>
							</span>
						</button>
					</td>
					<td style="width: 25%">
						<button class="hydra-button-short" @click="feature.Hydra.prestige(2)">
							<span class="hydra-text-short">
								<span v-if="feature.Hydra.pUnlock(2)">
									<h3>
										{{ $t('hydra.prestiges.3') }}({{
											format(player.hydra.prestige[2])
										}})
									</h3>
									<span
										v-html="
											$t('hydra.prestiges.3.desc', {
												from: format(feature.Hydra.prestigeEff(2, false)),
												to: format(
													feature.Hydra.prestigeEff(2, true).max(
														feature.Hydra.prestigeEff(2, false),
													),
												),
											})
										"
									></span>
								</span>
								<span v-else>{{ $t('hydra.prestiges.3.lock') }}</span>
							</span>
						</button>
					</td>
					<td style="width: 25%">
						<button class="hydra-button-short" @click="feature.Hydra.prestige(3)">
							<span class="hydra-text-short">
								<span v-if="feature.Hydra.pUnlock(3)">
									<h3>
										{{ $t('hydra.prestiges.4') }}({{
											formatWhole(player.hydra.prestige[3])
										}})
									</h3>
									<span
										v-html="
											$t('hydra.prestiges.4.desc', {
												from: format(feature.Hydra.prestigeEff(3, false)),
												to: format(
													feature.Hydra.prestigeEff(3, true).max(
														feature.Hydra.prestigeEff(3, false),
													),
												),
											})
										"
									></span>
								</span>
								<span v-else>{{ $t('hydra.prestiges.4.lock') }}</span>
							</span>
						</button>
					</td>
				</tr>
				<tr style="transform: translateY(-100px)">
					<td style="width: 25%">
						<button
							class="hydra-button-sshort"
							:style="{
								'background-color': player.hydra.pAuto[0]
									? 'rgb(155, 125, 195)'
									: 'var(--background-color)',
							}"
							@click="player.hydra.pAuto[0] = !player.hydra.pAuto[0]"
						>
							<span class="hydra-text-short">
								<span v-if="feature.Hydra.pAutoUnlock(0)">
									{{
										$t('hydra.prestiges.auto.interval', {
											add: format(feature.Hydra.pAutoThreshold(0).add),
											mul: format(feature.Hydra.pAutoThreshold(0).mul),
										})
									}}
								</span>
								<span v-else>{{ $t('hydra.prestiges.1.auto') }}</span>
							</span>
						</button>
					</td>
					<td style="width: 25%">
						<button
							class="hydra-button-sshort"
							:style="{
								'background-color': player.hydra.pAuto[1]
									? 'rgb(155, 125, 195)'
									: 'var(--background-color)',
							}"
							@click="player.hydra.pAuto[1] = !player.hydra.pAuto[1]"
						>
							<span class="hydra-text-short">
								<span v-if="feature.Hydra.pAutoUnlock(1)">
									{{
										$t('hydra.prestiges.auto.interval', {
											add: format(feature.Hydra.pAutoThreshold(1).add),
											mul: format(feature.Hydra.pAutoThreshold(1).mul),
										})
									}}
								</span>
								<span v-else>{{ $t('hydra.prestiges.2.auto') }}</span>
							</span>
						</button>
					</td>
					<td style="width: 25%">
						<button
							class="hydra-button-sshort"
							:style="{
								'background-color': player.hydra.pAuto[2]
									? 'rgb(155, 125, 195)'
									: 'var(--background-color)',
							}"
							@click="player.hydra.pAuto[2] = !player.hydra.pAuto[2]"
						>
							<span class="hydra-text-short">
								<span v-if="feature.Hydra.pAutoUnlock(2)">
									{{
										$t('hydra.prestiges.auto.interval', {
											add: format(feature.Hydra.pAutoThreshold(2).add),
											mul: format(feature.Hydra.pAutoThreshold(2).mul),
										})
									}}
								</span>
								<span v-else>{{ $t('hydra.prestiges.auto') }}</span>
							</span>
						</button>
					</td>
					<td style="width: 25%">
						<button
							class="hydra-button-sshort"
							:style="{
								'background-color': player.hydra.pAuto[3]
									? 'rgb(155, 125, 195)'
									: 'var(--background-color)',
							}"
							@click="player.hydra.pAuto[3] = !player.hydra.pAuto[3]"
						>
							<span class="hydra-text-short">
								<span v-if="feature.Hydra.pAutoUnlock(3)">
									{{
										$t('hydra.prestiges.auto.interval', {
											add: format(feature.Hydra.pAutoThreshold(3).add),
											mul: format(feature.Hydra.pAutoThreshold(3).mul),
										})
									}}
								</span>
								<span v-else>{{ $t('hydra.prestiges.auto') }}</span>
							</span>
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<table style="transform: translateY(-220px)">
			<tbody>
				<tr>
					<TDUpgrade upgid="61" />
					<TDUpgrade upgid="62" />
					<TDUpgrade upgid="63" />
					<TDUpgrade upgid="64" />
				</tr>
				<tr
					v-if="
						player.retribution === 0 && (Dilute.diluteAmount(6) || player.upgrades[61])
					"
				>
					<TDUpgrade upgid="611" />
					<TDUpgrade upgid="612" />
					<TDUpgrade upgid="613" />
					<TDUpgrade upgid="614" />
				</tr>
				<tr
					v-if="
						player.retribution === 0 &&
						(Dilute.diluteAmount(6) ||
							(player.upgrades[61] && feature.Hydra.pUnlock(2)))
					"
				>
					<TDUpgrade upgid="615" />
					<TDUpgrade upgid="616" />
					<TDUpgrade upgid="617" />
					<TDUpgrade upgid="618" />
				</tr>
				<tr v-if="Dilute.diluteAmount(6) || player.upgrades[61]">
					<TDBuyable bylid="611" />
					<TDBuyable bylid="612" />
					<TDBuyable bylid="613" />
					<TDBuyable bylid="614" />
				</tr>
				<tr v-if="Dilute.diluteAmount(6) || player.upgrades[614]">
					<TDUpgrade upgid="65" />
					<TDUpgrade upgid="66" />
					<TDUpgrade upgid="6114" />
					<TDUpgrade upgid="6113" />
				</tr>
				<tr v-if="Dilute.diluteAmount(6) || player.upgrades[65]">
					<TDUpgrade upgid="619" />
					<TDUpgrade upgid="6110" />
					<TDUpgrade upgid="6111" />
					<TDUpgrade upgid="6112" />
				</tr>
			</tbody>
		</table>
		<!-- <convertBMStoMatrixComponent matrix="(1,3,4,2,5,8,10)(3,4)(1,5045)(333,2005890)" /> -->
	</div>
</template>
