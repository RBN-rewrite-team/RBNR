import Decimal from 'break_eternity.js';
import { saveSerializer } from './serializer';
import { reactive } from 'vue';
import { notations } from '@/utils/format';
import { themes } from '@/utils/themes';
import type {qolUpgs} from '../exponention/qolupg';

const SAVEID = 'RBN-rewritten';
const version = 3 as const;
const zero = new Decimal(0);
type Upgrades = Record<
  '11'|'12'|'13'|
	'21'|'22'|'23'|'24'|'25'|'26'|
	'31'|'32'|'33'|'34'|'35'|'36'|'37'|'38'|'39'|
  '31R'|'32R'|'33R'|'34R'|
  '41'|'42'|'43'|'44'|
  qolUpgs, boolean>
  export type PrimeFactorTypes = 'pf2'|'pf3'|'pf5'|'pf7'|'pf11'|'pf13'|'pf17'|'pf19';
type Buyables = Record<
  '11'|'21'|'31'|'32'|'33'|
	'31R'|'32R'|'33R'|'34R'|'35R'|'36R'|'37R'|'38R'|
  PrimeFactorTypes|
  '41'|'42'|'43'|'44', Decimal>;
export interface Player {
	number: Decimal;
	version: typeof version;
	totalNumber: Decimal;
	lastUpdated: number;
	saveCreateTime: number;
	upgrades: Upgrades;
	buyables: Buyables;
	buyable11More: Decimal;
	automationCD: {
		successor: number;
	};
	numbertheory: {
		euler: {
			x: Decimal;
			y: Decimal;
			z: Decimal;
			s: Decimal;
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
	};
	stat: {
		totalNumber: Decimal;
		highestNumber: Decimal;
		totalMulpower: Decimal;
		highestMulpower: Decimal;
		totalAddpower: Decimal;
		hightestAddpower: Decimal;
		totalExppower: Decimal;
		highestExppower: Decimal;
	};
	challengein: [number, number];
}
function getInitialPlayerData(): Player {
	return {
		version: version,
		number: zero,
		totalNumber: zero,
		lastUpdated: Date.now(),
		saveCreateTime: Date.now(),
		addpower: zero,
		upgrades: {
			'11': false,
			'12': false,
			'13': false,
			'21': false,
			'22': false,
			'23': false,
			'24': false,
			'25': false,
			'26': false,
			'31': false,
			'32': false,
			'33': false,
			'34': false,
			'35': false,
			'36': false,
			'37': false,
			'38': false,
			'39': false,
			'31R': false,
			'32R': false,
      '33R': false,
      '34R': false,
      '41': false,
      '42': false,
      '43': false,
      '44': false,
      '400q': false,
      '411q': false,
      '412q': false,
      '413q': false,
      '414q': false,
      '415q': false,
      '421q': false,
      '422q': false,
      '423q': false,
      '424q': false,
      '425q': false,
      '431q': false,
      '432q': false,
      '433q': false,
      '434q': false,
      '435q': false,
      '441q': false,
      '442q': false,
      '443q': false,
      '444q': false,
      '445q': false,
      '451q': false,
      '452q': false,
      '453q': false,
      '454q': false,
      '455q': false,
		},
		buyables: {
			'11': zero,
			'21': zero,
			'31': zero,
			'32': zero,
			'33': zero,
			'31R': zero,
			'32R': zero,
			'33R': zero,
			'34R': zero,
			'35R': zero,
			'36R': zero,
			'37R': zero,
			'38R': zero,
			'41': zero,
			'42': zero,
			'43': zero,
			'44': zero,
			pf2: zero,
			pf3: zero,
			pf5: zero,
			pf7: zero,
			pf11: zero,
			pf13: zero,
			pf17: zero,
			pf19: zero,
		},
		buyable11More: zero,
		automationCD: {
			successor: 0,
		},
		numbertheory: {
			euler: {
				x: new Decimal(1),
				y: new Decimal(1),
				z: new Decimal(1),
				s: new Decimal(1),
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
		},
		stat: {
			totalNumber: zero,
			highestNumber: zero,
			totalMulpower: zero,
			highestMulpower: zero,
			totalAddpower: zero,
			hightestAddpower: zero,
			totalExppower: zero,
			highestExppower: zero,
		},
		challenges: [[zero, zero, zero, zero, zero]],
		challengein: [-1, -1],
	};
}

function rewriteDecimalValues(pl: any) {
	for (const key in pl) {
		if (typeof pl[key] === 'string') {
			if (!Decimal.isNaN(pl[key])) {
				pl[key] = new Decimal(pl[key]);
			}
		} else if (typeof pl[key] === 'object') {
			rewriteDecimalValues(pl[key]);
		}
	}
}

export function deepCopyProps(source: any, target: any) {
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			// 如果源对象的属性是对象或数组，则递归复制
			if (
				typeof source[key] === 'object' &&
				!(source[key] instanceof Decimal) &&
				source[key] !== null
			) {
				// 如果目标对象没有这个属性，或者属性是null，则创建一个新的
				if (
					!target.hasOwnProperty(key) ||
					target[key] == null ||
					Array.isArray(source[key]) !== Array.isArray(target[key])
				) {
					target[key] = Array.isArray(source[key]) ? [] : {};
				}
				// 递归复制属性
				deepCopyProps(source[key], target[key]);
			} else {
				// 如果属性不是对象或数组，则直接复制
				target[key] = source[key];
			}
		}
	}
}
export let player: Player = getInitialPlayerData();

export function loadFromString(saveContent: string) {
	let deserialized = saveSerializer.deserialize(saveContent);
	rewriteDecimalValues(deserialized);
	deepCopyProps(deserialized, player);
	player.version = version;
}

export function loadSaves() {
	player = getInitialPlayerData();
	const saveContent = localStorage.getItem(SAVEID);
	try {
		if (saveContent) {
			loadFromString(saveContent);
		}
	} catch {
		console.error('Cannot load save');
	}
	player = reactive(player);
}

export function save() {
	localStorage.setItem(SAVEID, saveSerializer.serialize(player));
}

export function hardReset() {
	player = getInitialPlayerData();
	save();
	location.reload();
}

export function import_file(): void {
	let a = document.createElement('input');
	a.setAttribute('type', 'file');
	a.setAttribute('accept', 'text/plain');
	a.click();
	a.onchange = () => {
		let fr = new FileReader();
		if (a.files == null) return void alert('未选择文件');
		fr.onload = () => {
			let save = fr.result;
			if (typeof save == 'string') {
				try {
					loadFromString(save);
				} catch (e) {
					console.error('Cannot import save');
				}
			}
		};
		fr.readAsText(a.files[0]);
	};
}

export function export_file(): void {
	let str = saveSerializer.serialize(player);
	let file = new Blob([str], {
		type: 'text/plain',
	});
	window.URL = window.URL || window.webkitURL;
	let a = document.createElement('a');
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
