import { player, feature } from './global';
import { nextTick } from 'vue';
import { simulateTime } from './offline';
import { UPGRADES, BUYABLES, upgrades, buyables, milestones } from './mechanic';
import Decimal from 'break_eternity.js';
import { NUMTHEORY } from './multiplication/numbertheory';
import { predictableRandom } from '@/utils/algorithm';

import { CHALLENGE } from './challenge';
import { Logarithm } from './exponention/logarithm';
import { intervalBackup, save } from './save';
import { getCurrency } from './currencies';
import { updateTheme } from '@/utils/themes';
import { getOrdinalLevel } from './ordinal/ordinal-level.ts';
import { ORDINAL_BOOSTER } from './ordinal/ordinal-booster.ts';
import { wellOrderingLoop } from './ordinal/well_ordering.ts';
import { Dilute } from './hydra/dilute.ts';
import ModalService from '@/utils/Modal.ts';

import { temp } from '@/core/temp-data';
import { unlockedPlots } from '@/core/plot';
import { NON_RECURSIVE } from './nonrecu/index.ts';

import { DC } from '@/core/constants';

import { equipmentDestroyLoop } from '@/core/minigame';
import { achLoop } from './achievements.ts';
import { format } from '@/utils/format.ts';
import { Ordinal } from '@/lib/ordinal/index.ts';
import { OrdinalUtils } from '@/utils/ordinal.ts';

/**
 * 游戏循环经过了多少时间
 *
 * 单位为毫秒
 */
export let diff = 40;
export let loopInterval: number;
export let saveInterval: number;
setTimeout(() => {
	saveInterval = setInterval(save, 3000);
}, 3000);
export let backupInterval: number;
export let ordinalSpeedDerivative = DC.D_0;
export let ordinalSpeedDerivative2 = DC.D_0;
export function startGameLoop() {
	loopInterval = setInterval(gameLoop, 40);
	backupInterval = setInterval(intervalBackup, 1000);
}

export function stopGameLoop() {
	clearInterval(loopInterval);
	clearInterval(backupInterval);
}

export function stopSaveLoop() {
	clearInterval(saveInterval);
}

export function updateHighestStat() {
	player.stat.highestNumber = player.stat.highestNumber.max(player.number);
	player.stat.highestMulpower = player.stat.highestMulpower.max(player.multiplication.mulpower);
	player.stat.hightestAddpower = player.stat.hightestAddpower.max(player.addpower);
	player.stat.highestExppower = player.stat.highestExppower.max(player.exponention.exppower);
	player.stat.highestOrdLevel = Math.max(player.stat.highestOrdLevel, getOrdinalLevel());
}
export function qolLoop() {
	if (!player.exponention.logarithm.in_dilate) {
		if (player.upgrades['412q']) {
			player.buyables[11] = player.buyables[11].max(1);
		}
		if (player.upgrades['422q']) {
			player.buyables[11] = player.buyables[11].max(10);
		}
		if (player.upgrades['432q']) {
			player.buyable11More = player.buyables[21];
		}
		if (player.upgrades['442q']) {
			player.buyables[11] = player.buyables[11].max(100);
		}
		if (player.upgrades['455q']) {
			player.buyables[33] = new Decimal(99);
		}
	}
	if (player.upgrades['443q']) {
		player.challenges[0][3] = player.challenges[0][3].max(
			player.multiplication.totalMulpower.pow(0.001),
		);
	}
	if (player.upgrades['453q']) {
		for (let i = 0; i < 3; i++)
			player.challenges[0][i] = player.challenges[0][i].max(player.totalNumber);
	}
	if (player.exponention.logarithm.upgrades_in_dilated.includes('37'))
		player.buyables['11'] = new Decimal(1000);
}
function enterPlot(i: number) {
	if (unlockedPlots() >= i) {
		temp.plotdisplay = i;
	}
}
export function msToTimeshard(diff: number) {
	return diff / 150000;
}
/**
 * 游戏的循环函数（并不是主要的）
 */
