import Decimal from 'break_eternity.js';
import { type DecimalSource } from 'break_eternity.js';
import { saveSerializer } from './serializer';
import { reactive } from 'vue';
import { format, notations } from '@/utils/format';
import { themes } from '@/utils/themes';
import type { IAstronomer } from '../exponention/logarithm';
import { buyables, upgrades, milestones } from '../mechanic';
import type { backupHydraType } from '../hydra/dilute';
import { Dilute } from '../hydra/dilute';
import { stopGameLoop } from '../game-loop';
import { OrdinalUtils } from '@/utils/ordinal';
import { calculate } from '@/utils/bms-analyze';
import { displayOrd } from '@/lib/ordinal';
import { createDeepValidatedReactive } from '../check-decimal-nan';
import { NON_RECURSIVE } from '../nonrecu/index.ts';
import { initMiniGameData, hardResetMiniGame, type PlayerMinigameData } from '../minigame/index.ts';
import { DC } from '@/core/constants';
import { pubtest } from "./testing.ts"

const version = 11 as const;
export let current_save = 0;
export type PrimeFactorTypes = 'pf2' | 'pf3' | 'pf5' | 'pf7' | 'pf11' | 'pf13' | 'pf17' | 'pf19';
type KeyStringFromDecimal<T> = {
	[key in keyof T]: T[key] extends Decimal
		? string
		: T[key] extends object
			? KeyStringFromDecimal<T[key]>
			: T[key];
};
// type Milestones = Record<
// 	`cb${IntRange<1, 21>}` | 'log_law1' | 'log_law2' | 'log_law3' | 'log_G',
// 	boolean
// >;

function _getSaveID(id: number) {
	if (id == 0) {
		return 'RBN-rewritten-powerful-refactor-test';
	} else {
		return `RBN-rewritten-save-${id}`;
	}
}

function getSaveID(id: number) {
  return "pubtesting_"+_getSaveID(id)
}

