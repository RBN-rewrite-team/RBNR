import { HighPlaceClimbGameObject, HighPlaceGameObject } from '../game-object';
import { WallGameObject } from '../game-object';
import { between } from './map-dungeon2';

export function map3_block(x: number, y: number) {
	if (y == 0 || y == 198) return new WallGameObject();
	if (x == 0 || x == 75) return new WallGameObject();
	if (between(1, x, 6) && y == 5) return new WallGameObject();

	if (x == 11 && y == 3) return new HighPlaceClimbGameObject();
	if (between(11, x, 18) && between(1, y, 8)) {
		return new HighPlaceGameObject();
	}
	if (between(8, x, 10) && y == 5) return new WallGameObject();
	return null;
}
