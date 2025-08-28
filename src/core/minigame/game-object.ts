// export enum GameObjectsEnum {
// 	SPAWN_POINT,
// 	WALL,
// 	DOOR,
// 	KEY,
// 	GUARD,
// 	WALL_INVISIBLE,
// 	BOX,
// 	ORE,
// 	TELEPORT,
// 	FAKE_WALL,
// 	DOOR_CHANCE,
// }

/**
 * 游戏物体 Nothingness（这里什么都没有）
 */
export class GameObject {
	constructor() {}
	interact() {}
	solid = false;
}

export class SpawnPointGameObject extends GameObject {
	constructor() {
		super();
	}
}
export class WallGameObject extends GameObject {
	constructor() {
		super();
	}
	solid = true;
}

export class WallInvisibleGameObject extends GameObject {
	constructor() {
		super();
	}
	solid = true;
}

export class BoxGameObject extends GameObject {
	constructor() {
		super();
	}
}
