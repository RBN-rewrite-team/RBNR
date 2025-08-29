import {
	BossGameObject,
	BoxGameObject,
	DoorGameObject,
	FakeWallGameObject,
	GuardGameObject,
	HealthRecoveryGameObject,
	KeyGameObject,
	KeyRequiredWallInvisibleGameObject,
	MoveableBoxGameObject,
	OreGameObject,
	RestrictedBoxObject,
	SwitchGameObject,
	TeleporterGameObject,
	WallGameObject,
	WallInvisibleGameObject,
} from '../game-object';
import type { SingleMap } from '../map';
import { convertStringToMap } from '../map-functions';
export const between = (x: number, y: number, z: number) => x <= y && y <= z;
export function map2_block(x: number, y: number) {
	if (x < 0) return undefined;
	if (y < 0) return undefined;
	if (y > 44) return undefined;
	if (x > 42) return undefined;
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
		(y == 19 && between(29, x, 42)) ||
		(between(31, x, 37) && between(27, y, 29)) ||
		(x == 31 && y == 30) ||
		(x == 31 && y == 31) ||
		(x == 31 && y == 32) ||
		(x == 31 && y == 33) ||
		(x == 32 && y == 30) ||
		(x == 33 && y == 30) ||
		(x == 34 && y == 30) ||
		(x == 35 && y == 30) ||
		(x == 36 && y == 30) ||
		(y == 33 && between(24, x, 30)) ||
		y == 44 ||
		(x == 4 && between(34, y, 39)) ||
		(x == 3 && y == 39) ||
		(x == 1 && y == 38)
	)
		return new WallGameObject();

	if (between(32, x, 37) && between(31, y, 33)) {
		return new FakeWallGameObject();
	}
	if (x == 37 && y == 30) return new KeyGameObject(6.002);
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

	if (x == 41 && y == 18) return new KeyGameObject(1.002);

	if (x == 38 && y >= 24) return new WallGameObject();

	if (x == 30 && y == 32) return new OreGameObject();
	if (x == 30 && y == 27) return new RestrictedBoxObject(1);
	if (x == 29 && y == 27) return new GuardGameObject(5);
	if (x == 30 && y == 28) return new GuardGameObject(3);
	if (x == 23 && y == 33) return new DoorGameObject(1.002);
	if (x == 2 && y == 38) return new DoorGameObject(7.002);
	if (x == 2 && y == 39) return new GuardGameObject(5);
	if (x == 1 && y == 39) return new RestrictedBoxObject(1);
	if (x == 1 && y == 40) return new RestrictedBoxObject(1);
	if (x == 4 && y == 40) return new GuardGameObject(4);
	if (x == 5 && y == 39) return new KeyGameObject(8.002);

	if (between(5, x, 11) && y == 37) return new KeyRequiredWallInvisibleGameObject(8.002);
	if ((x == 12 && y >= 37) || (between(9, x, 11) && between(40, y, 43)) || (x == 15 && y >= 37))
		return new WallGameObject();

	if ((x == 13 || x == 14) && between(40, y, 42)) {
		return new FakeWallGameObject();
	}
	if (x == 13 && y == 37) return new GuardGameObject(3);
	if (x == 14 && y == 37) return new GuardGameObject(3);
	if (x == 13 && y == 38) return new GuardGameObject(4);
	if (x == 14 && y == 38) return new GuardGameObject(5);
	if (x == 13 && y == 39) return new RestrictedBoxObject(1);
	if (x == 14 && y == 39) return new RestrictedBoxObject(1);

	if (x == 13 && y == 43) return new KeyGameObject(9.002);
	if (x == 14 && y == 43) return new OreGameObject();
	if (x == 26 && y == 32) return new KeyGameObject(4.002);
	if (x == 31 && y == 1) return new KeyGameObject(2.002);
	if (x == 3 && y == 23) return new KeyGameObject(7.002);

	if (x == 17 && y == 36) return new BoxGameObject(1);
	if (x == 18 && y >= 34) return new WallGameObject();
	if (x == 16 && y == 37) return new KeyRequiredWallInvisibleGameObject(9.002);
	if (x == 17 && y == 37) return new KeyRequiredWallInvisibleGameObject(9.002);
	if (x == 17 && y == 41) return new BoxGameObject(1);
	if (x == 17 && y == 42) return new BoxGameObject(1);
	if (x == 17 && y == 43) return new BoxGameObject(1);
	if (x == 16 && y == 43) return new KeyGameObject(5.002);
	if (x == 16 && y == 42) return new KeyGameObject(10.002);
	if (x == 23 && y == 34) return new GuardGameObject(3);
	if (x == 23 && y == 35) return new GuardGameObject(4);
	if (x == 23 && y == 36) return new GuardGameObject(5);
	if (x == 23 && y == 37) return new GuardGameObject(4);
	if (x == 24 && y == 37) return new GuardGameObject(4);
	if (x == 22 && y == 37) return new GuardGameObject(4);
	if (x == 22 && y == 36) return new GuardGameObject(3);
	if (x == 24 && y == 36) return new GuardGameObject(3);
	if (x == 22 && y == 34) return new WallGameObject();
	if (x == 24 && y == 34) return new WallGameObject();
	if (x == 21 && y == 34) return new OreGameObject();
	if (x == 25 && y == 34) return new OreGameObject();
	if (x == 21 && y == 35) return new WallGameObject();
	if (x == 25 && y == 35) return new WallGameObject();
	if (x == 21 && y == 36) return new WallGameObject();
	if (x == 25 && y == 36) return new WallGameObject();
	if (x == 21 && y == 37) return new WallGameObject();
	if (x == 25 && y == 37) return new WallGameObject();

	if (x == 23 && y == 38) return new HealthRecoveryGameObject(25);
	if (x == 23 && y == 39) return new BoxGameObject(1);
	if (x == 22 && y == 39) return new WallGameObject();
	if (x == 24 && y == 39) return new WallGameObject();
	if (x == 22 && y == 40) return new WallGameObject();
	if (x == 24 && y == 40) return new WallGameObject();
	if (x == 19 && y == 34) return new KeyGameObject(11.002);
	if (between(19, x, 21) && y >= 40) return new WallGameObject();

	if (x == 28 && y == 38) return new KeyRequiredWallInvisibleGameObject(10.002);

	if (x == 36 && y == 40) return new DoorGameObject(13.002);
	if ((x == 28 && (between(34, y, 37) || y == 39)) || (y == 40 && x >= 25))
		return new WallGameObject();

	if (x == 30 && y == 39) return new BoxGameObject(1);
	if (x == 30 && y == 38) return new OreGameObject();
	if (x == 30 && y == 37) return new BoxGameObject(1);
	if (x == 31 && y == 38) return new DoorGameObject(11.002);
	if (x == 31 && y == 37) return new WallInvisibleGameObject();
	if (x == 31 && y == 36) return new WallInvisibleGameObject();
	if (x == 31 && y == 35) return new WallInvisibleGameObject();
	if (x == 31 && y == 34) return new WallInvisibleGameObject();
	if (x == 31 && y == 39) return new WallInvisibleGameObject();
	if (x == 27 && y == 42) return new BoxGameObject(2);
	if (x == 32 && y == 37) return new KeyGameObject(12.002);
	if (x == 25 && y >= 40) return new WallGameObject();
	if (x == 23 && y == 42) return new BoxGameObject(3);
	if (x == 32 && y == 35) return new MoveableBoxGameObject();
	if (x == 35 && y == 39) return new SwitchGameObject();
	if (x == 23 && y == 40)
		return new (class extends BossGameObject {
			constructor() {
				super();
				this.type = 6;
				this.tier = 6;
			}
			innerText: string = '使徒';
		})();
	return null;
}
