<script setup lang="ts">
import { player, feature } from '@/core/global';
import { format, formatWhole } from '@/utils/format';
import TDUpgrade from '../TDUpgrade.vue';
import TDBuyable from '../TDBuyable.vue';
import { OrdinalUtils } from '@/utils/ordinal';
import Decimal from 'break_eternity.js';
import { Dilute } from '@/core/hydra/dilute';
import { onBeforeUnmount } from "vue"

function powerFactorHTML(): string {
	let s = '';
	s +=
		format(player.hydra.powerMult[0]) +
		' x ' +
		format(player.hydra.powerMult[1]) +
		' x ' +
		format(player.hydra.powerMult[2]) +
		' x ' +
		format(player.hydra.powerMult[3]);
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
	s +=
		'<span style="color: var(--color)"> = ' + format(feature.Hydra.powerGainBase()) + '</span>';
	if (!feature.Hydra.powerSoftcapNerf(feature.Hydra.powerGainBase()).eq(1)) {
		s +=
			'<sup style="color: rgb(127, 0, 0)">' +
			format(feature.Hydra.powerSoftcapNerf(feature.Hydra.powerGainBase())) +
			'</sup>';
		if (feature.Hydra.logSoftcapNerf(feature.Hydra.powerGainAfterSoftcap(feature.Hydra.powerGainBase())).eq(1)) s +=
			'<span style="color: var(--color)"> = ' +
			format(feature.Hydra.powerGainAfterSoftcap(feature.Hydra.powerGainBase())) +
			'</span>';
	}
	let softcapped = feature.Hydra.powerGainAfterSoftcap(feature.Hydra.powerGainBase())
	if (!feature.Hydra.logSoftcapNerf(softcapped).eq(1)) {
		s +=
			'<span style="color: var(--color)"> = ln<sup style="color: #c98300">' +
			format(feature.Hydra.logSoftcapNerf(softcapped)) +
			'</sup></span>';
		s +=
			'<span style="color: var(--color)">(' +
			format(feature.Hydra.powerGainAfterSoftcap(feature.Hydra.powerGainBase())) +
			')</span>';
		s +=
			'<span style="color: var(--color)"> = ' +
			format(feature.Hydra.powerGainAfterSoftcap2(softcapped)) +
			'</span>';
	}
	return s;
}

function deduceButtonStyle(): string {
	const pc = player.hydra.deduceProgress[player.hydra.visiting].mul(100).toNumber();
	return (
		'linear-gradient(to right, rgba(155, 125, 195, 0.5) ' +
		pc +
		'%, var(--background-color) ' +
		pc +
		'%)'
	);
}

function hydraMilestone(): any {
	const ms = feature.Hydra.hydraMilestone[player.hydra.visiting];
	let flag = -1;
	for (const i in ms) {
		if (player.hydra.deduceOrdinal[player.hydra.visiting].gte(ms[i][1])) flag++;
	}
	const reached = flag == -1 ? '\\text{暂未达成}' : ms[flag][0];
	const next = ms[flag + 1][0];
	const progress =
		'\\text{' +
		format(player.hydra.deduceOrdinal[player.hydra.visiting].div(ms[flag + 1][1]).mul(100)) +
		'}\\%';
	return { reached: reached, next: next, progress: progress };
}

function hydraMilestoneAxis(): any {
	const axis = [];
	const ms = feature.Hydra.hydraMilestone[player.hydra.visiting];
	const now = player.hydra.deduceOrdinal[player.hydra.visiting];
	let scale = 0;
	if (now.gte('1e6')) scale = 1;
	if (now.gte(4294967296)) scale = 2;
	for (const i in ms) {
		let left = 0;
		if (scale === 0) left = new Decimal(ms[i][1]).div(now).mul(50).toNumber();
		else if (scale === 1)
			left = new Decimal(ms[i][1])
				.max(10)
				.log10()
				.div(now.max(10).log10())
				.mul(50)
				.toNumber();
		else if (scale === 2)
			left = new Decimal(ms[i][1])
				.max(10)
				.log10()
				.log10()
				.div(now.max(10).log10().log10())
				.mul(100)
				.sub(50)
				.toNumber();
		left = Math.min(Math.max(left, 1), 99);
		if (left >= 10 && left <= 90) axis.push([ms[i][0], String(left) + '%']);
	}
	return axis;
}

