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

/**
 * 游戏物体 Nothingness（这里什么都没有）
 */
export class GameObject {
	constructor() {}
	interact(x: number, y: number) {}
	solid() {
		return false;
	}
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
export class GuardGameObject extends GameObject {
	tier: number;
	constructor(tier: number) {
		super();
		this.tier = tier;
	}
	solid() {
		return true;
	}
	interact(x: number, y: number): void {
		let guardinfo = guardBattleInfo(this.tier);
		player.minigame.interact = 1;
		ModalService.show({
			title: '守卫说了句话',
			content: `HP${guardinfo.hp} ATK${guardinfo.atk} DEF${guardinfo.def}, 点击确认以战斗`,
			onConfirm(values) {
				let battlestatus = runBattleFast(meBattleInfo(), guardinfo);
				if (battlestatus.status == 'fail')
					ModalService.show({
						title: '你似了',
						content: '你似了，如题。',
					});
				else {
					player.minigame.hp = battlestatus.hp_after_battle;
					player.minigame.replaces.push({
						room: player.minigame.current_room,
						x,
						y,
						replacedTo: '0',
					});
					player.minigame.xp += 1;
				}
				player.minigame.interact = 0;
			},
			onClose() {
				player.minigame.interact = 0;
			},
		});
	}
}
export class BoxGameObject extends GameObject {
	tier: number;
	constructor(tier: number) {
		super();
		this.tier = tier;
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