export interface Player {
	number: Decimal;
	version: typeof version;
	totalNumber: Decimal;
	lastUpdated: number;
	saveCreateTime: number;
	upgrades: Record<keyof typeof upgrades, boolean>;
	buyables: Record<keyof typeof buyables, Decimal>;
	milestones: Record<keyof typeof milestones, boolean>;
	buyable11More: Decimal;
	automationCD: {
		successor: number;
	};
	numbertheory: {
		visiting: number;
		euler: {
			x: Decimal;
			y: Decimal;
			z: Decimal;
			s: Decimal;
		};
		rational_approx: {
			n: Decimal;
			m: Decimal;
			y: Decimal;
		};
		GH: {
			x: Decimal;
			t31: Decimal;
			t32: Decimal;
			t33: Decimal;
		};
		GM: {
			x: Decimal;
		};
	};
	currentTab: number;
	addpower: Decimal;
	totalAddpower: Decimal;
	firstResetBit: number;
	challenges: Decimal[][];
	multiplication: {
		mulpower: Decimal;
		totalMulpower: Decimal;
		pfTime: Decimal;
		B1seriesC1: 0 | 2 | 3 | 4 | 5;
		B1seriesC1400q: 0 | 2 | 3 | 4 | 5;
	};
	exponention: {
		exppower: Decimal;
		totalExppower: Decimal;
		qolpoints: Decimal;
		logarithm: {
			observe_datas: Decimal;
			calculate_datas: Decimal;
			astronomers: IAstronomer[];
			in_dilate: boolean;
			upgrades_in_dilated: (keyof typeof upgrades)[];
			buyables_in_dilated: (keyof typeof buyables)[];
			highest_dilate: Decimal;
		};
	};
	options: {
		notation: notations;
		ui: {
			theme: themes;
			otherwise: {
				[key: string]: boolean;
			};
			newsbar: boolean;
			titlebar: boolean;
			user_font?: string;
		};
		challengeDetial: boolean;
		allowOffline: boolean;
	};
	stat: {
		chapter: number;
		totalNumber: Decimal;
		highestNumber: Decimal;
		totalMulpower: Decimal;
		highestMulpower: Decimal;
		totalAddpower: Decimal;
		hightestAddpower: Decimal;
		totalExppower: Decimal;
		highestExppower: Decimal;
		highestOrdLevel: number;
	};
	challengein: [number, number];
	frozen: boolean;
	run_a_tick_and_froze: boolean;
	singularity: {
		t: number;
		stage: number;
		enabled: boolean;
	};
	ordinal: {
		number: Decimal;
		booster: {
			mult: Decimal;
		};
	};
	help: {
		page: number;
		milestone: number;
		epsilon: boolean;
	};
	timeshard: {
		value: Decimal;
		tf: Decimal;
		cd: [number, number, number];
		last: [number, number, number];
		openTf: boolean;
		next: [number, number, number];
	};
	hydra: {
		visiting: number;
		power: Decimal;
		totalPower: Decimal;
		trueTotalPower: Decimal;
		milestoneDut5Eff: Decimal;
		powerMult: [Decimal, Decimal, Decimal, Decimal];
		deduceProgress: [Decimal, Decimal, Decimal, Decimal];
		deduceOrdinal: [Decimal, Decimal, Decimal, Decimal];
		totalDeduceOrdinal: [Decimal, Decimal, Decimal, Decimal];
		prestige: [Decimal, Decimal, Decimal, Decimal];
		pAuto: [boolean, boolean, boolean, boolean];
		backupHydra?: backupHydraType;
		dilute: {
			inDilute: boolean;
			solvent: [number, number, number, number, number, number, boolean, boolean, boolean];
			lastSolvent: [
				number,
				number,
				number,
				number,
				number,
				number,
				boolean,
				boolean,
				boolean,
			];
			spentTime: number;
			solution: Decimal;
			lastDeduce: Decimal;
			solute: Decimal;
			solutionCost: Decimal;
			prions: Decimal;
			highestApocalypse: Decimal;
			solventPresets: [
				number,
				number,
				number,
				number,
				number,
				number,
				boolean,
				boolean,
				boolean,
			][];
		};
		autoHydraReset: boolean;
	};
	nonrecu: {
		power: Decimal;
		totalPower: Decimal;
		resetTimes: Decimal;
		studies_bought: number[];
		theories: [Decimal, Decimal, Decimal];
		spentTheories: Decimal;
		secInThisReset: Decimal;
	};
	minigame: PlayerMinigameData;
	backup?: Omit<Player, 'backup'> | null;
	foundNaN: boolean;
	checkedPlots: number[];
	automator: {
		running: boolean;
		code: string;
		currentBlockPos: number;
	};
}

