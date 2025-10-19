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
import { NON_RECURSIVE } from '../nonrecu/index.ts';
import { initMiniGameData, hardResetMiniGame, type PlayerMinigameData } from '../minigame/index.ts';
import { DC } from '@/core/constants';
import type { FixedLengthArray } from 'type-fest';
import { getInitialStat, type PlayerStat } from '../stats.ts';
import { wellOrderPlayerData } from '../ordinal/well_ordering.ts';
import { Hydra } from '../hydra/hydra.ts';
import { POST_NONREC } from '../post-nonrec/index.ts';

const version = 12 as const;
export let current_save = 0;
export type PrimeFactorTypes = 'pf2' | 'pf3' | 'pf5' | 'pf7' | 'pf11' | 'pf13' | 'pf17' | 'pf19';
type KeyStringFromDecimal<T> = {
	[key in keyof T]: T[key] extends Decimal
		? string
		: T[key] extends object
			? KeyStringFromDecimal<T[key]>
			: T[key];
};

const SpecialCheatedSave = "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"

function getSaveID(id: number) {
	if (id == 0) {
		return 'RBN-rewritten-powerful-refactor-test';
	} else {
		return `RBN-rewritten-save-${id}`;
	}
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
		well_ordering: ReturnType<typeof wellOrderPlayerData>;
	};
	currentTab: number;
	addpower: Decimal;
	totalAddpower: Decimal;
	firstResetBit: number;
	challenges: Decimal[][];
	achievements: number[];
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
		music: number;
		music_url: string;
		isGuoGao: boolean;
		hardMode: boolean;
	};
	stat: PlayerStat;
	challengein: FixedLengthArray<number, 2>;
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
		cd: FixedLengthArray<number, 3>;
		last: FixedLengthArray<number, 3>;
		openTf: boolean;
		next: FixedLengthArray<number, 3>;
		unlAuto: boolean;
	};
	hydra: ReturnType<typeof Hydra.playerData>;
	nonrecu: ReturnType<typeof NON_RECURSIVE.playerData>;
	minigame: PlayerMinigameData;
	backup?: Omit<Player, 'backup'> | null;
	foundNaN: boolean;
	checkedPlots: number[];
	automator: {
		running: boolean;
		code: string;
		currentBlockPos: number;
	};
	retribution: 0 | 1 | 2 | 3 | 4;
	postnonrec: ReturnType<typeof POST_NONREC.playerData>;
}

function getInitialPlayerData(): Player {
	return {
		version: version,
		number: DC.D_0,
		frozen: false,
		achievements: [],
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
			well_ordering: wellOrderPlayerData(),
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
			music: 0,
			music_url: '',
			challengeDetial: false,
			allowOffline: true,
			isGuoGao: false,
			hardMode: false,
		},
		stat: getInitialStat(),
		challenges: [
			[DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0],
			[DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0, DC.D_0],
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
			unlAuto: false,
		},
		hydra: Hydra.playerData(),
		nonrecu: NON_RECURSIVE.playerData(),
		foundNaN: false,
		checkedPlots: [],
		automator: {
			running: false,
			code: '',
			currentBlockPos: 0,
		},
		retribution: 0,
		postnonrec: POST_NONREC.playerData(),
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
function deepMerge<T extends object>(source: T, target: object, expectedKey?: string[]): T;
function deepMerge<T extends unknown[]>(source: T, target: unknown[], expectedKey?: string[]): T;
function deepMerge<T>(source: T, target: DeepPartial<T>, expectedKey?: string[]): T {
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
				result[i] = deepMerge(
					sourceItem,
					targetItem as DeepPartial<typeof sourceItem>,
					expectedKey,
				);
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
			if ((expectedKey ?? []).includes(key)) continue;
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
				result[key] = deepMerge(sourceValue, targetValue, expectedKey) as T[Extract<
					keyof T,
					string
				>];
			} else if (sourceValue instanceof Decimal) {
				result[key] = new Decimal(targetValue as DecimalSource) as T[Extract<
					keyof T,
					string
				>];
			} else if (targetValue !== null && typeof targetValue === 'object') {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				result[key] = deepMerge(targetValue, sourceValue as any, expectedKey);
			} else {
				result[key] = targetValue;
			}
		}

		return result as T;
	}

	return target !== undefined && target !== null ? (target as T) : source;
}

export let player: Player = getInitialPlayerData();

export function loadFromString(saveContent: string, non_options = false) {
	const deserialized = saveSerializer.deserialize(saveContent);
	Object.assign(
		player,
		deepMerge(
			player,
			deserialized,
			non_options ? (['options'] satisfies (keyof Player)[]) : [],
		),
	);
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
	if ((player?.version ?? 0) < 12) {
		player.hydra.deduceOrdinal[1] = new Decimal(0);
		player.hydra.deduceOrdinal[2] = new Decimal(0);
		player.hydra.deduceOrdinal[3] = new Decimal(0);
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
		player.minigame.replaces = new333;
	}
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
	player = reactive(player);
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
				  if (save === SpecialCheatedSave) throw new Error("?")
					player = getInitialPlayerData();
					loadFromString(save);
					player = reactive(player);
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
			details.number = format(savecontent_str.hydra.deduceOrdinal[0]);
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
	if (player.foundNaN) return player;
	return backupPlayer(player);
}
