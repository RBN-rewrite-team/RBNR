import Decimal from 'break_eternity.js';
import { saveSerializer } from './serializer';
import { reactive } from 'vue';
import { notations } from '@/utils/format'
import { themes } from '@/utils/themes';

const SAVEID = 'RBN-rewritten';
const version = 3 as const
const zero = new Decimal(0);

export interface Player {
	number: Decimal;
  version: typeof version;
	totalNumber: Decimal;
	lastUpdated: number;
	saveCreateTime: number;
	upgrades: {
		[key: string]: boolean;
	};
	buyables: {
		[key: string]: Decimal;
	};
	buyable11More: Decimal;
	automationCD: {
		successor: number;
	};
  numbertheory: {
    euler: {
      x: Decimal
    }
  }
	currentTab: number;
	addpower: Decimal;
	totalAddpower: Decimal;
	firstResetBit: number;
	multiplication: {
		mulpower: Decimal;
		totalMulpower: Decimal;
		pfTime: Decimal;
    B1seriesC1: 0|2|3|4|5;
	};
	options: {
	  notation: notations;
	  ui: {
		theme: themes;
	  };
	};
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
		},
		buyables: {
			'11': zero,
			'21': zero,
			'31': zero,
			'32': zero,
			'33': zero,
			'31R': zero,
			'32R': zero,
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
        x: new Decimal(1)
      }
    },
		currentTab: 0,
		totalAddpower: zero,
		firstResetBit: 0,
		multiplication: {
			mulpower: zero,
			totalMulpower: zero,
			pfTime: zero,
      B1seriesC1: 0,
		},
		options: {
		  notation: notations.SCIENTIFIC,
		  ui: {
			theme: themes.CLASSIC,
		  },
		}
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
