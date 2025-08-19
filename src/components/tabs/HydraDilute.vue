<script lang="ts" setup>
import { player, feature } from '../../core/global.ts';
import { format, formatWhole } from '@/utils/format';
import Slider from '../Slider.vue';
import { Dilute } from '@/core/hydra/dilute.ts';
import { computed, ref } from 'vue';

function getCurrentSolution() {
	return player.hydra.dilute.solution;
}

const sliderProps = {
	min: 0,
	max: 10,
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

let refreshKey = ref(0);

setInterval(function () {
	refreshKey.value++;
}, 40);
</script>

<template :key="refreshKey">
	你有<b style="color: red; font-size: 30px">{{ format(getCurrentSolution()) }}</b
	>九头蛇溶液<br /><br />
	<span v-if="player.hydra.dilute.prionsTime > 0"
		>你有<b style="color: red; font-size: 30px">{{ format(Dilute.prions()) }}</b
		>朊病毒<br /><br
	/></span>
	<div>
		启动稀释后，溶剂{{
			(() => {
				let a = 1000 / Dilute.diluteAmountOutside(2) ** 2 - player.hydra.dilute.spentTime;
				return !isFinite(a)
					? Dilute.diluteAmountOutside(4)
						? '可能会自毁'
						: '不会自毁'
					: '将会在' + a.toFixed(3) + '秒后自毁';
			})()
		}}
	</div>
	<div class="container" style="transform: translateY(-10px)">
		<div class="dilute">
			至少选择任何一项溶剂并提升它的等级以进入稀释<br />
			<button class="dilute-button" @click="Dilute.diluteButton">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
					<path
						fill="red"
						d="M292 76.6C292 68.3 284.4 62.1 276.5 64.5C215.6 83.3 171.4 140.3 171.4 207.6C171.4 232.7 177.5 256.3 188.4 277.1C167.4 278.9 146.4 285.3 126.9 296.6C69 330.2 42.1 396.8 56 459.1C57.9 467.5 67.4 471.1 74.9 466.7C79.9 463.8 82.5 458.1 82 452.3C81.7 449 81.6 445.7 81.6 442.2C81.6 318.7 266 318.7 266 442.2C266 530.6 171.5 555.8 117.8 517.6C113.3 514.4 107.3 513.7 102.5 516.5C95.5 520.6 93.9 530.1 99.8 535.6C146.4 579.4 217.8 589.5 275.9 555.8C293.8 545.4 308.7 531.9 320.4 516.4C332.1 532 347 545.5 364.9 555.8C423 589.5 494.4 579.4 541 535.6C546.9 530.1 545.3 520.5 538.3 516.5C533.5 513.7 527.5 514.4 523 517.6C469.3 555.8 374.8 530.6 374.8 442.2C374.8 318.7 559.2 318.7 559.2 442.2C559.2 445.6 559.1 449 558.8 452.3C558.3 458.1 560.9 463.8 565.9 466.7C573.3 471 582.9 467.5 584.8 459.1C598.7 396.9 571.8 330.2 513.9 296.6C494.4 285.3 473.5 278.9 452.4 277.1C463.3 256.3 469.4 232.7 469.4 207.6C469.4 140.3 425.2 83.3 364.3 64.5C356.4 62.1 348.8 68.3 348.8 76.6C348.8 82.5 352.8 87.6 358.3 89.8C441.7 123.4 429.1 268.2 320.5 268.2C211.9 268.2 199.1 123.4 282.5 89.8C288 87.6 292 82.5 292 76.6zM280.4 352C280.4 329.9 298.3 312 320.4 312C342.5 312 360.4 329.9 360.4 352C360.4 374.1 342.5 392 320.4 392C298.3 392 280.4 374.1 280.4 352zM467 381.7C450.8 381.7 435.6 387.2 424.9 396.7C414.8 405.8 406.8 420.1 406.8 442.3C406.8 463.4 414 477.3 423.3 486.4C455.5 461.8 478.8 425.9 487.2 384.6C480.9 382.7 474 381.6 467 381.6zM234 442.3C234 420 226 405.7 215.9 396.7C205.2 387.1 190 381.7 173.8 381.7C166.8 381.7 159.9 382.7 153.6 384.7C162 426 185.2 461.9 217.5 486.5C226.9 477.4 234 463.4 234 442.3zM275.2 218C284.2 228.2 298.4 236.2 320.4 236.2C342.4 236.2 356.6 228.2 365.6 218C372.3 210.4 377.1 200.5 379.2 189.6C360.9 182.8 341 179.1 320.4 179.1C299.8 179.1 279.9 182.8 261.6 189.6C263.8 200.5 268.5 210.4 275.2 218.1z"
					/>
				</svg></button
			><br />
			进入稀释，你将重新开始第五层的进度并遭受你所选择的削弱，作为奖励，你可以获得九头蛇溶液。<br />
			选用的削弱等级对九头蛇溶液的获取量影响较大，稀释中的进度对九头蛇溶液的获取量影响较小。<br />
			你在{{ JSON.stringify(player.hydra.dilute.lastSolvent.map(Number)) }}中最高达到了{{
				formatWhole(player.hydra.dilute.lastDeduce)
			}}次推演，这给你带来了{{ format(player.hydra.dilute.solution) }}九头蛇溶液
		</div>
		<div class="solvents">
			溶剂等级之和使你的推演速度变为<sup>1</sup>/<sub>{{
				(player.hydra.dilute.solvent.slice(0, 6) as number[]).reduce(
					(total, num): number => total + num,
					1,
				) ** 2
			}}</sub>
			<table>
				<tbody>
					<tr>
						<td>
							<div class="solvent" style="border-color: rgb(255, 0, 0)">
								<div>
									<div>溶剂I: 时空黑洞</div>
									<div class="solvent-desc-small">
										“虽然这很不幸，但至少你能用自己比别人活得久的事实来安慰自己。”
									</div>
									<div>
										推演速度和乘数积累速度变为<sup>1</sup>/<sub>{{
											5 ** Dilute.diluteAmountOutside(0)
										}}</sub>
									</div>
									<Slider
										v-bind="sliderProps"
										:value="player.hydra.dilute.solvent[0]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="player.hydra.dilute.solvent[0] = $event"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(255, 0, 0)">
								<div>
									<div>溶剂II: 阿尔兹海默症</div>
									<div class="solvent-desc-small">“你变得越来越健忘......”</div>
									<div>
										所有升级、购买项成本^{{
											format(4 - 3 * 0.75 ** Dilute.diluteAmountOutside(1))
										}}
									</div>
									<Slider
										v-bind="sliderProps"
										:value="player.hydra.dilute.solvent[1]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="player.hydra.dilute.solvent[1] = $event"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(255, 0, 0)">
								<div>
									<div>溶剂III: 地球爆炸</div>
									<div class="solvent-desc-small">
										“地球很快就要爆炸了，更糟的是你没有宇宙飞船......”
									</div>
									<div>
										选择本溶剂的稀释会在{{
											(() => {
												let a = 1000 / Dilute.diluteAmountOutside(2) ** 2;
												return !isFinite(a)
													? '无穷时间'
													: a.toFixed(3) + '秒';
											})()
										}}内自我毁灭(即强行退出稀释)
									</div>
									<Slider
										v-bind="sliderProps"
										:value="player.hydra.dilute.solvent[2]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="player.hydra.dilute.solvent[2] = $event"
									/>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="solvent" style="border-color: rgb(127, 0, 0)">
								<div>
									<div>溶剂IV: 数论地狱</div>
									<div class="solvent-desc-small">
										“数学家的最新研究打开了地狱的大门.....”
									</div>
									<div>数论研究选项卡下的数论研究4效果反转</div>
									<Slider
										v-bind="sliderProps"
										:value="player.hydra.dilute.solvent[3]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="player.hydra.dilute.solvent[3] = $event"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(127, 0, 0)">
								<div>
									<div>溶剂V: 朊病毒噩梦</div>
									<div class="solvent-desc-small">“脲¤1-2~~~.2-_/T~/5个 --”</div>
									<div style="font-size: 60%">
										此溶剂中会不断产生朊病毒，生成量为({{
											(1 + Dilute.diluteAmountOutside(4) / 100).toFixed(4)
										}}^稀释中时间)-1，<br />
										朊病毒在获取的总推演数量超过10,000时开始生成，<br />
										当朊病毒数量超过稀释中获取的总推演数量时此稀释将会自我毁灭
									</div>
									<Slider
										v-bind="sliderProps"
										:value="player.hydra.dilute.solvent[4]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="player.hydra.dilute.solvent[4] = $event"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(127, 0, 0)">
								<div>
									<div>溶剂VI：核食惊魂</div>
									<div class="solvent-desc-small">
										“他摸着女儿的第二个头说:海鲜当然能吃！”
									</div>
									<div>
										推演速度^{{
											(Dilute.diluteAmountOutside(5) * -0.1 + 1).toFixed(1)
										}}(在其它乘数削弱效果之前)
									</div>
									<Slider
										v-bind="sliderProps"
										:value="player.hydra.dilute.solvent[5]"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="player.hydra.dilute.solvent[5] = $event"
									/>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="solvent" style="border-color: rgb(63, 0, 63)">
								<div>
									<div>溶剂VII:天堂已满</div>
									<div class="solvent-desc-small">
										“你发现天上那些黑点不是雨，而是坠落的人类。”
									</div>
									<div>转生，飞升，超越，轮回全部无效</div>
									<Slider
										v-bind="sliderProps2"
										:value="Number(player.hydra.dilute.solvent[6])"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="player.hydra.dilute.solvent[6] = !!$event"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(63, 0, 63)">
								<div>
									<div>溶剂VIII:坠毁</div>
									<div class="solvent-desc-small">
										“试图升天的人类迎来了自己的末日。”
									</div>
									<div>进入稀释后5秒后便无法获得任何九头蛇能量。</div>
									<Slider
										v-bind="sliderProps2"
										:value="Number(player.hydra.dilute.solvent[7])"
										:width="'100%'"
										:disabled="canChangeLevel"
										@input="player.hydra.dilute.solvent[7] = !!$event"
									/>
								</div>
							</div>
						</td>
						<td>
							<div class="solvent" style="border-color: rgb(63, 0, 63)">
								<div>
									<div>溶剂IX:天启</div>
									<div class="solvent-desc-small">“晚安，世界。”</div>
									<div>
										所有溶剂等级提升到最大，无法清除。全局速度×<sup>1</sup>/<sub>1000</sub>。
									</div>
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
</template>

<style lang="scss">
.container {
	display: flex;
	justify-content: center;
	margin-top: 20px;
}

.dilute {
	display: block;
	height: fit-content;
	width: 200px;
	border: 1px solid red;
	color: red;
	text-align: center;
	margin-right: 20px;
	padding: 10px;
}

.dilute-button {
	border: 1px solid red;
	border-radius: 50% 50%;
	width: 100px;
	height: 100px;
	position: relative;
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
</style>
