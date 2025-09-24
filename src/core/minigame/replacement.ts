import { player } from '../save';
import { blockToJSON, getCurrentBlock } from './block';
import {
	BoxGameObject,
	FakeWallGameObject,
	GameObject,
	MoveableBoxGameObject,
	RestrictedBoxObject,
	SwitchOnGameObject,
	WallGameObject,
	WallInvisibleGameObject,
} from './game-object';

type ArrayContent<T> = T extends Array<infer C> ? C : any;
export function replacement(
	bl: GameObject | null | undefined,
	replacement: ArrayContent<typeof player.minigame.replaces>,
) {
	if (replacement.replacedTo == '0') {
		return null;
	}
	if (replacement.replacedTo == 'FAKEWALL') {
		// toJSON avaliable
		return new FakeWallGameObject();
	}
	if (replacement.replacedTo == 'WALL_INVISIBLE') {
		return new WallInvisibleGameObject();
	}
	if (replacement.replacedTo == 'W') {
		// toJSON avaliable
		return new WallGameObject();
	}
	let tryexec = /TIERBOX_(\d+)/.exec(replacement.replacedTo);
	if (tryexec && tryexec[1]) {
		// toJSON avaliable
		return new BoxGameObject(Number(tryexec[1]));
	}
	tryexec = /RESTRICTEDTIERBOX_(\d+)/.exec(replacement.replacedTo);
	if (tryexec && tryexec[1]) {
		// toJSON avaliable
		return new RestrictedBoxObject(Number(tryexec[1]));
	}
	if (replacement.replacedTo == 'BOX') {
		// toJSON avaliable
		return new MoveableBoxGameObject();
	}
	if (replacement.replacedTo == 'ACTIVE_SWITCH') {
		// toJSON avaliable
		return new SwitchOnGameObject();
	}
	return bl;
}

export function clearReplaces(room: number) {
	const arrayreplaces = player.minigame.replaces[room];
	const met: [bigint, bigint][] = [];
	for (let i = arrayreplaces.length - 1; i >= 0; i--) {
		const cure = arrayreplaces[i];
		if (!cure) continue;
		if (met.findIndex((a) => a[0] == cure.x && a[1] == cure.y) != -1) {
			player.minigame.replaces[room].splice(i, 1);
			continue;
		} else {
			met.push([cure.x, cure.y]);
		}
		const b = blockToJSON(getCurrentBlock(room, cure.x, cure.y, true));
		if (b !== 'UNSUPPORTED') {
			if (b == cure.replacedTo) {
				player.minigame.replaces[room].splice(i, 1);
				continue;
			}
		}
	}
}

export function deleteRecovers() {
	for (let i in player.minigame.replaces) {
		for (let j in player.minigame.replaces[i]) {
			if (player.minigame.replaces[i][j].recover) delete player.minigame.replaces[i][j];
		}
	}
}

export function addReplace(
	room: number,
	x: bigint,
	y: bigint,
	replacedTo: string,
	notPermanent: boolean = false,
) {
	if (!player.minigame.replaces[room]) {
		player.minigame.replaces[room] = [];
	}
	player.minigame.replaces[room].push({
		x,
		y,
		replacedTo,
		recover: notPermanent,
	});
	clearReplaces(room);
	console.log(x, y, replacedTo);
}
