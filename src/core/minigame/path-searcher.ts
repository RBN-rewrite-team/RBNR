import { delay } from '@/utils/algorithm';
import { player } from '../save';
import { getCurrentBlock } from './block';
import {
	BoxGameObject,
	HealthRecoveryGameObject,
	KeyGameObject,
	OreGameObject,
} from './game-object';
import { interactBlock, type Directions } from './minigame-loop';
import { temp } from '../temp-data';

export type Path = {
	steps: bigint;
	x: bigint;
	y: bigint;
};
type Steps = { steps: bigint; x: bigint; y: bigint; prev: string | null };

/**
 * 返回玩家从x,y到destination_x, destination_y的路径
 *
 * @author By DeepSeek /bx/bx/bx
 * @param x
 * @param y
 * @param destination_x
 * @param destination_y
 * @returns
 */
export function getFastPath(
	room: number,
	x: bigint,
	y: bigint,
	destination_x: bigint,
	destination_y: bigint,
): Path[] {
	// 如果起点就是终点，直接返回
	if (x === destination_x && y === destination_y) {
		return [{ steps: 0n, x, y }];
	}

	// 方向数组：上、右、下、左
	const directions = [
		{ dx: 0n, dy: 1n }, // 上
		{ dx: 1n, dy: 0n }, // 右
		{ dx: 0n, dy: -1n }, // 下
		{ dx: -1n, dy: 0n }, // 左
	];

	// 使用Map来记录访问过的坐标和路径信息
	// key为坐标字符串 "x,y"，value为{steps, x, y, prev}
	const visited = new Map<string, Steps>();

	// 队列用于BFS
	const queue: Path[] = [];

	// 起点入队
	const startKey = `${x},${y}`;
	visited.set(startKey, { steps: 0n, x, y, prev: null });
	queue.push({ x, y, steps: 0n });

	let found = false;
	let endKey = '';

	// BFS遍历
	while (queue.length > 0 && !found) {
		const current = queue.shift()!;
		const currentKey = `${current.x},${current.y}`;
		const currentSteps = current.steps;

		// 检查四个方向
		for (const direction of directions) {
			const newX = current.x + direction.dx;
			const newY = current.y + direction.dy;
			const newKey = `${newX},${newY}`;

			// 如果已经访问过，跳过
			if (visited.has(newKey)) {
				continue;
			}

			// 检查是否可通行
			if (!playerSafe(getCurrentBlock(room, newX, newY))) {
				continue; // 不可通行，跳过
			}

			// 记录访问信息
			visited.set(newKey, {
				steps: currentSteps + 1n,
				x: newX,
				y: newY,
				prev: currentKey,
			});

			// 检查是否到达终点
			if (newX === destination_x && newY === destination_y) {
				found = true;
				endKey = newKey;
				break;
			}

			// 新坐标入队
			queue.push({ x: newX, y: newY, steps: currentSteps + 1n });
		}
	}

	// 如果没有找到路径，返回空数组
	if (!found) {
		return [];
	}

	// 回溯构建路径
	const path: Path[] = [];
	let currentKey: string | null = endKey;

	while (currentKey !== null) {
		const node: Steps = visited.get(currentKey)!;
		path.unshift({
			steps: node.steps,
			x: node.x,
			y: node.y,
		});
		currentKey = node.prev;
	}

	return path;
}
export function playerSafe(block: any) {
	return (
		block === null ||
		block instanceof OreGameObject ||
		block instanceof BoxGameObject ||
		block instanceof KeyGameObject ||
		block instanceof HealthRecoveryGameObject
	);
}
function valueUntilTrue(f: () => boolean) {
	return new Promise(function (resolve) {
		const a = setInterval(function () {
			let c = f();
			if (c) {
				clearInterval(a);
				resolve(c);
			}
		}, 50);
	});
}

export async function playerToDestination(destination_x: bigint, destination_y: bigint) {
	const paths = getFastPath(
		player.minigame.current_room,
		player.minigame.current_x,
		player.minigame.current_y,
		destination_x,
		destination_y,
	);
	if (paths.length == 0)
		throw new Error('Cannot find paths to ' + destination_x + ' ' + destination_y);
	temp.minigametip =
				'正在尝试前往' + destination_x + ',' + destination_y + '...如果玩家未移动可以点击玩家旁边的位置(0/'+paths.length+')';
	console.log(paths);
	player.minigame.interact = 5;
	let a = 0
	for (const path of paths) {
		a++
		const [rx, ry] = [player.minigame.current_x, player.minigame.current_y];
		player.minigame.current_x = path.x;
		player.minigame.current_y = path.y;
		temp.minigametip =
				'正在尝试前往' + destination_x + ',' + destination_y + '...如果玩家未移动可以点击玩家旁边的位置('+a+'/'+paths.length+')';
		interactBlock(
			player.minigame.current_room,
			path.x,
			path.y,
			directionof(rx, ry, path.x, path.y),
		);
		await valueUntilTrue(() => player.minigame.interact == 0 || player.minigame.interact == 5);
		player.minigame.interact = 5;
	}
	player.minigame.interact = 0;
}

export function directionof(x: bigint, y: bigint, x2: bigint, y2: bigint): Directions {
	if (x + 1n == x2 && y == y2) return 'right';
	if (x - 1n == x2 && y == y2) return 'left';
	if (x == x2 && y + 1n == y2) return 'down';
	if (x == x2 && y - 1n == y2) return 'up';
	return 'other';
}