function hydraAxisHTML(): string {
	let s = '';
	const axis = hydraMilestoneAxis();
	for (const i in axis) {
		s +=
			'<div style="font-size: 8px; position: absolute; top: 90%; left: ' +
			axis[i][1] +
			'; color: rgb(200, 190, 245); transform: translateY(-50%, -50%)"><vue-latex :expression="' +
			axis[i][0] +
			'" display-mode /></div>';
	}
	return s;
}
</script>

<template>
	<div class="main" align="center">
		<h3 style="color: rgb(200, 190, 245)" v-html="powerFactorHTML()"></h3>
		<table style="width: 100%">
			<tbody>
				<tr>
					<td style="width: 50%">
						<button
							v-if="feature.Hydra.deduceSpeed().lt(100)"
							class="hydra-button"
							:style="{ 'background-image': deduceButtonStyle() }"
						>
							<span v-if="feature.Hydra.deduceSpeed().gt(0)"
								class="hydra-text"
								style="opacity: 0.5; color: rgb(200, 190, 245); font-size: 60px"
								>{{
									feature.Hydra.deduceSpeed().gte(1)
										? format(feature.Hydra.deduceSpeed()) + '/s'
										: '1/' + format(feature.Hydra.deduceSpeed().recip()) + 's'
								}}</span
							>
							<span class="hydra-text">
								<span v-html="
									OrdinalUtils.numberToBMS(
										player.hydra.deduceOrdinal[0],
										new Decimal(4),
									)
								" />
							</span>
							<span
								class="hydra-text-bottom"
								style="color: rgb(155, 125, 195); font-size: 12px"
							>
								<div style="transform: scale(0.75)">
									<vue-latex
										:expression="
											'milestone:' +
											hydraMilestone().reached +
											',next:' +
											hydraMilestone().next +
											'(' +
											hydraMilestone().progress +
											')'
										"
										display-mode
									/>
								</div>
							</span>
							<div class="hydra-axis-line"></div>
							<div v-for="i in hydraMilestoneAxis()">
								<div class="hydra-axis-element" :style="'left: ' + i[1]">
									<vue-latex :expression="i[0]" display-mode />
								</div>
							</div>
							<div class="hydra-axis-element" style="left: 50%; top: 88%">♦</div>
						</button>
						<button v-else class="hydra-button fast" style="position: relative">
							<span
								class="hydra-text"
								style="opacity: 0.5; color: rgb(200, 190, 245); font-size: 60px"
								>{{ format(feature.Hydra.deduceSpeed()) }}/s</span
							>
							<span class="hydra-text">
								<span v-html="
									OrdinalUtils.numberToBMS(
										player.hydra.deduceOrdinal[0],
										new Decimal(4),
									)
								" />
							</span>
							<span
								class="hydra-text-bottom"
								style="color: rgb(155, 125, 195); font-size: 12px"
							>
								<div style="transform: scale(0.75)">
									<vue-latex
										:expression="
											'milestone:' +
											hydraMilestone().reached +
											',next:' +
											hydraMilestone().next +
											'(' +
											hydraMilestone().progress +
											')'
										"
										display-mode
									/>
								</div>
							</span>
							<div class="hydra-axis-line"></div>
							<div v-for="i in hydraMilestoneAxis()">
								<div class="hydra-axis-element" :style="'left: ' + i[1]">
									<vue-latex :expression="i[0]" display-mode />
								</div>
							</div>
							<div class="hydra-axis-element" style="left: 50%; top: 88%">♦</div>
						</button>
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
								<h2 style="color: rgb(200, 190, 245)">重置</h2>
								<h3 style="color: rgb(155, 125, 195)">
									+{{ format(feature.Hydra.powerGain()) }}九头蛇能量
								</h3>
								<br />
								当前重置使乘数+{{
									format(
										feature.Hydra.deduceEff(player.hydra.visiting).mul(
											player.hydra.deduceOrdinal[player.hydra.visiting],
										),
									)
								}}
							</span>
						</button>
					</td>
					<td style="width: 30px">
						<button
							class="hydra-button"
							@click="player.hydra.autoHydraReset = !player.hydra.autoHydraReset"

						>
						  自<br>动<br>重<br>置<br>:<br>{{player.hydra.autoHydraReset?"开":"关"}}
						</button>
					</td>
				</tr>
			</tbody>
		</table>
		<table style="width: 100%; transform: translateY(-40px)">
			<tr>
				<td style="width: 25%">
					<button class="hydra-button-short" @click="feature.Hydra.prestige(0)">
						<span class="hydra-text-short">
							<span v-if="feature.Hydra.pUnlock(0)">
								<h3>转生({{ formatWhole(player.hydra.prestige[0]) }})</h3>
								额外乘数与推演速度<br />x{{
									format(feature.Hydra.prestigeEff(0, false))
								}}→{{
									format(
										feature.Hydra.prestigeEff(0, true).max(
											feature.Hydra.prestigeEff(0, false),
										),
									)
								}}(效果×{{
									format(feature.Hydra.prestigeEff(0, false, true).max(1))
								}})
							</span>
							<span v-else>基础乘数≥2解锁</span>
						</span>
					</button>
				</td>
				<td style="width: 25%">
					<button class="hydra-button-short" @click="feature.Hydra.prestige(1)">
						<span class="hydra-text-short">
							<span v-if="feature.Hydra.pUnlock(1)">
								<h3>飞升({{ formatWhole(player.hydra.prestige[1]) }})</h3>
								额外指数<br />+{{ format(feature.Hydra.prestigeEff(1, false)) }}→{{
									format(
										feature.Hydra.prestigeEff(1, true).max(
											feature.Hydra.prestigeEff(1, false),
										),
									)
								}}
							</span>
							<span v-else>转生效果≥20解锁</span>
						</span>
					</button>
				</td>
				<td style="width: 25%">
					<button class="hydra-button-short" @click="feature.Hydra.prestige(2)">
						<span class="hydra-text-short">
							<span v-if="feature.Hydra.pUnlock(2)">
								<h3>超越({{ format(player.hydra.prestige[2]) }})</h3>
								乘数获取<br />x{{ format(feature.Hydra.prestigeEff(2, false)) }}→{{
									format(
										feature.Hydra.prestigeEff(2, true).max(
											feature.Hydra.prestigeEff(2, false),
										),
									)
								}}
							</span>
							<span v-else>飞升效果≥1解锁</span>
						</span>
					</button>
				</td>
				<td style="width: 25%">
					<button class="hydra-button-short" @click="feature.Hydra.prestige(3)">
						<span class="hydra-text-short">
							<span v-if="feature.Hydra.pUnlock(3)">
								<h3>轮回({{ formatWhole(player.hydra.prestige[3]) }})</h3>
								转生、超越效果指数<br />x+{{
									format(feature.Hydra.prestigeEff(3, false))
								}}→{{
									format(
										feature.Hydra.prestigeEff(3, true).max(
											feature.Hydra.prestigeEff(3, false),
										),
									)
								}}
							</span>
							<span v-else>超越效果≥1e10解锁</span>
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
								自动重置阈值：+{{ format(feature.Hydra.pAutoThreshold(0).add) }} &
								x{{ format(feature.Hydra.pAutoThreshold(0).mul) }}
							</span>
							<span v-else>首次超越解锁自动化</span>
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
								自动重置阈值：+{{ format(feature.Hydra.pAutoThreshold(1).add) }} &
								x{{ format(feature.Hydra.pAutoThreshold(1).mul) }}
							</span>
							<span v-else>首次轮回解锁自动化</span>
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
								自动重置阈值：+{{ format(feature.Hydra.pAutoThreshold(2).add) }} &
								x{{ format(feature.Hydra.pAutoThreshold(2).mul) }}
							</span>
							<span v-else>暂时无法自动化</span>
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
								自动重置阈值：+{{ format(feature.Hydra.pAutoThreshold(3).add) }} &
								x{{ format(feature.Hydra.pAutoThreshold(3).mul) }}
							</span>
							<span v-else>暂时无法自动化</span>
						</span>
					</button>
				</td>
			</tr>
		</table>
		<table style="transform: translateY(-220px)">
			<tr>
				<TDUpgrade upgid="61" />
				<TDUpgrade upgid="62" />
				<TDUpgrade upgid="63" />
				<TDUpgrade upgid="64" />
			</tr>
			<tr v-if="Dilute.diluteAmount(6) || player.upgrades[61]">
				<TDUpgrade upgid="611" />
				<TDUpgrade upgid="612" />
				<TDUpgrade upgid="613" />
				<TDUpgrade upgid="614" />
			</tr>
			<tr v-if="Dilute.diluteAmount(6) || player.upgrades[61] && feature.Hydra.pUnlock(2)">
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
		</table>
	</div>
