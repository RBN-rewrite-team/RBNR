// export enum GameObjectsEnum {
// 	SPAWN_POINT,
// 	WALL,
// 	DOOR,
// 	KEY,
// 	GUARD,
// 	WALL_INVISIBLE,
// 	BOX,
// 	ORE,
// 	TELEPORT,
// 	FAKE_WALL,
// 	DOOR_CHANCE,
// }

import ModalService from '@/utils/Modal';
import { player } from '../save';
import { guardBattleInfo, meBattleInfo, runBattleFast } from './battle';
import { currentPlayerLV, getWorldLevel, equipmentDisplay } from '.';
import { positionDirection } from './room';
import { addReplace, deleteRecovers } from './replacement';
import { getCurrentBlock } from './block';
import { temp } from '../temp-data';
import { runDeath } from './death-function';

import { type CoreEquipment } from '.';
import type { Directions } from './minigame-loop';
import { getMessage } from '@/utils/i18n';

/**
 * 游戏物体 Nothingness（这里什么都没有）
 */
export class GameObject {
	constructor() {}
	interact(x: bigint, y: bigint, direction: Directions) {}
	solid(direction: Directions = 'other', playerxy: [bigint, bigint]) {
		return false;
	}
	innerText = '';
}

export class SpawnPointGameObject extends GameObject {
	constructor() {
		super();
	}
}
export class WallGameObject extends GameObject {
	constructor() {
		super();
	}
	solid() {
		return true;
	}
}