function getInitialPlayerData(): Player {
	return {
		version: version,
		number: DC.D_0,
		frozen: false,
		run_a_tick_and_froze: false,
		totalNumber: DC.D_0,
		lastUpdated: Date.now(),
		saveCreateTime: Date.now(),
		addpower: DC.D_0,
		upgrades: Object.fromEntries(Object.keys(upgrades).map((key) => [key, false])) as Record<
			keyof typeof upgrades,
			boolean
		>,
		buyables: Object.fromEntries(Object.keys(buyables).map((key) => [key, DC.D_0])) as Record<
			keyof typeof buyables,
			Decimal
		>,
		milestones: Object.fromEntries(
			Object.keys(milestones).map((key) => [key, false]),
		) as Record<keyof typeof milestones, boolean>,
		buyable11More: DC.D_0,
		automationCD: {
			successor: 0,
		},
		numbertheory: {
			visiting: 1,
			euler: {
				x: DC.D_1,
				y: DC.D_1,
				z: DC.D_1,
				s: DC.D_1,
			},
			rational_approx: {
				n: DC.D_1,
				m: DC.D_1,
				y: DC.D_1,
			},
			GH: {
				x: DC.D_11,
				t31: DC.D_0,
				t32: DC.D_0,
				t33: DC.D_0,
			},
			GM: {
				x: DC.D_0,
			},
		},
		currentTab: 0,
		totalAddpower: DC.D_0,
		firstResetBit: 0,
		multiplication: {
			mulpower: DC.D_0,
			totalMulpower: DC.D_0,
			pfTime: DC.D_0,
			B1seriesC1: 0,
			B1seriesC1400q: 0,
		},
		exponention: {
			exppower: DC.D_0,
			totalExppower: DC.D_0,
			qolpoints: DC.D_0,
			logarithm: {
				observe_datas: DC.D_0,
				calculate_datas: DC.D_0,
				astronomers: [],
				in_dilate: false,
				upgrades_in_dilated: [],
				buyables_in_dilated: [],
				highest_dilate: DC.D_1,
			},
		},
		options: {
			notation: notations.SCIENTIFIC,
			ui: {
				theme: themes.CLASSIC,
				otherwise: {
					color_inversion: false,
					full_gray: false,
					blur: false,
					sepia: false,
				},
				newsbar: true,
				titlebar: true,
			},
			challengeDetial: false,
			allowOffline: true,
		},
		stat: {
			chapter: -1,
			totalNumber: DC.D_0,
			highestNumber: DC.D_0,
			totalMulpower: DC.D_0,
			highestMulpower: DC.D_0,
			totalAddpower: DC.D_0,
			hightestAddpower: DC.D_0,
			totalExppower: DC.D_0,
			highestExppower: DC.D_0,
			highestOrdLevel: 0,
		},
		challenges: [
			[DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0],
			[DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0],
		],
		challengein: [-1, -1],
		singularity: {
			t: 0,
			stage: 0,
			enabled: false,
		},
		minigame: initMiniGameData(),
		ordinal: {
			number: DC.D_10,
			booster: {
				mult: DC.D_1,
			},
		},
		help: {
			page: 1,
			milestone: 0,
			epsilon: false,
		},
		timeshard: {
			value: DC.D_0,
			tf: DC.D_0,
			cd: [Date.now(), Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000],
			last: [0, 0, 0],
			openTf: false,
			next: [
				Math.floor(Math.random() * 40 + 10),
				Math.floor(Math.random() * 320 + 80),
				Math.floor(Math.random() * 4000 + 1000),
			],
		},
		hydra: {
			visiting: 0,
			power: DC.D_0,
			totalPower: DC.D_0,
			trueTotalPower: DC.D_0,
			milestoneDut5Eff: DC.D_1,
			powerMult: [DC.D_1, DC.D_1, DC.D_1, DC.D_1],
			deduceProgress: [DC.D_0, DC.D_0, DC.D_0, DC.D_0],
			deduceOrdinal: [DC.D_0, DC.D_0, DC.D_0, DC.D_0],
			totalDeduceOrdinal: [DC.D_0, DC.D_0, DC.D_0, DC.D_0],
			prestige: [DC.D_0, DC.D_0, DC.D_0, DC.D_0],
			pAuto: [false, false, false, false],
			dilute: {
				inDilute: false,
				solvent: [0, 0, 0, 0, 0, 0, false, false, false],
				lastSolvent: [0, 0, 0, 0, 0, 0, false, false, false],
				solventPresets: [],
				lastDeduce: DC.D_0,
				spentTime: 0,
				solution: DC.D_0,
				solutionCost: DC.D_0,
				solute: DC.D_0,
				prions: DC.D_1,
				highestApocalypse: DC.D_0,
			},
			autoHydraReset: false,
		},
		nonrecu: {
			power: DC.D_0,
			totalPower: DC.D_0,
			resetTimes: DC.D_0,
			studies_bought: [],
			theories: [DC.D_0, DC.D_0, DC.D_0],
			spentTheories: DC.D_0,
			secInThisReset: DC.D_0,
		},
		foundNaN: false,
		checkedPlots: [],
		automator: {
			running: false,
			code: '',
			currentBlockPos: 0,
		},
	};
}

