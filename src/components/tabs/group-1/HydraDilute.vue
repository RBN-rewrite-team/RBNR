<script lang="ts" setup>
import { player } from '../../../core/global.ts';
import { format, formatWhole, formatTime } from '@/utils/format';
import Slider from '../../group-2/Slider.vue';
import { Dilute, DiluteTS, tsbhBase } from '@/core/hydra/dilute.ts';
import { computed, ref } from 'vue';
import TDUpgrade from '../../group-2/TDUpgrade.vue';
import TRMilestone from '../../group-2/TRMilestone.vue';
import { Currencies, getCurrency } from '@/core/currencies.ts';
import { CHALLENGE } from '@/core/challenge.ts';
import { useI18n } from 'vue-i18n';

function getCurrentSolution() {
	return player.hydra.dilute.solution;
}

function getSliderProps(id = 0) {
	return {
		min: id == 0 || id == 6 ? 0 : Math.min(minS1Level(), 9),
		max: 10,
		width: '24rem',
		valueInDot: true,
		tooltip: 'never',
		'dot-width': '2.2rem',
		'dot-height': '1.6rem',
		'dot-class': 'slider-dot-class-dilute',
		'process-class': 'slider-process-class-dilute',
		interval:
			id == 6 && !CHALLENGE.inChallenge(1, 2) ? (player.milestones.dut11 ? 0.25 : 0.5) : 1,
		style: {
			'margin-top': '1rem',
		},
		plusMinusButtons: true,
	};
}

const sliderProps2 = {
	min: 0,
	max: 1,
	width: '24rem',
	valueInDot: true,
	tooltip: 'never',
	'dot-width': '2.2rem',
	'dot-height': '1.6rem',
	'dot-class': 'slider-dot-class-dilute',
	'process-class': 'slider-process-class-dilute',
	style: {
		'margin-top': '1rem',
	},
};

const canChangeLevel = computed(() => {
	return player.hydra.dilute.inDilute || player.hydra.dilute.solvent[8];
});

function switchSolvent9(event: number) {
	player.hydra.dilute.solvent[8] = !!event;
	if (event == 1) {
		for (let i = 0; i < 6; i++) player.hydra.dilute.solvent[i] = 10;
		for (let i = 6; i < 9; i++) player.hydra.dilute.solvent[i] = true;
	}
}

const refreshKey = ref(0);

function minS1Level() {
	if (player.hydra.dilute.solvent[6] || player.hydra.dilute.solvent[7]) return 10;
	return Math.max(
		Math.floor(player.hydra.dilute.solvent[1] / 2),
		Math.floor(player.hydra.dilute.solvent[2] / 2),
		player.hydra.dilute.solvent[3],
		player.hydra.dilute.solvent[4],
		player.hydra.dilute.solvent[5],
	);
}

function fixS1() {
	if (minS1Level() == 10) player.hydra.dilute.solvent[0] = 10;
	player.hydra.dilute.solvent[0] = Math.max(minS1Level(), player.hydra.dilute.solvent[0]);
}

setInterval(function () {
	refreshKey.value++;
}, 40);

function addPreset() {
	player.hydra.dilute.solventPresets.push(
		Array.from(player.hydra.dilute.solvent) as typeof player.hydra.dilute.solvent,
	);
}
function setPreset(preset: typeof player.hydra.dilute.solvent) {
	if (!player.hydra.dilute.inDilute)
		player.hydra.dilute.solvent = Array.from(preset) as typeof player.hydra.dilute.solvent;
}
function delPreset(preset: string) {
	player.hydra.dilute.solventPresets.splice(Number(preset), 1);
}
const $t = useI18n().t;
function res1() {
	return $t('dil.res1', {
		res: `<b style="color: red; font-size: 30px">${format(getCurrentSolution())}</b>`,
		res2: player.hydra.dilute.inDilute ? $t('dil.res1.a', { res: Dilute.solutionGain() }) : '',
		effect: format(Dilute.solutionEff().eff1),
	});
}
function prionRes() {
	return $t('dil.prion', {
		res: `<b style="color: red; font-size: 30px">${format(Dilute.prions())}</b>`,
		res2: player.upgrades['69S'] ? '' : `/${format(player.hydra.totalDeduceOrdinal[0])}`,
	});
}
</script>

