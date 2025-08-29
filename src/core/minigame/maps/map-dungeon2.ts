import {
	BoxGameObject,
	FakeWallGameObject,
	GuardGameObject,
	HealthRecoveryGameObject,
	KeyGameObject,
	没做完TeleporterGameObject,
} from '../game-object';
import type { SingleMap } from '../map';
import { convertStringToMap } from '../map-functions';

export const MAP_DUNGEON2: SingleMap = {
	spawnpoint: [1, 1],
	map: [
		convertStringToMap('W'.repeat(43)),
		convertStringToMap(
			`W0PPPPPPPPPPPPPPPPPPPPPPPWP000WP000000W00PW`,
			new Array(22)
				.fill(0)
				.map(() => new FakeWallGameObject())
				.concat([
					new 没做完TeleporterGameObject([0, 0], 0),
					new HealthRecoveryGameObject(25),
					new KeyGameObject(2.002),
					new BoxGameObject(1),
				]),
		),
		convertStringToMap('W0WWWWWWWWWWWWWWWWWWWWWWWW0000W0000000W000W'),
		convertStringToMap('W00000000W00000PPPW000PPPW0000W00000000000W', [
			new GuardGameObject(1),
			new GuardGameObject(3),
			new BoxGameObject(1),
			new GuardGameObject(4),
			new BoxGameObject(1),
			new BoxGameObject(1),
		]),
	],
};
