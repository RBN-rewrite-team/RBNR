import Decimal from 'break_eternity.js';
import { player } from '@/core/save';

export const Cardinal = {
	playerData() {
		return {
			stability: 100,
			cardinality: 0,
			
			world_pos: [0, 0] as [number, number],
			openedmap: false,
			beacons: {
				respawn: [] as [number, number][],
				awaken: [] as [number, number][],
			},
		};
	},
	attribute: {
		health: {
			value(): number {
				let base = 100;
				base += cardinality * 100;
				return base;
			}
		},
		attack: {
			value(): number {
				let base = 10;
				base += cardinality * 10;
				return base;
			}
		},
		defeat: {
			value(): number {
				let base = 10;
				base += cardinality * 10;
				return base;
			}
		},
		speed: {
			value(): number {
				let base = 5;
				base += cardinality * 5;
				return base;
			}
		},
		miss: {
			value(): number {
				let base = 5;
				base += cardinality * 5;
				return base;
			}
		},
		accuracy: {
			value(): number {
				let base = 5;
				base += cardinality * 5;
				return base;
			}
		},
	},
};

export function posVisitable(x: number, y: number) {
	return true;
}
export function visit(x: number, y: number) {
	if (posVisitable(x, y)) player.cardinal.world_pos = [x, y];
}
export function posis(x: number, y: number) {
	return player.cardinal.world_pos[0] == x && player.cardinal.world_pos[1] == y;
}
export function worldPosChange(direction: 'up' | 'down' | 'right' | 'left') {
	switch (direction) {
		case 'up':
			visit(player.cardinal.world_pos[0], player.cardinal.world_pos[1] + 1);
			break;
		case 'down':
			visit(player.cardinal.world_pos[0], player.cardinal.world_pos[1] - 1);
			break;
		case 'right':
			visit(player.cardinal.world_pos[0] + 1, player.cardinal.world_pos[1]);
			break;
		case 'left':
			visit(player.cardinal.world_pos[0] - 1, player.cardinal.world_pos[1]);
			break;
	}
}
export function beaconsActivated(type: number, pos: [number, number]): boolean {
	if(type == 0) return player.cardinal.beacons.respawn.includes(pos);
	return player.cardinal.beacons.awaken.includes(pos);
}
export function posName(x: number, y: number) {
	if (x == 0 && y == 0) return 'Spawnpoint';
	if (x == 1 && y == 0) return 'Settings';
}