type DeepPartial<T> = T extends (infer U)[]
	? DeepPartial<U>[] | undefined
	: T extends object
		? { [P in keyof T]?: DeepPartial<T[P]> }
		: T;

function isBigInt(value: unknown): value is bigint {
	return Object.prototype.toString.call(value) === '[object BigInt]';
}

/**
 * 此函数是用来：
 * 合并两个对象
 * 合并两个数组
 * 通用的合并，target是source的部分类型
 */
function deepMerge<T extends object>(source: T, target: object): T;
function deepMerge<T extends unknown[]>(source: T, target: unknown[]): T;
function deepMerge<T>(source: T, target: DeepPartial<T>): T {
	if (Array.isArray(source)) {
		const targetArray = Array.isArray(target) ? target : [];
		const maxLength = Math.max(source.length, targetArray.length);
		const result: unknown[] = [];

		for (let i = 0; i < maxLength; i++) {
			const sourceItem = i < source.length ? source[i] : undefined;
			const targetItem = i < targetArray.length ? targetArray[i] : undefined;

			if (targetItem === null || sourceItem === null) continue;

			if (isBigInt(sourceItem)) {
				result[i] = BigInt(targetItem as string | number | bigint | boolean);
			} else if (
				targetItem !== undefined &&
				targetItem !== null &&
				sourceItem !== null &&
				typeof sourceItem === 'object' &&
				!(sourceItem instanceof Decimal)
			) {
				result[i] = deepMerge(sourceItem, targetItem as DeepPartial<typeof sourceItem>);
			} else if (sourceItem instanceof Decimal) {
				result[i] = new Decimal(targetItem as DecimalSource);
			} else if (sourceItem === undefined && targetItem !== undefined) {
				result[i] = targetItem;
			} else {
				result[i] = targetItem !== undefined ? targetItem : sourceItem;
			}
		}

		return result as T;
	}

	if (typeof source === 'object' && source !== null) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = { ...source };

		if (target === null || target === undefined) return source;

		for (const key of new Set([...Object.keys(source), ...Object.keys(target)])) {
			const sourceValue = source[key as keyof typeof source];
			const targetValue = target[key as keyof typeof target];

			if (targetValue === undefined || targetValue === null) {
				continue;
			}

			if (sourceValue === undefined || sourceValue === null) {
				result[key] = targetValue;
			}

			if (isBigInt(sourceValue)) {
				result[key] = BigInt(targetValue as string | number | bigint | boolean);
			} else if (
				sourceValue !== null &&
				typeof sourceValue === 'object' &&
				!(sourceValue instanceof Decimal)
			) {
				result[key] = deepMerge(sourceValue, targetValue) as T[Extract<keyof T, string>];
			} else if (sourceValue instanceof Decimal) {
				result[key] = new Decimal(targetValue as DecimalSource) as T[Extract<
					keyof T,
					string
				>];
			} else if (targetValue !== null && typeof targetValue === 'object') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				result[key] = deepMerge(targetValue, sourceValue as any);
			} else {
				result[key] = targetValue;
			}
		}

		return result as T;
	}

	return target !== undefined && target !== null ? (target as T) : source;
}

export let player: Player = getInitialPlayerData();

