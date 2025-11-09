// import { deepCopy } from '../save';
// import type { GameObject } from './game-object';

import { getMessage } from '@/utils/i18n';
import { player } from '../save';
import type { initializeInfo } from './room';
import type { $t } from '@/utils/types';

// import { maps, type SingleMap } from './map';
type Replacements = {
	x: bigint;
	y: bigint;
	replacedTo: string;
	recover?: boolean;
};
export type CoreEquipment = {
	position: 'hea' | 'atk' | 'def';
	level: number;
	rarity: number;
	collaborate: [number, number]; //没做完
	destroyed?: boolean;
	equipped?: boolean;
};
export type CoreEquipmentAttribute = {
	realLevel: number;
	hea: number;
	atk: number;
	def: number;
};
export function equipmentDisplay(eq: CoreEquipment, $t: $t): string {
	const rar =
		eq.rarity >= 1.9
			? '<span style="color: cyan">' + $t('dung.core.levels.5') + '</span>'
			: eq.rarity >= 1.8
				? '<span style="color: red">' + $t('dung.core.levels.4') + '</span>'
				: eq.rarity >= 1.6
					? '<span style="color: orange">' + $t('dung.core.levels.3') + '</span>'
					: eq.rarity >= 1.4
						? '<span style="color: purple">' + $t('dung.core.levels.2') + '</span>'
						: eq.rarity >= 1.0
							? '<span style="color: blue">' + $t('dung.core.levels.1') + '</span>'
							: '<span>' + $t('dung.core.levels.0') + '</span>';
	return (
		rar +
		'#' +
		(eq.position == 'hea' ? '支持部' : eq.position == 'atk' ? '打击部' : '防御部') +
		'(Lv. ' +
		eq.level +
		')'
	);
}
export function equipmentAttribute(eq: CoreEquipment): CoreEquipmentAttribute {
	const realLevel = eq.level * eq.rarity ** 2;
	return {
		realLevel: realLevel,
		hea: realLevel * 4 * (eq.position == 'hea' ? 1 : 0.2),
		atk: realLevel * 1 * (eq.position == 'atk' ? 1 : 0.2),
		def: realLevel * 0.4 * (eq.position == 'def' ? 1 : 0.2),
	};
}
export function totEqAtt(): CoreEquipmentAttribute {
	let hea = 0,
		atk = 0,
		def = 0;
	let i = 'hea' as 'hea' | 'atk' | 'def';
	for (i in player.minigame.coreEquipments) {
		if (player.minigame.coreEquipments[i].length == 0) continue;
		hea += equipmentAttribute(player.minigame.coreEquipments[i][0]).hea;
		atk += equipmentAttribute(player.minigame.coreEquipments[i][0]).atk;
		def += equipmentAttribute(player.minigame.coreEquipments[i][0]).def;
	}
	return {
		realLevel: 0,
		hea: hea,
		atk: atk,
		def: def,
	};
}
export interface PlayerMinigameData {
	current_room: number;
	visited: number[];
	current_x: bigint;
	current_y: bigint;
	ateditor: boolean;
	replaces: {
		[key: string]: Replacements[];
	};
	hp: number;
	interact: number;
	xp: number;
	ore_gets: number;
	keys_have: number[];
	box_gets: number[];
	direction: 'up' | 'down' | 'left' | 'right';
	taking_box: boolean;
	editor_mode: 'replace' | 'remove';
	block: 'W' | '0' | 'FAKEWALL';
	initializeType: initializeInfo;
	skillpoint: number;
	skilltree_bought: number[];
	coreEquipments: {
		hea: CoreEquipment[];
		atk: CoreEquipment[];
		def: CoreEquipment[];
	};
	storeEquipments: CoreEquipment[];
}
export function initMiniGameData(): PlayerMinigameData;
export function initMiniGameData(): PlayerMinigameData {
	const a = {
		current_room: 0,
		visited: [],
		current_x: 1n,
		current_y: 1n,
		replaces: {
			0: [],
		},
		keys_have: [],
		hp: 10,
		interact: 0,
		xp: 0,
		ore_gets: 0,
		box_gets: [0, 0, 0],
		direction: 'left',
		taking_box: false,
		ateditor: false,
		editor_mode: 'replace',
		block: '0',
		initializeType: {
			initializeType: 'rect',
			rect_width: 7n,
			rect_height: 7n,
		},
		skillpoint: 0,
		skilltree_bought: [],
		coreEquipments: {
			hea: [],
			atk: [],
			def: [],
		},
		storeEquipments: [],
	} satisfies PlayerMinigameData;
	return a;
}
// export function writeContext(ctx: CanvasRenderingContext2D) {}

export { miniGameLoop } from './minigame-loop';
export { keyboardEventListener } from './minigame-loop';

export function currentPlayerLV() {
	return Math.floor((-1 + (8 * player.minigame.xp + 1) ** 0.5) / 2 + 1);
}

export function nextLVxp() {
	return (currentPlayerLV() * (currentPlayerLV() + 1)) / 2;
}

export function LVpercent() {
	const k =
		(currentPlayerLV() * (currentPlayerLV() + 1)) / 2 -
		(currentPlayerLV() * (currentPlayerLV() - 1)) / 2;
	return (player.minigame.xp - (currentPlayerLV() * (currentPlayerLV() - 1)) / 2) / k;
}

export function hardResetMiniGame() {
	player.minigame = initMiniGameData();
}

export function predictableBigIntRandom(x: bigint): number {
	let start = 232344573n * (x % 97n) ** 4n;
	const a = 15485863n;
	const b = 521791n;
	start = (start * a) % b;
	for (let i = 0; i < ((x * x) % 90n) + 90n; i++) {
		start = (start * a) % b;
	}
	return Number(start) / 521791;
}

export function getWorldLevel() {
	try {
		const base = [
			1, 10, 1, 1e100, 1e100, 1e100, 1e100, 1e100, 1e100, 1e100, 1e100, 1e100, 1e100, 1e100,
			1e100,
		];
		return (
			base[player.minigame.current_room] +
			Math.max(0, Math.floor(currentPlayerLV() / 2) - base[player.minigame.current_room] / 2)
		);
	} catch (err) {
		return 1;
	}
}

export function equipmentDestroyLoop() {
	player.minigame.storeEquipments = player.minigame.storeEquipments.filter((item) => {
		return !item.destroyed;
	});
}