export function gameLoop() {
	updateTheme();
	diff = Date.now() - player.lastUpdated;
	if (diff > 60000) {
		if (player.options.allowOffline) {
			simulateTime(diff);
			stopGameLoop();
			return;
		} else {
			diff = Math.min(60000, diff);
			player.timeshard.value = player.timeshard.value.add(msToTimeshard(diff));
		}
	}
	// if (player.run_a_tick_and_froze) diff = 33;
	if (diff < 0) return;
	// if (!player.run_a_tick_and_froze) player.lastUpdated = Date.now();
	// else player.lastUpdated += 33;
	// try {
	simulate(diff);
	// } catch (e) {
	//	throw e;
	// }
	if (player.singularity.stage >= 1) singularity_UI();

	let unlp = unlockedPlots();
	for (let i = 1; i <= unlp; i++) {
		if (!player.checkedPlots.includes(i) && temp.plotdisplay == 0) enterPlot(i);
	}

	equipmentDestroyLoop();
	achLoop();
	document.title = getCurTitle();
}
function getCurTitle() {
	let base = '';
	if (player.pt.resetTimes.gte(1)) {
		base = '大数之路放置版';
	} else {
		base = '大数之路重制版';
	}

	if (player.singularity.t < 666.6666666) {
		base += ' - ' + format(player.number) + '数值';
	} else if (!(player.firstResetBit & 0b1000)) {
		base += ' - ω数值';
	} else if (!player.upgrades[61]) {
		base +=
			' - ' +
			OrdinalUtils.numberToOrdinal(player.ordinal.number.floor(), feature.Ordinal.base());
	} else {
		base +=
			' - ' +
			OrdinalUtils.numberToBMS(player.hydra.deduceOrdinal[0], new Decimal(4), 15).replace(
				'<sup>ω</sup>',
				'^ω',
			);
	}
	if (base.length > 20) {
		base = base.replace('大数之路重制版', 'RBNR');
		base = base.replace('大数之路放置版', 'Idle');
	}
	return base;
}
function r(s: number): number {
	return Math.random() * s * 2 - s;
}
function singularity_UI() {
	let s =
		player.singularity.stage +
		Math.max(player.singularity.t - 400, 0) / 3 +
		Math.max(player.singularity.t - 500, 0) +
		Math.max(player.singularity.t - 550, 0) * 2 +
		Math.max(player.singularity.t - 500, 0) * 5;
	if (player.singularity.t > 675) s = 0;
	let str = ['main', 'title_box', 'menu', 'newsbar', 'resources'];
	document.getElementById('main')!.style.transform =
		'translate(' + r(s ** 0.5 * 4) + 'px, ' + r(s ** 0.5 * 4) + 'px)';
	document.getElementById('menu')!.style.transform =
		'translate(' + r(s ** 0.5 * 4) + 'px, ' + r(s ** 0.5 * 4) + 'px)';
	document.getElementById('resources')!.style.transform =
		'translate(' + r(s ** 0.5 * 4) + 'px, ' + r(s ** 0.5 * 4) + 'px)';
	if (player.options.ui.newsbar)
		document.getElementById('newsbar')!.style.transform =
			'translate(' + r(s ** 0.5 * 4) + 'px, ' + r(s ** 0.5 * 4) + 'px)';
	if (player.options.ui.titlebar)
		document.getElementById('title_box')!.style.transform =
			'translate(' + r(s ** 0.5 * 4) + 'px, ' + r(s ** 0.5 * 4) + 'px)';
}
/**
 * 游戏的主要循环函数，
 * @param diff 毫秒数，游戏要运行多少毫秒
 */