</template>

<style scoped lang="scss">
.hydra-button,
.hydra-button-reset {
	background-color: var(--background-color);
	color: var(--color);
	height: 250px;
	width: 100%;
	border: 2px solid rgb(200, 190, 245);
	position: relative;
	z-index: 1;
}

.hydra-button {
	&.fast {
		position: relative;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			background: linear-gradient(
				-45deg,
				rgba(155, 125, 195, 0.3) 0,
				rgba(155, 125, 195, 0.3) 25%,
				rgba(155, 125, 195, 0.5) 25%,
				rgba(155, 125, 195, 0.5) 50%,
				rgba(155, 125, 195, 0.3) 50%,
				rgba(155, 125, 195, 0.3) 75%,
				rgba(155, 125, 195, 0.5) 75%,
				rgba(155, 125, 195, 0.5)
			);
			top: 0px;
			left: 0px;
			right: 0px;
			bottom: 0px;
			background-size: 100px 100px;
			background-repeat: repeat;
			animation: scroll_left 1s linear infinite;
			width: 200%;
		}
	}
}

@keyframes scroll_left {
	0% {
		transform: translateX(0%);
	}
	100% {
		transform: translateX(-50%);
	}
}

.hydra-button-short {
	background-color: var(--background-color);
	color: var(--color);
	height: 100px;
	width: 100%;
	border: 2px solid rgb(200, 190, 245);
	position: relative;
	z-index: 1;
}

.hydra-button-sshort {
	background-color: var(--background-color);
	color: var(--color);
	height: 50px;
	width: 100%;
	border: 2px solid rgb(200, 190, 245);
	position: relative;
	z-index: 1;
}

.hydra-button-reset:hover {
	cursor: pointer;
	border: 7px solid rgb(200, 190, 245);
}
.hydra-button-short:hover {
	cursor: pointer;
	border: 4px solid rgb(200, 190, 245);
}
.hydra-button-sshort:hover {
	cursor: pointer;
	border: 4px solid rgb(200, 190, 245);
}
.hydra-text {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 20px;
}
.hydra-text-short {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 14px;
}
.hydra-text-bottom {
	position: absolute;
	top: 80%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 7px;
}
.hydra-axis-line {
	position: absolute;
	top: 90%;
	width: 100%;
	height: 1px;
	background-color: rgb(200, 195, 245);
}
.hydra-axis-element {
	position: absolute;
	top: 93%;
	left: 50%;
	transform: translate(-50%, -50%) scale(0.5);
}
</style>