export function loadFromString(saveContent: string) {
	const deserialized = saveSerializer.deserialize(saveContent);
	Object.assign(player, deepMerge(player, deserialized));
	if ((player?.version ?? 0) < 4) {
		player.hydra.dilute.solvent = [0, 0, 0, 0, 0, 0, false, false, false];
	}
	if ((player?.version ?? 0) < 6 && player.upgrades['69R']) {
		Dilute.exitDilute();
		player.hydra.dilute = getInitialPlayerData().hydra.dilute;
		player.upgrades['61S'] = false;
		player.hydra.power = DC.D_E2466;
		player.hydra.powerMult = [DC.D_1, DC.D_1, DC.D_1, DC.D_1];
		player.hydra.prestige = [DC.D_E345, DC.D_E55, DC.D_3P7, DC.D_5E35];
	}
	if ((player?.version ?? 0) < 7 && player.upgrades['616S']) {
		if (player.nonrecu.resetTimes.gte(1)) player.firstResetBit |= 0b10000;
	}
	if ((player?.version ?? 0) < 8) {
		player.checkedPlots = player.checkedPlots.filter((x) => x !== 14);
	}
	if ((player?.version ?? 0) < 9) {
		player.nonrecu.power = player.nonrecu.power.min(1e30);
		player.challenges[1][0] = player.challenges[1][0].min(1);
		if (player.nonrecu.studies_bought.includes(19)) {
			player.nonrecu.studies_bought = [];
			player.nonrecu.spentTheories = DC.D_0;
			NON_RECURSIVE.reset(true);
		}
		player.hydra.dilute.prions = player.hydra.dilute.prions.min(DC.D_EE18);
		player.hydra.deduceOrdinal[0] = player.hydra.deduceOrdinal[0].min(DC.D_EE3500);
	}
	if ((player?.version ?? 0) < 10) {
		hardResetMiniGame();
	}

	player.minigame.current_x = BigInt(player.minigame.current_x);
	player.minigame.current_y = BigInt(player.minigame.current_y);
	type ValueOf<T> = T extends Record<any, infer V> ? V : any;
	type ArrayContent<T> = T extends Array<infer C> ? C : any;
	const repl = player.minigame.replaces;
	for (const key in repl) {
		if (repl.hasOwnProperty(key)) {
			const arr = repl[key];
			if (Array.isArray(arr)) {
				for (const replacement of arr) {
					if (!replacement) continue;
					replacement.x = BigInt(replacement.x);

					replacement.y = BigInt(replacement.y);
				}
			}
		}
	}
	let new333: typeof player.minigame.replaces = {};
	if (Array.isArray(repl)) {
		for (let repl2 of repl) {
			let repl3 = repl2 as { room: number } & ArrayContent<
				ValueOf<typeof player.minigame.replaces>
			>;
			if (!new333[repl3.room]) new333[repl3.room] = [];
			new333[repl3.room].push(repl3);
		}
	}
	player.minigame.replaces = new333;
	// @ts-ignore
	delete player.hydra.dilute.solvent?.[9];
	// @ts-ignore
	delete player.hydra.dilute.lastSolvent?.[9];
	player.version = version;
}

export function loadSaves() {
	const current_save2 = localStorage.getItem('RBN-rewritten-current_save_slot');
	if (current_save2) {
		current_save = Number(current_save2);
	}
	player = getInitialPlayerData();
	const saveContent = localStorage.getItem(getSaveID(current_save));
	try {
		if (saveContent) {
			loadFromString(saveContent);
		}
	} catch (error) {
		console.error('Cannot load save');
		throw error;
	}
	player = createDeepValidatedReactive(player);
}

export function save() {
	localStorage.setItem(getSaveID(current_save), saveSerializer.serialize(player));
}
const savefunc = save;
export function hardReset(excludeKey?: (keyof Player)[]) {
	let tempplayer = getInitialPlayerData();
	(Object.keys(tempplayer) as (keyof Player)[]).forEach((key) => {
		if (!excludeKey?.includes?.(key)) {
			// @ts-expect-error
			player[key] = tempplayer[key];
		}
	});

	save();
	// location.reload();
}