export class WallInvisibleGameObject extends GameObject {
	constructor() {
		super();
	}
	solid() {
		return true;
	}
}
export class KeyRequiredWallInvisibleGameObject extends WallInvisibleGameObject {
	keyid: number;
	constructor(keyid: number) {
		super();
		this.keyid = keyid;
	}
	solid() {
		return !player.minigame.keys_have.includes(this.keyid);
	}
}
export class FakeWallGameObject extends WallGameObject {
	solid() {
		return false;
	}
}
export class TeleporterGameObject extends GameObject {
	destination: [bigint, bigint];
	room: number;
	constructor(destination: [bigint, bigint], room: number) {
		super();
		this.destination = destination;
		this.room = room;
	}
	interact(x: bigint, y: bigint): void {
		player.minigame.current_room = this.room;
		player.minigame.current_x = this.destination[0];
		player.minigame.current_y = this.destination[1];
		deleteRecovers();
		if (!player.minigame.visited.includes(this.room)) player.minigame.visited.push(this.room);
	}
	solid() {
		return false;
	}
}
export class PasswordGameObject extends GameObject {
	passwordVerifier: (password: string) => boolean;
	constructor(passwordVerifier: (password: string) => boolean) {
		super();
		this.passwordVerifier = passwordVerifier;
	}
	solid() {
		return true;
	}
	interact(x: bigint, y: bigint): void {
		const pV = this.passwordVerifier;
		ModalService.show({
			title: '密码门',
			content: '请输入密码',
			fields: [
				{
					type: 'input',
					validation(value) {
						return pV(value);
					},
				},
			],
			onConfirm(values: string[]) {
				if (pV(values[0])) {
					addReplace(player.minigame.current_room, x, y, '0');
				}
			},
		});
	}
}
export class 没做完TeleporterGameObject extends TeleporterGameObject {
	destination: [bigint, bigint];
	room: number;
	constructor(destination: [bigint, bigint], room: number) {
		super(destination, room);
		this.destination = destination;
		this.room = room;
	}
	interact(x: bigint, y: bigint): void {
		ModalService.show({
			title: '没做完',
			content: '没做完',
		});
	}
	solid() {
		return false;
	}
}
export class OreGameObject extends GameObject {
	constructor() {
		super();
	}
	interact(x: bigint, y: bigint): void {
		temp.minigametip = '你获得了矿石，全局速度+0.25%。';
		player.minigame.ore_gets++;
		addReplace(player.minigame.current_room, x, y, '0');
	}
	solid() {
		return false;
	}
}
export class DoorGameObject extends GameObject {
	keyid: number;
	constructor(keyid: number) {
		super();
		this.keyid = keyid;
	}
	interact(x: bigint, y: bigint): void {
		if (player.minigame.keys_have.includes(this.keyid)) {
			addReplace(player.minigame.current_room, x, y, '0');
			player.minigame.keys_have.filter((x) => x !== this.keyid);
		} else {
			temp.minigametip = '你需要一个钥匙才能开门';
		}
	}
	solid() {
		return true;
	}
}
export class EntityGameObject extends GameObject {
	tier: number;
	type: number = 1;
	innerText = '实体';
	rate = 2;
	constructor(tier: number) {
		super();
		this.tier = tier;
	}
	solid() {
		return true;
	}
	battleText() {
		const guardinfo = this.getBattleInfo();
		const battlestatus = runBattleFast(meBattleInfo(), guardinfo);
		if (battlestatus.status == 'fail') {
			return `<span style="color: rgb(127, 0, 0)">无法击败</span>`;
		}
		if (battlestatus.extendinfo.hp_cost >= meBattleInfo().hp / 2)
			return `<span style="color: red">HP-${battlestatus.extendinfo.hp_cost.toFixed(1)}</span>`;
		return `<span style="color: green">HP-${battlestatus.extendinfo.hp_cost.toFixed(1)}</span>`;
	}
	spoilsDecide() {
		let baseGain = Math.random() * this.rate;
		const list: CoreEquipment[] = [];
		while (baseGain >= 1) {
			const pos = Math.floor(Math.random() * 3);
			list.push({
				position: pos == 0 ? 'hea' : pos == 1 ? 'atk' : 'def',
				level: getWorldLevel(),
				rarity: Math.random() * 2, //直接倍率加成等级
				collaborate: [-1, -1], //没做完
			});
			baseGain--;
		}
		return list;
	}
	interact(x: bigint, y: bigint): void {
		const guardinfo = this.getBattleInfo();
		player.minigame.interact = 1;
		const innerText = this.innerText;
		const battlestatus = runBattleFast(meBattleInfo(), guardinfo);
		if (battlestatus.status == 'fail') {
			runDeath(innerText);
		} else {
			player.minigame.hp = battlestatus.hp_after_battle;
			addReplace(player.minigame.current_room, x, y, '0', true);
			const spoils = this.spoilsDecide();
			for (const i in spoils) {
				player.minigame.storeEquipments.push(spoils[i]);
				if (player.minigame.storeEquipments.length >= 50) {
					player.minigame.storeEquipments = player.minigame.storeEquipments
						.sort(function (a, b) {
							return -a.level * a.rarity ** 2 + b.level * b.rarity ** 2;
						})
						.filter((item, index) => {
							return index < 50;
						});
				}
			}
			player.minigame.xp += guardinfo.xp;
			temp.minigametip = '战斗胜利<br>';
			temp.minigametip += '获得了<span style="color: gold">' + guardinfo.xp + '</span>XP<br>';
			for (const i in spoils) {
				temp.minigametip += '获得了' + equipmentDisplay(spoils[i], getMessage) + '<br>';
			}
		}
		player.minigame.interact = 0;
	}
	getBattleInfo() {
		return guardBattleInfo(this.tier, this.type);
	}
}
export class GuardGameObject extends EntityGameObject {
	tier = 1;
	type = 1;
	rate = 2;
	innerText: string = '守卫';
	constructor(type: number) {
		super(1);
		this.tier = getWorldLevel();
		this.type = type;
		if (type == 3) ((this.innerText = '高级守卫'), (this.rate = 2.2));
		if (type == 4) ((this.innerText = '重型守卫'), (this.rate = 2.5));
		if (type == 5) ((this.innerText = '魔法师'), (this.rate = 2.5));
	}
}
export class BossGameObject extends EntityGameObject {
	tier = 2;
	type = 2;
	rate = 4;
	innerText: string = '守卫队长';
	constructor(type: number = 2) {
		super(1);
		this.tier = getWorldLevel();
		this.type = 2;
		this.rate = 2;
		if (type == 6) ((this.innerText = '使徒'), (this.rate = 5));
	}
}
export class BoxGameObject extends GameObject {
	tier: number;
	constructor(tier: number) {
		super();
		this.tier = tier;
		return this;
	}
	interact(x: bigint, y: bigint): void {
		let price = 0;
		if (this.tier == 1) price = Math.random() * 5 + 5;
		if (this.tier == 2) price = Math.random() * 25 + 25;
		if (this.tier == 3) price = Math.random() * 125 + 125;
		player.minigame.box_gets[this.tier - 1]++;
		((temp.minigametip = '你打开了宝箱，获得了' + price.toFixed(3) + '时间碎片。'),
			(player.timeshard.value = player.timeshard.value.add(price)));
		addReplace(player.minigame.current_room, x, y, '0', false);
	}
}
export class RestrictedBoxObject extends BoxGameObject {
	tier: number;
	constructor(tier: number) {
		super(tier);
		this.tier = tier;
	}
	interact(x: bigint, y: bigint): void {
		let restricted = false;
		for (let x2 = x - 3n; x2 <= x + 3n; x2++) {
			for (let y2 = y - 3n; y2 <= y + 3n; y2++) {
				const curblock = getCurrentBlock(player.minigame.current_room, x2, y2);
				if (curblock instanceof GuardGameObject) {
					restricted = true;
					break;
				}
			}
		}
		if (restricted) {
			temp.minigametip = '宝箱周围7x7内怪物清完才能打开';
		} else {
			BoxGameObject.prototype.interact.apply(this, [x, y]);
		}
	}
}
export class KeyGameObject extends GameObject {
	keyid: number;
	constructor(tier: number) {
		super();
		this.keyid = tier;
	}
	interact(x: bigint, y: bigint): void {
		((temp.minigametip = '你获得了钥匙'), player.minigame.keys_have.push(this.keyid));
		addReplace(player.minigame.current_room, x, y, '0');
	}
}
export class HealthRecoveryGameObject extends GameObject {
	percent: number;
	constructor(percent: number) {
		super();
		this.percent = percent;
	}
	interact(x: bigint, y: bigint): void {
		((temp.minigametip = '你回复了HP'),
			(player.minigame.hp += ((currentPlayerLV() * this.percent) / 100) * 10));
		addReplace(player.minigame.current_room, x, y, '0');
	}
}
export class MoveableBoxGameObject extends GameObject {
	solid(): boolean {
		return true;
	}
	interact(x: bigint, y: bigint, direction: 'up' | 'down' | 'left' | 'right'): void {
		const box_pos = positionDirection([x, y], direction);
		const goalBlock = getCurrentBlock(player.minigame.current_room, box_pos[0], box_pos[1]);
		if (goalBlock === null || goalBlock instanceof SwitchGameObject) {
			addReplace(player.minigame.current_room, x, y, '0');
			if (!goalBlock || !(goalBlock instanceof SwitchGameObject)) {
				addReplace(player.minigame.current_room, box_pos[0], box_pos[1], 'BOX');
			} else if (goalBlock instanceof SwitchGameObject && !goalBlock.actived) {
				addReplace(player.minigame.current_room, box_pos[0], box_pos[1], 'ACTIVE_SWITCH');
				player.minigame.keys_have.push(goalBlock.keyid);
			}
			const player_moved = positionDirection(
				[player.minigame.current_x, player.minigame.current_y],
				direction,
			);
			player.minigame.current_x = player_moved[0];
			player.minigame.current_y = player_moved[1];
		} else {
			temp.minigametip = '推不动可以点击箱子拿起';
		}
	}
}
export class SwitchGameObject extends GameObject {
	actived = false;
	keyid = 13.002;
	solid(): boolean {
		return false;
	}
}
export class SwitchOnGameObject extends SwitchGameObject {
	actived = true;
	solid(): boolean {
		return false;
	}
}

export class HighPlaceGameObject extends GameObject {
	solid(direction: Directions, playerxy: [bigint, bigint]): boolean {
		const curblock = getCurrentBlock(player.minigame.current_room, ...playerxy);
		return !(
			curblock instanceof HighPlaceGameObject || curblock instanceof HighPlaceClimbGameObject
		);
	}
}
export class HighPlaceClimbGameObject extends GameObject {
	solid(direction: Directions, playerxy: [bigint, bigint]) {
		return false;
	}
}