<template :key="refreshKey">
	<span v-html="res1()"></span>
	<template v-if="player.upgrades[74]">, ^{{ format(Dilute.solutionEff().eff2) }}</template
	><br />
	<span v-if="player.upgrades['69S'] || player.hydra.dilute.prions.gt(1)">
		<span v-html="prionRes()"></span>
		<br />
		<br />
	</span>
	<div v-if="!player.upgrades['614S'] || CHALLENGE.inChallenge(1, 2)">
		{{
			(() => {
				let a = Dilute.sol3EffOutside().sub(player.hydra.dilute.spentTime);

				return $t('dil.selfdes', {
					result: $t(
						!a.isFinite()
							? Dilute.diluteAmountOutside(4)
								? 'dil.selfdes.possible'
								: 'dil.selfdes.impossible'
							: 'dil.selfdes.aftertime',
						{
							time: formatTime(a),
						},
					),
				});
			})()
		}}<br />
	</div>
	{{ $t('dil.limitsol1') }}<br />
	{{
		$t('dil.solutioncap', {
			cap: format(Dilute.solutionGain(true)),
		})
	}}<br />
	<div class="container" style="transform: translateY(-10px)">
		<div class="dilute">
			<div>{{ $t('dil.least1') }}</div>
			<div>
				<button class="dilute-button" @click="Dilute.diluteButton">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
						<path
							fill="red"
							d="M292 76.6C292 68.3 284.4 62.1 276.5 64.5C215.6 83.3 171.4 140.3 171.4 207.6C171.4 232.7 177.5 256.3 188.4 277.1C167.4 278.9 146.4 285.3 126.9 296.6C69 330.2 42.1 396.8 56 459.1C57.9 467.5 67.4 471.1 74.9 466.7C79.9 463.8 82.5 458.1 82 452.3C81.7 449 81.6 445.7 81.6 442.2C81.6 318.7 266 318.7 266 442.2C266 530.6 171.5 555.8 117.8 517.6C113.3 514.4 107.3 513.7 102.5 516.5C95.5 520.6 93.9 530.1 99.8 535.6C146.4 579.4 217.8 589.5 275.9 555.8C293.8 545.4 308.7 531.9 320.4 516.4C332.1 532 347 545.5 364.9 555.8C423 589.5 494.4 579.4 541 535.6C546.9 530.1 545.3 520.5 538.3 516.5C533.5 513.7 527.5 514.4 523 517.6C469.3 555.8 374.8 530.6 374.8 442.2C374.8 318.7 559.2 318.7 559.2 442.2C559.2 445.6 559.1 449 558.8 452.3C558.3 458.1 560.9 463.8 565.9 466.7C573.3 471 582.9 467.5 584.8 459.1C598.7 396.9 571.8 330.2 513.9 296.6C494.4 285.3 473.5 278.9 452.4 277.1C463.3 256.3 469.4 232.7 469.4 207.6C469.4 140.3 425.2 83.3 364.3 64.5C356.4 62.1 348.8 68.3 348.8 76.6C348.8 82.5 352.8 87.6 358.3 89.8C441.7 123.4 429.1 268.2 320.5 268.2C211.9 268.2 199.1 123.4 282.5 89.8C288 87.6 292 82.5 292 76.6zM280.4 352C280.4 329.9 298.3 312 320.4 312C342.5 312 360.4 329.9 360.4 352C360.4 374.1 342.5 392 320.4 392C298.3 392 280.4 374.1 280.4 352zM467 381.7C450.8 381.7 435.6 387.2 424.9 396.7C414.8 405.8 406.8 420.1 406.8 442.3C406.8 463.4 414 477.3 423.3 486.4C455.5 461.8 478.8 425.9 487.2 384.6C480.9 382.7 474 381.6 467 381.6zM234 442.3C234 420 226 405.7 215.9 396.7C205.2 387.1 190 381.7 173.8 381.7C166.8 381.7 159.9 382.7 153.6 384.7C162 426 185.2 461.9 217.5 486.5C226.9 477.4 234 463.4 234 442.3zM275.2 218C284.2 228.2 298.4 236.2 320.4 236.2C342.4 236.2 356.6 228.2 365.6 218C372.3 210.4 377.1 200.5 379.2 189.6C360.9 182.8 341 179.1 320.4 179.1C299.8 179.1 279.9 182.8 261.6 189.6C263.8 200.5 268.5 210.4 275.2 218.1z"
						/>
					</svg>
				</button>
			</div>
			<div
				v-html="
					$t('dil.left', {
						a: JSON.stringify(player.hydra.dilute.lastSolvent.map(Number)),
						b: formatWhole(player.hydra.dilute.lastDeduce),
						c: format(player.hydra.dilute.solution),
						d: format(getCurrency(Currencies.SOLUTION)),
					})
				"
			></div>
		</div>
		<div class="solvents">
			<span v-html="$t('dil.solvdebuff', { a: format(Dilute.totSolNerf()) })"></span>
			<table>
				<tbody>
					<tr>
						<td>
							<div class="solvent" style="border-color: rgb(255, 0, 0)">
								<div>
									<div>{{ $t('dil.1') }}</div>
									<div class="solvent-desc-small">
										{{ $t('dil.1.desc') }}
									</div>
									<div
										v-html="
											$t('dil.1.eff', {
												eff: tsbhBase() ** Dilute.diluteAmountOutside(0),
											})
										"
									></div>
									<Slider
										v-bind="getSliderProps(1)"
										:value="player.hydra.dilute.solvent[0]"
										:width="'100%'"
										:disabled="minS1Level() == 10 || canChangeLevel"
										@input="
											player.hydra.dilute.solvent[0] = Math.max(
												$event,
												minS1Level(),
											);
											fixS1();
										"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(255, 0, 0)">
								<div>
									<div>{{ $t('dil.2') }}</div>
									<div class="solvent-desc-small">{{ $t('dil.2.desc') }}</div>
									<div
										v-html="
											$t('dil.2.eff', {
												eff: format(
													4 - 3 * 0.75 ** Dilute.diluteAmountOutside(1),
												),
											})
										"
									></div>
									<Slider
										v-bind="getSliderProps()"
										:value="player.hydra.dilute.solvent[1]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="
											player.hydra.dilute.solvent[1] = $event;
											fixS1();
										"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(255, 0, 0)">
								<div>
									<div>{{ $t('dil.3') }}</div>
									<div class="solvent-desc-small">
										{{ $t('dil.3.desc') }}
									</div>
									<div>
										{{
											$t('dil.3.eff', {
												eff: (() => {
													let a = Dilute.sol3EffOutside();
													return formatTime(a);
												})(),
											})
										}}
									</div>
									<Slider
										v-bind="getSliderProps()"
										:value="player.hydra.dilute.solvent[2]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="
											player.hydra.dilute.solvent[2] = $event;
											fixS1();
										"
									/>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="solvent" style="border-color: rgb(127, 0, 0)">
								<div>
									<div>{{ $t('dil.4') }}</div>
									<div class="solvent-desc-small">
										{{ $t('dil.4.desc') }}
									</div>
									<div>{{ $t('dil.4.eff') }}</div>
									<Slider
										v-bind="getSliderProps()"
										:value="player.hydra.dilute.solvent[3]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="
											player.hydra.dilute.solvent[3] = $event;
											fixS1();
										"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(127, 0, 0)">
								<div>
									<div>{{ $t('dil.5') }}</div>
									<div class="solvent-desc-small">{{ $t('dil.5.desc') }}</div>
									<div
										style="font-size: 60%"
										v-html="
											$t('dil.5.eff', {
												gen: (
													1 +
													Dilute.diluteAmountOutside(4) / 100
												).toFixed(4),
											})
										"
									></div>
									<Slider
										v-bind="getSliderProps()"
										:value="player.hydra.dilute.solvent[4]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="
											player.hydra.dilute.solvent[4] = $event;
											fixS1();
										"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(127, 0, 0)">
								<div>
									<div>{{ $t('dil.6') }}</div>
									<div class="solvent-desc-small">
										{{ $t('dil.6.desc') }}
									</div>
									<div
										v-html="
											$t('dil.6.eff', {
												eff: DiluteTS.dilute6().toFixed(2),
											})
										"
									></div>
									<Slider
										v-bind="getSliderProps(6)"
										:value="player.hydra.dilute.solvent[5]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="
											player.hydra.dilute.solvent[5] = $event;
											fixS1();
										"
									/>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="solvent" style="border-color: rgb(63, 0, 63)">
								<div>
									<div>{{ $t('dil.7') }}</div>
									<div class="solvent-desc-small">
										{{ $t('dil.7.desc') }}
									</div>
									<div>{{ $t('dil.7.eff') }}</div>
									<Slider
										v-bind="sliderProps2"
										:value="Number(player.hydra.dilute.solvent[6])"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="
											player.hydra.dilute.solvent[6] = !!$event;
											fixS1();
										"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(63, 0, 63)">
								<div>
									<div>{{ $t('dil.8') }}</div>
									<div class="solvent-desc-small">
										{{ $t('dil.8.desc') }}
									</div>
									<div>{{ $t('dil.8.eff') }}</div>
									<Slider
										v-bind="sliderProps2"
										:value="Number(player.hydra.dilute.solvent[7])"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="
											player.hydra.dilute.solvent[7] = !!$event;
											fixS1();
										"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(63, 0, 63)">
								<div>
									<div>{{ $t('dil.9') }}</div>
									<div class="solvent-desc-small">
										{{ $t('dil.9.desc') }}
									</div>
									<div v-html="$t('dil.9.eff')"></div>
									<Slider
										v-bind="sliderProps2"
										:value="Number(player.hydra.dilute.solvent[8])"
										:width="'100%'"
										:disabled="player.hydra.dilute.inDilute"
										@input="switchSolvent9"
									/>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<div align="center">
		<button class="clickable_button" @click="addPreset">添加当前溶剂作为预设</button>
		<div v-for="preset in Object.entries(player.hydra.dilute.solventPresets)">
			预设: {{ preset[1].join(',') }}
			<button
				class="clickable_button"
				style="display: inline"
				@click="() => setPreset(preset[1])"
			>
				使用
			</button>
			<button
				class="clickable_button"
				style="display: inline"
				@click="() => delPreset(preset[0])"
			>
				删除
			</button>
		</div>
	</div>
	<div align="center">
		当前可用溶液：{{ format(getCurrency(Currencies.SOLUTION)) }}<br />
		<button class="clickable_button" @click="Dilute.respec">重新分配</button>
	</div>
	<table align="center">
		<tbody>
			<tr>
				<TDUpgrade upgid="61S" />
				<TDUpgrade upgid="62S" />
				<TDUpgrade upgid="63S" />
				<TDUpgrade upgid="64S" />
			</tr>
			<tr>
				<TDUpgrade upgid="65S" />
				<TDUpgrade upgid="66S" />
				<TDUpgrade upgid="67S" />
				<TDUpgrade upgid="68S" />
			</tr>
			<tr>
				<TDUpgrade upgid="69S" />
				<TDUpgrade upgid="610S" />
				<TDUpgrade upgid="611S" />
				<TDUpgrade upgid="612S" />
			</tr>
			<tr>
				<TDUpgrade upgid="613S" />
				<TDUpgrade upgid="614S" />
				<TDUpgrade upgid="615S" />
				<TDUpgrade upgid="616S" />
			</tr>
		</tbody>
	</table>
	<table align="center" style="transform: translateY(80px)">
		<tbody class="milestones">
			<TRMilestone :id="'dut' + i" v-for="i in 18" :key="i" />
		</tbody>
	</table>
</template>

<style lang="scss">
.container {
	display: flex;
	justify-content: center;
	margin-top: 20px;
	overflow: auto;
	min-width: 1200px;
}

.dilute {
	width: 200px;
	border: 1px solid red;
	color: red;
	text-align: center;
	margin-right: 20px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-content: center;
}

.dilute-button {
	border: 1px solid red;
	border-radius: 50% 50%;
	width: 100px;
	height: 100px;
	position: relative;
	margin: 0 auto;
	margin-top: 60px;
	margin-bottom: 60px;
	background: transparent;
	transition: 1s ease-out;
	&:hover {
		cursor: pointer;
		transform: rotateZ(360deg);
		background: var(--suptitle-color);
	}
}

@keyframes rotate360deg {
	0% {
		transform: rotateZ(0deg);
	}
	100% {
		transform: rotateZ(360deg);
	}
}
.solvent {
	flex-direction: column;
	justify-content: center;
	width: 300px;
	height: 200px;
	border: 2px solid;
}
.solvent-desc-small {
	font-size: small;
}

.slider-dot-class-dilute {
	color: black;
}

.slider-process-class-dilute {
	background-color: red;
}
.solvents {
	border: 1px solid red;
}
</style>
