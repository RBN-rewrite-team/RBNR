import {
	BoxGameObject,
	FakeWallGameObject,
	GuardGameObject,
	OreGameObject,
	TeleporterGameObject,
	WallGameObject,
	type GameObject,
} from './game-object';
const WGO = () => new WallGameObject();
const PLACEHOLDER = null;
export type SingleMap = {
	map: (GameObject | null)[][];
	spawnpoint: [number, number];
};
function convertStringToMap(x: string, slots?: (null | GameObject)[]) {
	let map = [];
	let placeholdercount = 0;
	for (let i = 0; i < x.length; i++) {
		if (x[i] == 'W') {
			map.push(WGO());
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
export function initialMap(): SingleMap[] {
	return [
		{
			map: [
				convertStringToMap('WWWWWWWWWWWWWWWWWWWWWWWWWW'),
				convertStringToMap('W0000W000W0000PW0PWP0W000W', [
					null,
					new BoxGameObject(1),
					new BoxGameObject(1),
				]),
				convertStringToMap('W0WW0WWW0W0W0WWW0W0W0W0P0W'),
				convertStringToMap('W0W000000W0W000W00P00W0P0W', [
					new TeleporterGameObject([13, 4], 0),
				]),
				convertStringToMap('W0WWWWWW0W0W0P0W0WPW0W000W', [
					new TeleporterGameObject([18, 3], 0),
					new BoxGameObject(1),
				]),

				convertStringToMap('W00PWW000WPW000WWWPWWWWPWW', [
					new BoxGameObject(1),
					new OreGameObject(),
				]),
				convertStringToMap('WWWWWWPWWWWWW0WW00000W0P0W', [new GuardGameObject(1)]),
				convertStringToMap('W00000000000000WPW0W0P000W'),
				convertStringToMap('W0WWWWWWWWWWWWWW0W0W0WWWWW'),
				convertStringToMap('W0W000W000P00PPWPW0W00P00P', [
					new FakeWallGameObject(),
					new BoxGameObject(1),
					new OreGameObject(),
				]),

				convertStringToMap('W0W0P0W0W0WWPWWWPW0W0WWWWW', [
					new TeleporterGameObject([1, 14], 0),
					new FakeWallGameObject(),
				]),
				convertStringToMap('W0W00000W0WW0WWWPW0W00000W'),
				convertStringToMap('W0WWWWWWW0WW0WWW0W0WWWW00W'),
				convertStringToMap('W0WP0000P0WW0WWWPW0000000W', [null, new FakeWallGameObject()]),
				convertStringToMap('WPWWWWWWW0WWPWWWPWWWWWWW0P', [
					new TeleporterGameObject([4, 10], 0),
				]),

				convertStringToMap('WWWWWWWWW0WWWWWWPPPPPPWP0W'),
				convertStringToMap('WWWWWWWWWWWWWWWWWWWWWWWWWW'),
			],
			spawnpoint: [1, 1],
		},
	];
}
// prettier-ignore
export const maps: SingleMap[] = initialMap()