export function simulate(diff: number) {
	let realtime_diff = diff;
	//diff = new Decimal(diff)
	if (player.timeshard.openTf && player.timeshard.tf.gt(0)) {
		if (player.timeshard.tf.lt(diff)) {
			diff = diff + player.timeshard.tf.mul(2).toNumber();
			player.timeshard.tf = DC.D_0;
		} else {
			player.timeshard.tf = player.timeshard.tf.sub(diff);
			diff *= 3;
		}
	}
	let last = player.upgrades[61] ? DC.D_0 : feature.Ordinal.ordinalPerSecond();
	let last2 = feature.Ordinal.speedDeri();
	let pre_cardinal_diff = (diff *= 1 + player.minigame.ore_gets * 0.0025);

	if (player.nonrecu.studies_bought.includes(1))
		pre_cardinal_diff *= 2 ** (!CHALLENGE.inChallenge(1, 3) ? 1 : -1);
	let nonrecuDiffForSecInThisReset = new Decimal(pre_cardinal_diff / 1000);
	if (player.upgrades[77])
		nonrecuDiffForSecInThisReset = nonrecuDiffForSecInThisReset.mul(upgrades[77].effect());
	player.nonrecu.secInThisReset = player.nonrecu.secInThisReset.add(nonrecuDiffForSecInThisReset);
	qolLoop();
	CHALLENGE.challengeLoop();
	if (player.singularity.stage < 11) {
		if (feature.SUCCESSOR.autoSuccessPerSecond().gte(0.001)) {
			player.automationCD.successor += diff;

			//每几秒点击一次后继按钮
			let cd = new Decimal(1000).div(feature.SUCCESSOR.autoSuccessPerSecond());

			if (cd.lt(player.automationCD.successor)) {
				let bulk = Math.floor(player.automationCD.successor / Number(cd));
				player.automationCD.successor %= Number(cd);
				feature.SUCCESSOR.success(bulk);
			}
		}

		if (feature.resourceGain.addpower().passive.gt(0)) {
			let bulk = new Decimal(diff / 1000).mul(feature.resourceGain.addpower().passive);
			feature.ADDITION.addpower_gain(bulk);
		}

		if (player.upgrades[46]) {
			player.challenges[0][3] = player.challenges[0][3].add(
				player.multiplication.mulpower.root(200).mul(diff / 1000),
			);
		}

		if (feature.resourceGain.mulpower().passive.gt(0)) {
			let bulk = new Decimal(diff / 1000).mul(feature.resourceGain.mulpower().passive);
			feature.MULTIPLICATION.mulpower_gain(bulk);
		}

		if (feature.resourceGain.exppower().passive.gt(0)) {
			let bulk = new Decimal(diff / 1000).mul(feature.resourceGain.exppower().passive);
			feature.EXPONENTION.exppower_gain(bulk);
		}

		if (player.firstResetBit & 0b10) {
			let dPfTime = diff;
			if (CHALLENGE.inChallenge(0, 3)) {
				dPfTime *= predictableRandom(Math.floor(Date.now() / 40)) > 0.5 ? -1 : 1;
			}
			let dPfTimeDecimal = new Decimal(dPfTime);
			if (player.upgrades[45]) dPfTimeDecimal = dPfTimeDecimal.mul(NUMTHEORY.tau2().pow(4));
			player.multiplication.pfTime = player.multiplication.pfTime.add(dPfTimeDecimal).max(0);
			player.numbertheory.euler.x = player.numbertheory.euler.x
				.add(NUMTHEORY.varXgain().mul(diff).mul(1e-3))
				.max(1);
			player.numbertheory.euler.y = player.numbertheory.euler.y
				.add(NUMTHEORY.varYgain().mul(diff).mul(1e-3))
				.max(1);
			player.numbertheory.euler.z = player.numbertheory.euler.z
				.add(NUMTHEORY.varZgain().mul(diff).mul(1e-3))
				.max(1);
			player.numbertheory.euler.s = player.numbertheory.euler.s
				.add(NUMTHEORY.tickspeedGain().mul(diff).mul(1e-3))
				.max(1);
		}

		if (player.upgrades[45]) {
			let dPf2TimeDecimal = new Decimal(diff);
			player.numbertheory.rational_approx.n = player.numbertheory.rational_approx.n
				.add(NUMTHEORY.varX2gain().mul(diff).mul(1e-3))
				.max(1);
			player.numbertheory.rational_approx.m = player.numbertheory.rational_approx.m
				.add(NUMTHEORY.varM2gain().mul(diff).mul(1e-3))
				.max(1);
			player.numbertheory.rational_approx.y = player.numbertheory.rational_approx.y
				.add(NUMTHEORY.varY2gain().mul(diff).mul(1e-3))
				.max(1);
		}

		if (player.milestones.dil_5)
			player.exponention.logarithm.observe_datas =
				player.exponention.logarithm.observe_datas.add(
					player.exponention.logarithm.calculate_datas
						.add(1)
						.log10()
						.pow(2)
						.mul(diff / 1000),
				);
	}

	if (player.firstResetBit & 0b1000) {
		player.ordinal.number = player.ordinal.number.add(
			feature.resourceGain.ordinalNumber().value.mul(diff / 1000),
		);
		if (player.buyables['54R'].gte(1)) {
			player.numbertheory.GH.t31 = player.numbertheory.GH.t31.add(diff / 1000);
		}
		if (player.buyables['55R'].gte(1)) {
			player.numbertheory.GH.t32 = player.numbertheory.GH.t32.add(diff / 1000);
		}
		let base = feature.Ordinal.base();
		if (player.ordinal.number.gte(base.tetrate(base.toNumber()))) player.help.epsilon = true;
		if ([0, 2, 4, 5, 9, 10, 12, 13].includes(player.currentTab)) {
			player.currentTab = 14;
		}
	}
	ORDINAL_BOOSTER.boosterLoop();
	for (const upg_i in upgrades) {
		const i = upg_i as keyof typeof upgrades;

		if (upgrades[i] && upgrades[i].keep != null && upgrades[i].keep()) {
			if (upgrades[i].name.startsWith('U5-1-') && player.retribution != 0) {
			} else {
				player.upgrades[i as keyof typeof player.upgrades] = true;
			}
		}
		if (
			upgrades[i] &&
			upgrades[i].auto != null &&
			upgrades[i].auto() &&
			upgrades[i].canAfford()
		) {
			player.upgrades[i as keyof typeof player.upgrades] = true;
		}
	}

	for (const byl_i in buyables) {
		const i = byl_i as keyof typeof buyables;
		if (buyables[i].canBuyMax != null && buyables[i].canBuyMax()) {
			if (buyables[i].autoBuyMax != null && buyables[i].autoBuyMax()) {
				buyables[i].postBuyMax();
				player.buyables[i] = Decimal.max(
					player.buyables[i],
					buyables[i].costInverse(getCurrency(buyables[i].currency)),
				);
			}
		}
	}

	for (let i in milestones) {
		if (!player.milestones[i] && milestones[i].canDone) {
			player.milestones[i as keyof typeof player.milestones] = true;
			milestones[i]?.onDone?.();
		}
	}

	if (!(player.firstResetBit & 0b1000) && player.singularity.stage >= 11) {
		player.number = player.number.add(feature.resourceGain.number().value.mul(diff / 1000));
		player.totalNumber = player.totalNumber.add(
			feature.resourceGain.number().value.mul(diff / 1000),
		);
	}
	if (player.stat.chapter >= 6) {
		NON_RECURSIVE.loop(diff / 1000);
	}
	if (player.singularity.enabled || Logarithm.logarithm.upgrades_in_dilated.includes('39')) {
		if (player.singularity.enabled) player.singularity.t += diff / 1000;
		if (player.singularity.stage < 1 && player.singularity.t > 205) player.singularity.t = 205;
		if (player.singularity.stage < 2 && player.singularity.t > 250) player.singularity.t = 250;
		if (player.singularity.stage < 3 && player.singularity.t > 300) player.singularity.t = 300;
		if (player.singularity.stage < 4 && player.singularity.t > 350) player.singularity.t = 350;
		if (player.singularity.stage < 6 && player.singularity.t > 400) player.singularity.t = 400;
		if (player.singularity.stage < 7 && player.singularity.t > 430) player.singularity.t = 430;
		if (player.singularity.stage < 8 && player.singularity.t > 450) player.singularity.t = 450;
		if (player.singularity.stage < 9 && player.singularity.t > 470) player.singularity.t = 470;
		if (player.singularity.stage < 10 && player.singularity.t > 490) player.singularity.t = 490;
		if (player.singularity.stage < 11 && player.singularity.t > 500) player.singularity.t = 500;
		if (player.singularity.t >= 695) player.firstResetBit |= 0b1000;
		player.singularity.t = Math.min(player.singularity.t, 710);
	}
	if (player.upgrades[517]) {
		feature.Hydra.hydraUpdate(pre_cardinal_diff / 1000);
		Dilute.diluteLoop(pre_cardinal_diff, diff);
	}

	if (player.upgrades[58]) {
		feature.OrdinalNT.varGainLoop(pre_cardinal_diff / 1000);
	}

	if (player.milestones.nonrec_26) {
		wellOrderingLoop(pre_cardinal_diff / 1000);
	}

	Logarithm.astronomerUpdate();
	updateHighestStat();
	let next = player.upgrades[61] ? DC.D_0 : feature.Ordinal.ordinalPerSecond();
	ordinalSpeedDerivative = next.sub(last).div(diff / 1000);
	let next2 = feature.Ordinal.speedDeri();
	ordinalSpeedDerivative2 = next2.sub(last2).div(diff / 1000);
	checkNaN(player, ['player']);
	player.lastUpdated = Date.now();
}

function checkNaN<T>(obj: T, path: string[]): T {
	if (obj === null || obj === undefined) {
		return obj;
	}

	// 发现并处理 Decimal NaN
	if (obj instanceof Decimal && !Decimal.isFinite(obj)) {
		stopGameLoop();
		if (!player.foundNaN) {
			ModalService.show({
				title: '游戏已经停止运行',
				get content() {
					return `游戏在检查存档过程中发现了一些异常值，因此游戏自动停止了运行。<br>
				以下是有关异常值的信息: ${path.join('.')}<br>
				将<b>存档导出，并将存档和截图发送给开发者</b>，有助于解决这个问题。<br>`;
				},
				onConfirm(values) {
					player.currentTab = 1;
				},
			});
			player.foundNaN = true;
		}
		return DC.D_1 as unknown as T;
	}

	// 处理数组
	if (Array.isArray(obj)) {
		return obj.map((item, index) =>
			checkNaN(item, path.concat(index.toString())),
		) as unknown as T;
	}

	// 处理对象
	if (typeof obj === 'object' && obj !== null) {
		const result: any = {};
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				result[key] = checkNaN((obj as any)[key], path.concat(key));
			}
		}
		return result as T;
	}

	// 其他基本类型
	return obj;
}