export function import_file(): void {
	const a = document.createElement('input');
	a.setAttribute('type', 'file');
	a.setAttribute('accept', 'text/plain');
	a.click();
	a.onchange = () => {
		const fr = new FileReader();
		if (a.files == null) return void alert('未选择文件');
		fr.onload = () => {
			const save = fr.result;
			if (typeof save == 'string') {
				try {
					player = getInitialPlayerData();
					loadFromString(save);
					player = createDeepValidatedReactive(player);
					savefunc();
					location.reload();
				} catch {
					console.error('Cannot import save');
				}
			}
		};
		fr.readAsText(a.files[0]);
	};
}

export function export_file(): void {
	const str = saveSerializer.serialize(player);
	const file = new Blob([str], {
		type: 'text/plain',
	});
	window.URL = window.URL || window.webkitURL;
	const a = document.createElement('a');
	a.href = window.URL.createObjectURL(file);
	a.download = 'Road of Big Number Rewritten Save - ' + getCurrentBeijingTime() + '.txt';
	a.click();
}

function getCurrentBeijingTime(): string {
	const t = new Date(),
		e = t.getUTCFullYear(),
		r = String(t.getUTCMonth() + 1).padStart(2, '0'),
		a = String(t.getUTCDate()).padStart(2, '0'),
		n = t.getUTCHours(),
		g = t.getUTCMinutes(),
		i = t.getUTCSeconds(),
		S = t.getUTCMilliseconds();
	let o = (n + 8) % 24;
	return (
		o < 0 && (t.setUTCDate(t.getUTCDate() + 1), (o += 24)),
		`${e}-${r}-${a} ${o.toString().padStart(2, '0')}:${g.toString().padStart(2, '0')}:${i.toString().padStart(2, '0')}.${S.toString().padStart(3, '0')}`
	);
}

export function changeSave(id: number) {
	stopGameLoop();
	save();
	localStorage.setItem('RBN-rewritten-current_save_slot', id.toString());
	location.reload();
}
function formatDateToMMddHHmm(date: Date) {
	// 获取日期组成部分
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	// 返回格式化后的字符串
	return `${month}-${day} ${hours}:${minutes}`;
}
export function readSaveDetail(id: number) {
	const savecontent = localStorage.getItem(getSaveID(id));
	if (!savecontent) {
		return null;
	}
	const savecontent_str = saveSerializer.deserialize(savecontent) as KeyStringFromDecimal<Player>;
	const details = {
		version: 0,
		chapter: 0,
		number: '',
		isOrdinal: false,
		lastSave: '',
		id: id,
	};
	let a = '';
	details.version = savecontent_str.version;
	details.chapter = savecontent_str.stat.chapter;
	if (savecontent_str.stat.chapter >= 4) {
		details.isOrdinal = true;
		if (new Decimal(savecontent_str.hydra.deduceOrdinal[0]).gt(0)) {
			details.number = calculate(
				OrdinalUtils.numberToBMS(
					new Decimal(savecontent_str.hydra.deduceOrdinal[0]),
					DC.D_4,
					20,
				)
					.replace('...', '')
					.replace('>', ''),
			);
		} else {
			details.number = 'UNK';
		}
	} else {
		details.isOrdinal = false;
		details.number = format(savecontent_str.number);
	}
	details.lastSave = formatDateToMMddHHmm(new Date(savecontent_str.lastUpdated));
	return details;
}

// 深拷贝函数
export function deepCopy<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => deepCopy(item)) as unknown as T;
	}
	if (obj instanceof Decimal) {
		return new Decimal(obj) as T;
	}
	const copied = {} as T;
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			copied[key] = deepCopy(obj[key]);
		}
	}

	return copied;
}

// 备份函数，排除backup属性
function backupPlayer(player: Player): Player {
	// 创建不包含backup属性的副本
	const { backup, ...playerWithoutBackup } = player;

	// 深拷贝到backup属性
	player.backup = deepCopy(playerWithoutBackup) as Player;

	return player;
}
export function restoreBackup(backupedPlayer: Player) {
	player = backupedPlayer;
}
export function intervalBackup() {
	return backupPlayer(player);
}
