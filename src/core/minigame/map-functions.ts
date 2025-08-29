import { GameObject, WallGameObject } from './game-object';

export function convertStringToMap(x: string, slots?: (null | GameObject)[]) {
	let map = [];
	let placeholdercount = 0;
	for (let i = 0; i < x.length; i++) {
		if (x[i] == 'W') {
			map.push(new WallGameObject());
		}
		if (x[i] == '0') {
			map.push(null);
		}
		if (x[i] == 'P') {
			map.push(slots?.[placeholdercount++] ?? null);
		}
	}
	return map;
}
