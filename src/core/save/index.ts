import Decimal from 'break_eternity.js';
import { saveSerializer } from './serializer';
import { reactive } from 'vue';
import { notations } from '@/utils/format';
import { themes } from '@/utils/themes';
import type { qolUpgs } from '../exponention/qolupg';
import type { IAstronomer } from '../exponention/logarithm';
import type { IntRange } from 'type-fest';
import { buyables, upgrades } from '../mechanic';


const SAVEID = 'RBN-rewritten-powerful-refactor-test';
const version = 3 as const;
const zero = new Decimal(0);
export type PrimeFactorTypes = 'pf2' | 'pf3' | 'pf5' | 'pf7' | 'pf11' | 'pf13' | 'pf17' | 'pf19';

type Milestones = Record<
  `cb${IntRange<1,21>}`  |"log_law1"|"log_law2"|"log_law3"|"log_G",
	boolean
>;
export interface Player {
	number: Decimal;
	version: typeof version;
	totalNumber: Decimal;
	lastUpdated: number;
	saveCreateTime: number;
	upgrades: Record<keyof typeof upgrades,boolean>;
	buyables: Record<keyof typeof buyables, Decimal>;
	milestones: Milestones;
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
		}
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
	frozen: boolean;
	run_a_tick_and_froze: boolean;
}
function getInitialPlayerData(): Player {
	return {
		version: version,
		number: zero,
		frozen:false,
		run_a_tick_and_froze: false,
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
			'45': false,
			'46': false,
			'47': false,
			'48': false,
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
			'41R': zero,
			'42R': zero,
			'43R': zero,
			'44R': zero,
			'41': zero,
			'42': zero,
			'43': zero,
			'44': zero,
			'cb1': zero,
			pf2: zero,
			pf3: zero,
			pf5: zero,
			pf7: zero,
			pf11: zero,
			pf13: zero,
			pf17: zero,
			pf19: zero,
			lgr_emp: zero,
			lgr_impr: zero,
		},
		milestones: {
		  "cb1": false,
		  "cb2": false,
		  "cb3": false,
		  "cb4": false,
		  "cb5": false,
		  "cb6": false,
		  "cb7": false,
		  "cb8": false,
		  "cb9": false,
		  "cb10": false,
		  "cb11": false,
		  "cb12": false,
		  "cb13": false,
		  "cb14": false,
		  "cb15": false,
		  "cb16": false,
		  "cb17": false,
		  "cb18": false,
		  "cb19": false,
		  "cb20": false,
		  "log_law1": false,
		  "log_law2": false,
		  "log_law3": false,
		  "log_G": false,
		},
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
			}
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
		if (key==="upgrades_in_dilated") continue;
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
