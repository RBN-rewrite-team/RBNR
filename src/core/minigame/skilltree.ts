import Decimal from 'break_eternity.js';
import { player } from '../save';
import { Currencies, getCurrency } from '../currencies';
import { CHALLENGE } from '../challenge';
import { ref, nextTick, type ComponentPublicInstance, computed, type Ref } from 'vue';
import { format } from '@/utils/format';
import type { StudyConfig as 何意味 } from '../nonrecu/studies';

const StudyTreeRef = ref(null);

function or(...ids: (number | boolean)[]): boolean {
	let result = false;
	for (const id of ids) {
		if (typeof id === 'number')
			result = result || player.minigame.skilltree_bought.includes(id);
		else result = result || id;
	}
	return result;
}

function and(...ids: (number | boolean)[]): boolean {
	let result = true;
	for (const id of ids) {
		if (typeof id === 'number')
			result = result && player.minigame.skilltree_bought.includes(id);
		else result = result && id;
	}
	return result;
}

function sum(...ids: (number | boolean)[]): number {
	let result = 0;
	for (const id of ids) {
		if (typeof id === 'number') result += Number(player.minigame.skilltree_bought.includes(id));
		else result += Number(id);
	}
	return result;
}
type StudyConfig = 何意味 & {
	isChallenge?: never;
	chal_id?: never;
};
class Study {
	config: StudyConfig;
	constructor(config: StudyConfig) {
		this.config = config;
	}
	get id() {
		return this.config.id;
	}
	get description() {
		if (this.isChallenge) {
			return `非递归挑战${this.chalID + 1}${CHALLENGE.inChallenge(1, this.chalID) ? '(挑战中)' : ''}<br>目标:${this.config.description.split('\t')[1] ?? ''}`;
		}
		return this.config.description;
	}
	get cost() {
		return this.config.cost;
	}
	canBuy() {
		return this.config.canBuy?.() ?? true;
	}
	get effect() {
		return this.config.effect?.();
	}
	get effectDesc() {
		return this.config.effectDesc?.();
	}
	onBought() {
		return this.config.onBought?.();
	}
	get isChallenge() {
		return this.config.isChallenge ?? false;
	}
	get chalID() {
		return this.config.chal_id ?? -1;
	}
	show() {
		return this.config.show?.() ?? true;
	}
}

export const studies = [
	new Study({
		id: '11', //0
		description: '每级额外多2生命值',
		cost: new Decimal(5),
	}),
	new Study({
		id: '21', // 1
		description: '基础攻击+1',
		cost: new Decimal(10),
		canBuy() {
			return or(0);
		},
	}),
	new Study({
		id: '22', // 2
		description: '基础HP+5',
		cost: new Decimal(10),
		canBuy() {
			return or(0);
		},
	}),
	new Study({
		id: '31', // 3
		description: 'HP*1.5',
		cost: new Decimal(15),
		canBuy() {
			return or(1, 2);
		},
	}),
	new Study({
		id: '41', // 4
		description: '攻击*1.2',
		cost: new Decimal(40),
		canBuy() {
			return or(3);
		},
	}),
] as const;

export function canBuyStudies(id: number) {
	if (player.minigame.skilltree_bought.includes(5)) return false;
	const study = studies[id] as Study | undefined;
	if (!study) return false;
	if (player.minigame.skilltree_bought.includes(id)) return false;
	if (player.minigame.skillpoint < study.cost.toNumber()) return false;
	if (!study.canBuy()) return false;
	return true;
}
export function buyStudies(id: number) {
	const study = studies[id] as Study | undefined;
	if (!study) return;
	if (!canBuyStudies(id)) return;
	player.minigame.skillpoint -= study.cost.toNumber();
	player.minigame.skilltree_bought.push(id);
	study.onBought();
}
