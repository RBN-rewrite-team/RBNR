class RespawnBeacons {
	x: number = 0;
	y: number = 0;
	unlocked(): boolean {
		return true;
	};
	showed(): boolean {
		return true;
	};
};

export const RESPAWN_BEACONS = [
	new class extends RespawnBeacons {
		x: number = 0;
		y: number = 1;
	}
] as const satisfies RespawnBeacons[];
export const AWAKEN_BEACONS = [[-3, 3]] as const satisfies [number, number][];