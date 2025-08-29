import {
	BoxGameObject,
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
		(x == 19 && between(3, y, 6))
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
	if (x == 7 && y == 18) return new GuardGameObject(4);
	if (x == 6 && y == 17) return new RestrictedBoxObject(1);
	if (x == 7 && y == 18) return new RestrictedBoxObject(1);
	if (y == 13 && between(3, x, 6)) return new GuardGameObject(3);
	if (x == 1 && y == 14) return new OreGameObject();
	return null;
}
