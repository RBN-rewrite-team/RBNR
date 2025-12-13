import { player } from '@/core/global';
import { format } from '@/utils/format';
import Decimal, { type DecimalSource } from 'break_eternity.js';
import { DC } from '../../constants';
import ModalService from '@/utils/Modal';
import { getProgress, predictableRandom } from '@/utils/algorithm.ts';
import { deepCopy } from '../../save';
import { updateResetStatData } from '../../stats';
import { getMessage, i18n } from '@/utils/i18n';
import type { $t } from '@/utils/types';
import { Garden } from '../garden.ts';
import { upgrades } from '@/core/mechanic.ts';
import { SIN } from './sin.ts';

function nextDayDate(date: Date): Date {
	const nextDay = new Date(date.getTime());
	nextDay.setHours(0, 0, 0, 0);
	nextDay.setDate(nextDay.getDate() + 1);
	return nextDay;
}

export const Oracle = {
	isUnlocked(): boolean {
		return Garden.level().gte(10);
	},
	nowBitsHave(): Decimal {
		return player.oracle.totalBits.sub(player.oracle.spendBits);
	},
	nextBitCD(): Decimal {
		let baseTime = new Decimal(30000);
		let scale = new Decimal(2);
		return baseTime.mul(scale.pow(player.oracle.totalBits));
	},

	bitGainProgress(): number {
		let diff = Oracle.bitGainSpeedMult().mul(Date.now() - player.oracle.startDate);
		return diff.div(Oracle.nextBitCD()).toNumber();
	},
	bitGainSpeedMult(): Decimal {
		let base = new Decimal(1);
		base = base.mul(player.pt.totalPower.add(10).log10());
		base = base.mul(player.garden.totalInspiration.add(10).log10().sub(10).div(4).add(1));
		if (player.upgrades[85]) {
			base = base.mul(upgrades[85].effect());
		}
		if (player.upgrades[6220]) base = base.pow(1.5);
		return base;
	},
	canGainBit(): boolean {
		return Oracle.bitGainProgress() >= 1;
	},
	fateCost(id: number): Decimal {
		if (player.oracle.fateBought[id] < 3) return new Decimal(1);
		else {
			let base = new Decimal(3);
			if (player.upgrades['89']) {
				base = base.sub(1.5); //1.5
			}
			if (player.upgrades[6219]) base = base.sub(0.2); //1.3
			return base.pow(player.oracle.fateBought[id] - 3).floor();
		}
	},

	/**
	 * get Fate effect rate (+0.015 = +1.5%)
	 * @param id 0-4
	 * @param column 0-4
	 */
	getFateEffectRate(id: number, column: number) {
		const type = Oracle.getFateType(id, column);
		let betweenDifferences = 0;
		betweenDifferences +=
			Oracle.getFateType(id - 1, column) === 0
				? 0
				: Oracle.getFateType(id - 1, column) !== type
					? 1
					: 0;
		betweenDifferences +=
			Oracle.getFateType(id + 1, column) === 0
				? 0
				: Oracle.getFateType(id + 1, column) !== type
					? 1
					: 0;
		betweenDifferences +=
			Oracle.getFateType(id, column - 1) === 0
				? 0
				: Oracle.getFateType(id, column - 1) !== type
					? 1
					: 0;
		betweenDifferences +=
			Oracle.getFateType(id, column + 1) === 0
				? 0
				: Oracle.getFateType(id, column + 1) !== type
					? 1
					: 0;
		let betweenSames = 0;
		betweenSames +=
			Oracle.getFateType(id - 1, column) === 0
				? 0
				: Oracle.getFateType(id - 1, column) === type
					? 1
					: 0;
		betweenSames +=
			Oracle.getFateType(id + 1, column) === 0
				? 0
				: Oracle.getFateType(id + 1, column) === type
					? 1
					: 0;
		betweenSames +=
			Oracle.getFateType(id, column - 1) === 0
				? 0
				: Oracle.getFateType(id, column - 1) === type
					? 1
					: 0;
		betweenSames +=
			Oracle.getFateType(id, column + 1) === 0
				? 0
				: Oracle.getFateType(id, column + 1) === type
					? 1
					: 0;

		let effect = 1;
		if (!player.milestones.sin_1) {
			effect -= (player.upgrades[81] ? 0.15 : 0.2) * betweenDifferences;
		}
		effect += 0.5 * betweenSames;
		effect *= player.oracle.fateEffect[id][column];

		let justiceEffect = 1;
		let dx = [-1, 1, 0, 0];
		let dy = [0, 0, -1, 1];
		for (let i = 0; i < 4; i++) {
			if (Oracle.getFateType(id + dx[i], column + dy[i]) === 5 && type !== 5) {
				let power = Oracle.getFateEffectRate(id + dx[i], column + dy[i]);
				justiceEffect *= 1.8 ** power;
			}
		}
		let jEsc = 10000;
		if (player.upgrades[815]) jEsc *= 2;
		if (player.upgrades[816]) jEsc *= 100;
		if (justiceEffect > jEsc) justiceEffect = jEsc * Math.log10(justiceEffect / (jEsc / 10));
		effect *= justiceEffect;

		if (player.milestones['sin_2'] && type !== 5) effect = effect ** (1.01 ** betweenSames);

		return Math.min(1e50, effect);
	},
	getFateTotalEffectiveNumber(type: number) {
		let sum = 0;
		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				if (Oracle.getFateType(i, j) === type) {
					sum += Oracle.getFateEffectRate(i, j);
				}
			}
		}
		return sum;
	},
	getFateTotalEffect(type: number): Decimal {
		const sum = Oracle.getFateTotalEffectiveNumber(type);
		if (type === 1) return new Decimal(0.075 * sum);
		if (type === 2) return new Decimal(1.5).pow(sum);
		if (type === 3) return new Decimal(1).add(1.5 * sum);
		if (type === 4) {
			const a = new Decimal(1).add(1.5 * sum);
			return a;
		}

		return new Decimal(1);
	},
	getFateType(id: number, column: number) {
		return player.oracle.fate[id]?.[column] ?? 0;
	},
	buyFate(id: number, column: number) {
		const cost = Oracle.fateCost(player.oracle.fateChoose - 1);
		if (cost.lte(Oracle.nowBitsHave())) {
			player.oracle.spendBits = player.oracle.spendBits.add(cost);
			const d = player.oracle.fateChoose - 1;
			player.oracle.fateBought[d]++;
			player.oracle.fate[id][column] = player.oracle.fateChoose;

			player.oracle.seedFateBought[d]++;
			const fakeRandom = predictableRandom(
				player.oracle.seedFate[d] * player.oracle.seedFateBought[d],
			);

			player.oracle.fateEffect[id][column] = getProgress(fakeRandom, 0.5, 1.5);
			if (player.upgrades[83]) {
				let mult = 1;
				if (
					player.upgrades[86] &&
					(player.oracle.fateChoose == 1 || player.oracle.fateChoose == 2)
				) {
					mult *= 2;
				}
				player.oracle.fateEffect[id][column] += (upgrades[83].effect() / 100) * mult;
			}
			player.oracle.fateEffect[id][column] +=
				Oracle.ptPowerEffectToFateEffect().toNumber() / 100;
			player.oracle.fateEffect[id][column] += player.oracle.totalBits
				.sub(87)
				.max(0)
				.root(2)
				.toNumber();
			if (player.pt.power.gte('ee7')) player.oracle.fateEffect[id][column] += 5;
			if (player.milestones['sin_5']) player.oracle.fateEffect[id][column] += 10;
			player.oracle.fateEffect[id][column] = Math.min(
				player.oracle.fateChoose == 5 ? 50 : 75,
				player.oracle.fateEffect[id][column],
			);
		}
	},
	ptPowerEffectToFateEffect() {
		if (player.pt.totalPower.lt(1e30)) return new Decimal(0);
		let base = player.pt.totalPower.add(10).log10().sub(29).root(2).sub(1);
		if (base.gte(100)) {
			base = base.div(10).log10().mul(100);
		}
		return base;
	},
	oracleLoop(diff: number) {
		if (!Oracle.isUnlocked()) {
			player.oracle.startDate = Date.now();
			return;
		}
		if (Oracle.canGainBit()) {
			player.oracle.totalBits = player.oracle.totalBits.add(1);
			player.oracle.startDate = Date.now();
			player.oracle.vowPoints = player.oracle.vowPoints.add(20);
		}
		if (player.oracle.gardenGenTimeProgress >= 1) {
			player.oracle.gardenGenTimeProgress -= 1;
			player.oracle.vowPoints = player.oracle.vowPoints.add(7);
		}
		if (player.oracle.ptResetTimeProgress >= 1) {
			player.oracle.ptResetTimeProgress -= 1;
			player.oracle.vowPoints = player.oracle.vowPoints.add(3);
		}
		player.oracle.vowPoints = player.oracle.vowPoints.clampMax(1000);
		if (SIN.isUnlocked()) {
			SIN.loop(diff);
		}
	},
	playerData() {
		return {
			totalBits: new Decimal(0),
			spendBits: new Decimal(0),
			startDate: 0,
			fate: [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
			],
			fateEffect: [
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
			],
			fateBought: [0, 0, 0, 0, 0],
			seedFateBought: [0, 0, 0, 0, 0],
			seedFate: [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()],
			/**
			 * @deprecated this debuff Remains is never used
			 */
			debuffRemains: 0 as never,
			fateChoose: 1, // 1,2,3,4,5

			vowPoints: new Decimal(0),
			vowCoe: new Decimal(20),

			gardenGenTimeProgress: 0,
			ptResetTimeProgress: 0,
			originalsin: SIN.playerData(),
		};
	},
	respec() {
		// check fates

		const hasFate =
			player.oracle.fate.filter((x) => x.filter((y) => y >= 1).length >= 1).length >= 1;
		if (!hasFate) return;

		if (player.oracle.vowPoints.lt(player.oracle.vowCoe)) return;

		player.oracle.fate = player.oracle.fate.map((x) => x.map(() => 0));
		player.oracle.fateBought = player.oracle.fate.map(() => 0);
		player.oracle.spendBits = new Decimal(0);
		player.oracle.vowPoints = player.oracle.vowPoints.sub(player.oracle.vowCoe);
		player.oracle.vowCoe = player.oracle.vowCoe.add(1).min(50);
	},
} as const;
