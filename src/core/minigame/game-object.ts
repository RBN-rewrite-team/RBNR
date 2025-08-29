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
import { currentPlayerLV } from '.';
import { getCurrentBlock } from './room';

/**
 * 游戏物体 Nothingness（这里什么都没有）
 */
export class GameObject {
	constructor() {}
	interact(x: number, y: number) {}
	solid() {
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
export class FakeWallGameObject extends WallGameObject {
	solid() {
		return false;
	}
}
export class TeleporterGameObject extends GameObject {
	destination: [number, number];
	room: number;
	constructor(destination: [number, number], room: number) {
		super();
		this.destination = destination;
		this.room = room;
	}
	interact(x: number, y: number): void {
		player.minigame.current_room = this.room;
		player.minigame.current_x = this.destination[0];
		player.minigame.current_y = this.destination[1];
	}
	solid() {
		return false;
	}
}
export class 没做完TeleporterGameObject extends TeleporterGameObject {
	destination: [number, number];
	room: number;
	constructor(destination: [number, number], room: number) {
		super(destination, room);
		this.destination = destination;
		this.room = room;
	}
	interact(x: number, y: number): void {
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
	interact(x: number, y: number): void {
		ModalService.show({
			title: '你获得了矿石',
			content: '你获得了矿石，全局速度+0.25%。',
		});
		player.minigame.ore_gets++;
		player.minigame.replaces.push({
			room: player.minigame.current_room,
			x,
			y,
			replacedTo: '0',
		});
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
	interact(x: number, y: number): void {
		if (player.minigame.keys_have.includes(this.keyid)) {
			player.minigame.replaces.push({
				room: player.minigame.current_room,
				x,
				y,
				replacedTo: '0',
			});
			player.minigame.keys_have.filter((x) => x !== this.keyid);
		} else {
			ModalService.show({
				title: '打不开门',
				content: '你需要一个钥匙才能开门',
			});
		}
	}
	solid() {
		return true;
	}
}
export class EntityGameObject extends GameObject {
	tier: number;
	type: number = 1;
	innerText: '实体';
	constructor(tier: number) {
		super();
		this.tier = tier;
	}
	solid() {
		return false;
	}
	interact(x: number, y: number): void {
		let guardinfo = guardBattleInfo(this.tier, this.type);
		player.minigame.interact = 1;
		ModalService.show({
			title: this.innerText + '属性',
			content: `生命值${guardinfo.hp} 攻击力${guardinfo.atk} 防御力${guardinfo.def}, 点击确认以战斗`,
			onConfirm(values) {
				let battlestatus = runBattleFast(meBattleInfo(), guardinfo);
				if (battlestatus.status == 'fail')
				{
					ModalService.show({
						title: '死亡',
						content: '你被' + this.innerText + '击杀，返回出生点并清空等级(没做)。获得了 0 技能点(也没做)。',
					});
				}
				else {
					player.minigame.hp = battlestatus.hp_after_battle;
					player.minigame.replaces.push({
						room: player.minigame.current_room,
						x,
						y,
						replacedTo: '0',
					});
					player.minigame.xp += guardinfo.xp;
				}
				player.minigame.interact = 0;
			},
			onClose() {
				player.minigame.interact = 0;
			},
		});
	}
}
export class GuardGameObject extends EntityGameObject {
	tier = 1;
	type = 1;
	innerText: string = '守卫';
	constructor() {
		super(1);
		this.tier = 1;
		this.type = 1;
	}
}
export class BossGameObject extends GuardGameObject {
	tier = 2;
	type = 2;
	innerText: string = '守卫队长';
	constructor() {
		super(1);
		this.tier = 2;
		this.type = 2;
	}
}
export class BoxGameObject extends GameObject {
	tier: number;
	constructor(tier: number) {
		super();
		this.tier = tier;
		return this;
	}
	interact(x: number, y: number): void {
		let price = 0;
		if (this.tier == 1) price = Math.random() * 5 + 5;
		if (this.tier == 2) price = Math.random() * 25 + 25;
		if (this.tier == 3) price = Math.random() * 125 + 125;
		ModalService.show({
			title: '你打开了宝箱',
			content: '你打开了宝箱，获得了' + price.toFixed(3) + '时间碎片。',
		});
		player.timeshard.value += price;
		player.minigame.replaces.push({
			room: player.minigame.current_room,
			x,
			y,
			replacedTo: '0',
		});
	}
}
export class RestrictedBoxObject extends BoxGameObject {
	tier: number;
	constructor(tier: number) {
		super(tier);
		this.tier = tier;
	}
	interact(x: number, y: number): void {
		let restricted = false;
		for (let x2 = x - 3; x2 <= x + 3; x2++) {
			for (let y2 = y - 3; y2 <= y + 3; y2++) {
				let curblock = getCurrentBlock(player.minigame.current_room, x2, y2);
				if (curblock instanceof GuardGameObject) {
					restricted = true;
					break;
				}
			}
		}
		if (restricted) {
			ModalService.show({
				title: '无法打开箱子',
				content: '宝箱周围7x7内怪物清完才能打开',
			});
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
	interact(x: number, y: number): void {
		ModalService.show({
			title: '你获得了钥匙',
			content: '你获得了钥匙',
		});
		player.minigame.keys_have.push(this.keyid);
		player.minigame.replaces.push({
			room: player.minigame.current_room,
			x,
			y,
			replacedTo: '0',
		});
	}
}
export class HealthRecoveryGameObject extends GameObject {
	percent: number;
	constructor(percent: number) {
		super();
		this.percent = percent;
	}
	interact(x: number, y: number): void {
		ModalService.show({
			title: '你回复了HP',
			content: '你回复了HP',
		});
		player.minigame.hp += ((currentPlayerLV() * this.percent) / 100) * 10;
		player.minigame.replaces.push({
			room: player.minigame.current_room,
			x,
			y,
			replacedTo: '0',
		});
	}
}
