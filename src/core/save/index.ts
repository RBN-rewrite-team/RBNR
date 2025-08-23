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

const version = 7 as const;
const zero = new Decimal(0);
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
		value: number;
		tf: number;
		cd: [number, number, number];
		last: [number, number, number];
		openTf: boolean;
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
			solution: number;
			lastDeduce: Decimal;
			solute: Decimal;
			solutionCost: number;
			prions: Decimal;
			highestApocalypse: Decimal;
		};
	};
	nonrecu: {
		power: Decimal;
		totalPower: Decimal;
		resetTimes: Decimal;
		studies_bought: number[];
	};
}

function getInitialPlayerData(): Player {
	return {
		version: version,
		number: zero,
		frozen: false,
		run_a_tick_and_froze: false,
		totalNumber: zero,
		lastUpdated: Date.now(),
		saveCreateTime: Date.now(),
		addpower: zero,
		upgrades: Object.fromEntries(Object.keys(upgrades).map((key) => [key, false])) as Record<
			keyof typeof upgrades,
			boolean
		>,
		buyables: Object.fromEntries(
			Object.keys(buyables).map((key) => [key, new Decimal(0)]),
		) as Record<keyof typeof buyables, Decimal>,
		milestones: Object.fromEntries(
			Object.keys(milestones).map((key) => [key, false]),
		) as Record<keyof typeof milestones, boolean>,
		buyable11More: zero,
		automationCD: {
			successor: 0,
		},
		numbertheory: {
			visiting: 1,
			euler: {
				x: new Decimal(1),
				y: new Decimal(1),
				z: new Decimal(1),
				s: new Decimal(1),
			},
			rational_approx: {
				n: new Decimal(1),
				m: new Decimal(1),
				y: new Decimal(1),
			},
			GH: {
				x: new Decimal(11),
				t31: new Decimal(0),
				t32: new Decimal(0),
				t33: new Decimal(0),
			},
			GM: {
				x: new Decimal(0),
			},
		},
		currentTab: 0,
		totalAddpower: zero,
		firstResetBit: 0,
		multiplication: {
			mulpower: zero,
			totalMulpower: zero,
			pfTime: zero,
			B1seriesC1: 0,
			B1seriesC1400q: 0,
		},
		exponention: {
			exppower: zero,
			totalExppower: zero,
			qolpoints: zero,
			logarithm: {
				observe_datas: zero,
				calculate_datas: zero,
				astronomers: [],
				in_dilate: false,
				upgrades_in_dilated: [],
				buyables_in_dilated: [],
				highest_dilate: new Decimal(1),
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
			totalNumber: zero,
			highestNumber: zero,
			totalMulpower: zero,
			highestMulpower: zero,
			totalAddpower: zero,
			hightestAddpower: zero,
			totalExppower: zero,
			highestExppower: zero,
			highestOrdLevel: 0,
		},
		challenges: [[zero, zero, zero, zero, zero]],
		challengein: [-1, -1],
		singularity: {
			t: 0,
			stage: 0,
			enabled: false,
		},
		ordinal: {
			number: new Decimal(10),
			booster: {
				mult: new Decimal(1),
			},
		},
		help: {
			page: 1,
			milestone: 0,
			epsilon: false,
		},
		timeshard: {
			value: 0,
			tf: 0,
			cd: [Date.now(), Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000],
			last: [0, 0, 0],
			openTf: false,
		},
		hydra: {
			visiting: 0,
			power: zero,
			totalPower: zero,
			trueTotalPower: zero,
			milestoneDut5Eff: new Decimal(1),
			powerMult: [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)],
			deduceProgress: [zero, zero, zero, zero],
			deduceOrdinal: [zero, zero, zero, zero],
			totalDeduceOrdinal: [zero, zero, zero, zero],
			prestige: [zero, zero, zero, zero],
			pAuto: [false, false, false, false],
			dilute: {
				inDilute: false,
				solvent: [0, 0, 0, 0, 0, 0, false, false, false],
				lastSolvent: [0, 0, 0, 0, 0, 0, false, false, false],
				lastDeduce: zero,
				spentTime: 0,
				solution: 0,
				solutionCost: 0,
				solute: zero,
				prions: new Decimal(1),
				highestApocalypse: zero,
			},
		},
		nonrecu: {
			power: zero,
			totalPower: zero,
			resetTimes: zero,
			studies_bought: [],
		},
	};
}

type DeepPartial<T> = T extends (infer U)[]
	? DeepPartial<U>[] | undefined
	: T extends object
		? { [P in keyof T]?: DeepPartial<T[P]> }
		: T;

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

			if (
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

			if (
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
		player.hydra.power = new Decimal('e2466');
		player.hydra.powerMult = [new Decimal(1), new Decimal(1), new Decimal(1), new Decimal(1)];
		player.hydra.prestige = [
			new Decimal('e345'),
			new Decimal('e55'),
			new Decimal('3.7'),
			new Decimal('5e35'),
		];
	}
	if ((player?.version ?? 0) < 7 && player.upgrades['616S']) {
		if (player.nonrecu.resetTimes.gte(1)) player.firstResetBit |= 0b10000;
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
export function hardReset() {
	player = getInitialPlayerData();
	save();
	location.reload();
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
			details.number = calculate(
				OrdinalUtils.numberToBMS(
					new Decimal(savecontent_str.hydra.deduceOrdinal[0]),
					new Decimal(4),
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
