import {
	BoxGameObject,
	FakeWallGameObject,
	GuardGameObject,
	HealthRecoveryGameObject,
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
					new HealthRecoveryGameObject(10),
					new BoxGameObject(1),
					new BoxGameObject(1),
				]),
				convertStringToMap('W0WW0WWW0W0W0WWW0W0W0W0P0W', [new BoxGameObject(2)]),
				convertStringToMap('W0W000000W0W000W00P00W0P0W', [
					new TeleporterGameObject([13, 4], 0),
					new OreGameObject(),
				]),
				convertStringToMap('W0WWWWWW0W0W0P0W0WPW0W000W', [
					new TeleporterGameObject([18, 3], 0),
					new BoxGameObject(1),
				]),

				convertStringToMap('W00PWW000WPW000WWWPWWWWPWW', [
					new BoxGameObject(1),
					new OreGameObject(),
					new GuardGameObject(1),
					null, // replacement for door
				]),
				convertStringToMap('WWWWWWPWWWWWW0WW00000W0P0W', [
					new GuardGameObject(1),
					new OreGameObject(),
				]),
				convertStringToMap('W00000000000000WPW0W0P000W', [
					new GuardGameObject(1),
					new FakeWallGameObject(),
				]),
				convertStringToMap('W0WWWWWWWWWWWWWW0W0W0WWWWW'),
				convertStringToMap('W0W000W000P00PPWPW0W00P00P', [
					new FakeWallGameObject(),
					new BoxGameObject(1),
					new OreGameObject(),
					new GuardGameObject(1),
					null, //replacementfordoors
					new BoxGameObject(1),
				]),

				convertStringToMap('W0W0P0W0W0WWPWWWPW0W0WWWWW', [
					new TeleporterGameObject([1, 14], 0),
					new FakeWallGameObject(),
					new HealthRecoveryGameObject(20),
				]),
				convertStringToMap('W0W00000W0WW0WWWPW0W00000W', [new GuardGameObject(1)]),
				convertStringToMap('W0WWWWWWW0WW0WWW0W0WWWW00W'),
				convertStringToMap('W0WP0000P0WW0WWWPW000000PW', [
					null,
					new FakeWallGameObject(),
					new GuardGameObject(1),
					new FakeWallGameObject(),
				]),
				convertStringToMap('WPWWWWWWW0WWPWWWPWWWWWWW0W', [
					new TeleporterGameObject([4, 10], 0),
					new GuardGameObject(2),
					new HealthRecoveryGameObject(20),
					null, //replacement for big 2
				]),

				convertStringToMap('WWWWWWWWW0WWWWWWPPPPPPWP0W', [
					new GuardGameObject(1),
					new GuardGameObject(1),
					new BoxGameObject(2),
					new HealthRecoveryGameObject(100),
					null, // replacement for 2
					new OreGameObject(),
				]),
				convertStringToMap('WWWWWWWWWWWWWWWWWWWWWWWWWW'),
			],
			spawnpoint: [1, 1],
		},
	];
}
// prettier-ignore
export const maps: SingleMap[] = initialMap()
