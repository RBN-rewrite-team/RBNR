import {
	BossGameObject,
	BoxGameObject,
	DoorGameObject,
	FakeWallGameObject,
	GuardGameObject,
	HealthRecoveryGameObject,
	KeyGameObject,
	OreGameObject,
	TeleporterGameObject,
	WallGameObject,
	WallInvisibleGameObject,
	没做完TeleporterGameObject,
	type GameObject,
} from './game-object';
import { convertStringToMap } from './map-functions';
import { MAP_DUNGEON2 } from './maps/map-dungeon2';
export type SingleMap = {
	map: (GameObject | null)[][];
	spawnpoint: [number, number];
};

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
					new DoorGameObject(2), // replacement for door
				]),
				convertStringToMap('WWWWWWPWWWWWW0WW00000WPPPW', [
					new GuardGameObject(1),
					new GuardGameObject(1),
					new OreGameObject(),
					new GuardGameObject(1),
				]),
				convertStringToMap('W00000000000000WPW0W0PPPPW', [
					new GuardGameObject(1),
					new FakeWallGameObject(),

					new GuardGameObject(1),

					new GuardGameObject(1),

					new GuardGameObject(1),
				]),
				convertStringToMap('W0WWWWWWWWWWWWWW0W0W0WWWWW'),
				convertStringToMap('W0W000W000P00PPWPW0W0PP0PW', [
					new FakeWallGameObject(),
					new BoxGameObject(1),
					new OreGameObject(),
					new GuardGameObject(1),
					new GuardGameObject(1),
					new DoorGameObject(1), //replacementfordoors
					new BoxGameObject(1),
				]),

				convertStringToMap('W0W0P0W0W0WWPWWWPW0W0WWWWW', [
					new TeleporterGameObject([1, 14], 0),
					new FakeWallGameObject(),
					new HealthRecoveryGameObject(20),
				]),
				convertStringToMap('W0W00000W0WW0WWWPW0W00000W', [new GuardGameObject(1)]),
				convertStringToMap('W0WWWWWWW0WW0WWW0W0WWWWPPW', [
					new GuardGameObject(1),

					new GuardGameObject(1),
				]),
				convertStringToMap('W0WP0000P0WW0WWWPW00000PPW', [
					new TeleporterGameObject([1, 1], 2),
					new FakeWallGameObject(),
					new GuardGameObject(1),
					new GuardGameObject(1),
					new GuardGameObject(1),
				]),
				convertStringToMap('WPWWWWWWW0WWPWWWPWWWWWWWPW', [
					new TeleporterGameObject([4, 10], 0),
					new KeyGameObject(2),
					new HealthRecoveryGameObject(20),
					new BossGameObject(), //replacement for big 2
				]),

				convertStringToMap('WWWWWWWWWPWWWWWWPPPPPPWPPW', [
					new BoxGameObject(1),
					new GuardGameObject(1),
					new GuardGameObject(1),
					new BoxGameObject(2),
					new HealthRecoveryGameObject(100),
					new KeyGameObject(1),
					new OreGameObject(),
					new TeleporterGameObject([1, 1], 1), //replacement for 2
					new BoxGameObject(2),
				]),
				convertStringToMap('WWWWWWWWWWWWWWWWWWWWWWWWWW'),
			],
			spawnpoint: [1, 1],
		},
		MAP_DUNGEON2,
		{
			map: [
				convertStringToMap('WWWWWWWWWWWWWWWWWWWWWWWWWWW'),
				convertStringToMap('W0000000P0W0P0P0000PW000PPW', [
					new DoorGameObject(1.001),
					new FakeWallGameObject(),
					new FakeWallGameObject(),
					new KeyGameObject(2.001),
					new FakeWallGameObject(),
					new KeyGameObject(4.001),
				]),
				convertStringToMap('W0WWWWWWW0W0W0WWWWWWWWPWWWW', [new FakeWallGameObject()]),
				convertStringToMap('W0PWWWWWW0W0W0WPP000P00000W', [
					new FakeWallGameObject(),
					new OreGameObject(),
					new WallInvisibleGameObject(),
					new FakeWallGameObject(),
				]),
				convertStringToMap('WW00PWP0P000W0WPP0W0WWWWW0W', [
					new OreGameObject(),
					new BoxGameObject(1),
					new FakeWallGameObject(),
					new FakeWallGameObject(),
					new FakeWallGameObject(),
				]),

				convertStringToMap('WWWPWWWWWWWW00WPW0W0W000P0W', [
					new FakeWallGameObject(),
					new BoxGameObject(1),
					new FakeWallGameObject(),
				]),
				convertStringToMap('WP00P0000P0W0WWWW0W0W0WWW0W', [
					new KeyGameObject(1.001),
					new FakeWallGameObject(),
					new DoorGameObject(3.001),
				]),
				convertStringToMap('WWWWWWWWPW0W000000W0W0WP00W', [
					new WallInvisibleGameObject(),
					new OreGameObject(),
				]),
				convertStringToMap('WPPPPPPPPW0WWWWWWWWPW0WWWWW', [
					new TeleporterGameObject([8, 10], 2),
					new OreGameObject(),
					new DoorGameObject(6.001),
					new OreGameObject(),
					new OreGameObject(),
					new OreGameObject(),
					new OreGameObject(),
					new BoxGameObject(3),
					new FakeWallGameObject(),
				]),
				convertStringToMap('WWWWWWWWWW0WP00000P0W0000PW', [
					new KeyGameObject(3.001),
					new DoorGameObject(2.001),
					new TeleporterGameObject([11, 11], 2),
				]),

				convertStringToMap('W000PP0PPW0WWWWWWWWWWPWWWWW', [
					new FakeWallGameObject(),
					new WallInvisibleGameObject(),
					new FakeWallGameObject(),
					new TeleporterGameObject([1, 8], 2),
					new FakeWallGameObject(),
				]),
				convertStringToMap('WPW0WWWPWW0PW00000P000W0P0W', [
					new FakeWallGameObject(),
					new FakeWallGameObject(),
					new TeleporterGameObject([25, 9], 2),
					new FakeWallGameObject(),
					new FakeWallGameObject(),
				]),
				convertStringToMap('W0W0W0P0WWWWWWPWWWWWWWW0WPW', [
					new FakeWallGameObject(),
					new DoorGameObject(4.001),
					new DoorGameObject(5.001),
				]),
				convertStringToMap('W0WPW0WPW000W00P00WP00P0W0W', [
					new FakeWallGameObject(),
					new WallInvisibleGameObject(),
					new FakeWallGameObject(),
					new KeyGameObject(5.001),
					new WallInvisibleGameObject(),
				]),
				convertStringToMap('WPW0P0P0WWWWWWWW0WWWPWW0W0W', [
					new WallInvisibleGameObject(),
					new FakeWallGameObject(),
					new FakeWallGameObject(),
					new FakeWallGameObject(),
				]),

				convertStringToMap('WPP0WWW0P00PWP0000P00000WPW', [
					new KeyGameObject(6.001),
					new FakeWallGameObject(),
					new FakeWallGameObject(),
					new TeleporterGameObject([25, 15], 2),
					new OreGameObject(),
					new FakeWallGameObject(),
					new TeleporterGameObject([11, 15], 2),
				]),
				convertStringToMap('W'.repeat(27)),
			],
			spawnpoint: [1, 1],
		},
	];
}
// prettier-ignore
export const maps: SingleMap[] = initialMap()
