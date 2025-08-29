import {
	BoxGameObject,
	DoorGameObject,
	FakeWallGameObject,
	GuardGameObject,
	HealthRecoveryGameObject,
	KeyGameObject,
	OreGameObject,
	RestrictedBoxObject,
	TeleporterGameObject,
	WallGameObject,
} from '../game-object';
import type { SingleMap } from '../map';
import { convertStringToMap } from '../map-functions';
export const between = (x: number, y: number, z: number) => x <= y && y <= z;
export function map2_block(x: number, y: number) {
	if (x < 0) return null;
	if (y < 0) return null;
	if (
		x == 0 ||
		y == 0 ||
		(y == 2 && between(2, x, 25)) ||
		(between(1, x, 5) && y == 7) ||
		(x == 9 && between(3, y, 13)) ||
		(y == 7 && between(13, x, 18)) ||
		(y == 13 && between(1, x, 2)) ||
		(y == 13 && between(7, x, 18)) ||
		(x == 18 && between(3, y, 6)) ||
		(x == 25 && between(1, y, 5)) ||
		(x == 25 && between(10, y, 16)) ||
		(x == 30 && between(1, y, 11)) ||
		(y == 4 && between(34, x, 41)) ||
		(x == 38 && y == 1) ||
		(x == 38 && y == 2) ||
		x == 42 ||
		(y == 15 && between(33, x, 41)) ||
		(x == 36 && between(12, y, 14)) ||
		(x == 38 && between(13, y, 14)) ||
		(y == 22 && between(10, x, 25)) ||
		(x == 14 && y == 23) ||
		(x == 25 && between(22, y, 33)) ||
		(y == 26 && between(17, x, 25)) ||
		(x == 17 && y == 27) ||
		(x == 17 && y == 28) ||
		(x == 17 && y == 29) ||
		(y == 33 && between(3, x, 22)) ||
		(x == 3 && between(24, y, 32)) ||
		(between(7, x, 9) && between(27, y, 31)) ||
		(x == 5 && between(27, y, 31)) ||
		(x == 4 && between(29, y, 31)) ||
		(x == 9 && y == 32) ||
		(y == 19 && between(29, x, 42))
	)
		return new WallGameObject();

	if (y == 1 && between(2, x, 23)) return new FakeWallGameObject();

	if (x == 4 && y == 4) return new GuardGameObject(2);
	if (x == 1 && y == 8) return new BoxGameObject(1);
	if (x == 2 && y == 8) return new GuardGameObject(3);
	if (x == 1 && y == 9) return new GuardGameObject(3);
	if (x == 4 && y == 10) return new GuardGameObject(3);
	if (x == 6 && y == 16) return new GuardGameObject(3);
	if (x == 5 && y == 18) return new GuardGameObject(3);
	if (x == 8 && y == 17) return new GuardGameObject(5);
	if (x == 7 && y == 19) return new GuardGameObject(4);
	if (x == 6 && y == 17) return new RestrictedBoxObject(1);
	if (x == 7 && y == 18) return new RestrictedBoxObject(1);
	if (y == 13 && between(3, x, 6)) return new GuardGameObject(3);
	if (x == 1 && y == 14) return new OreGameObject();

	if (x == 14 && y == 15) return new RestrictedBoxObject(2);
	if (x == 14 && y == 16) return new GuardGameObject(5);
	if (x == 13 && y == 15) return new GuardGameObject(5);

	if ((x == 19 && y == 13) || (x == 26 && y == 1)) return new HealthRecoveryGameObject(25);

	if ((x == 24 && y == 11) || (x == 15 && y == 23)) return new BoxGameObject(1);
	if (x == 24 && y == 10) return new GuardGameObject(3);
	if (x == 24 && y == 12) return new GuardGameObject(3);
	if (x == 23 && y == 11) return new GuardGameObject(3);
	if (x == 20 && y == 11) return new GuardGameObject(3);
	if (x == 12 && y == 11) return new GuardGameObject(3);
	if (x == 21 && y == 7) return new GuardGameObject(3);
	if (x == 15 && between(3, y, 6)) return new GuardGameObject(1);
	if (x == 16 && between(3, y, 6)) return new GuardGameObject(3);
	if (x == 17 && between(3, y, 4)) return new BoxGameObject(3);
	if (x == 17 && between(5, y, 6)) return new OreGameObject();

	if (x == 22 && y == 3) return new GuardGameObject(4);
	if (x == 22 && y == 4) return new GuardGameObject(4);
	if (x == 22 && y == 5) return new GuardGameObject(4);
	if (x == 23 && y == 5) return new GuardGameObject(4);
	if (x == 24 && y == 5) return new GuardGameObject(4);
	if (x == 23 && y == 3) return new BoxGameObject(1);
	if (x == 23 && y == 4) return new BoxGameObject(1);
	if (x == 24 && y == 3) return new BoxGameObject(1);
	if (x == 24 && y == 4) return new BoxGameObject(1);
	if (x == 27 && y == 15) return new GuardGameObject(4);
	if (x == 27 && y == 16) return new GuardGameObject(5);
	if (x == 26 && y == 16) return new GuardGameObject(3);
	if ((x == 28 && y == 15) || (x == 18 && y == 29)) return new RestrictedBoxObject(1);
	if (x == 41 && y == 1) return new BoxGameObject(1);
	if ((x == 37 && y == 14) || (x == 24 && y == 23)) return new OreGameObject();
	if (x == 37 && y == 13) return new GuardGameObject(3);
	if (x == 41 && y == 14) return new KeyGameObject(3.002);
	if (x == 39 && y == 5) return new GuardGameObject(3);
	if (x == 40 && y == 6) return new GuardGameObject(3);
	if (x == 41 && y == 7) return new GuardGameObject(3);
	if (x == 40 && y == 5) return new GuardGameObject(4);
	if (x == 41 && y == 6) return new GuardGameObject(5);
	if (x == 41 && y == 5) return new BoxGameObject(2);

	if (x == 19 && between(27, y, 32)) return new GuardGameObject(3);
	if (x == 17 && between(30, y, 32)) return new GuardGameObject(3);

	if (x == 6 && y == 27) return new DoorGameObject(2.002);
	if (x == 6 && y == 28) return new DoorGameObject(3.002);
	if (x == 6 && y == 29) return new DoorGameObject(4.002);
	if (x == 6 && y == 30) return new DoorGameObject(5.002);
	if (x == 6 && y == 31) return new DoorGameObject(6.002);
	if (x == 4 && y == 27) return new FakeWallGameObject();
	if (x == 4 && y == 28) return new BoxGameObject(1);
	if (x == 4 && y == 32) return new BoxGameObject(3);
	if (x == 6 && y == 32) return new OreGameObject();
	if (x == 7 && y == 32) return new OreGameObject();
	if (x == 8 && y == 32) return new OreGameObject();
	if (x == 5 && y == 32) return new OreGameObject();
	if (x == 1 && y == 33) return new WallGameObject();
	if (x == 1 && y == 32) return new OreGameObject();

	if (x == 29 && between(20, y, 22)) return new GuardGameObject(3);
	if (x == 30 && between(20, y, 22)) return new GuardGameObject(3);
	if (x == 31 && between(20, y, 22)) return new GuardGameObject(4);
	if (x == 32 && between(20, y, 22)) return new GuardGameObject(4);
	if (x == 33 && between(20, y, 22)) return new GuardGameObject(5);
	if (x == 34 && between(20, y, 22)) return new GuardGameObject(5);
	if (x == 35 && between(20, y, 22)) return new RestrictedBoxObject(1);
	if (x == 37 && y == 20) return new HealthRecoveryGameObject(25);
	if (x == 37 && y == 22) return new HealthRecoveryGameObject(25);
	if (x == 37 && y == 21) return new OreGameObject();

	if (x == 38 && y == 20) return new WallGameObject();
	if (x == 38 && y == 21) return new WallGameObject();
	if (x == 38 && y == 22) return new WallGameObject();
	if (between(29, x, 38) && y == 23) return new WallGameObject();
	if (x == 37 && y == 24) return new OreGameObject();

	if (x == 41 && y == 18) return new KeyGameObject(1);
	return null;
}
