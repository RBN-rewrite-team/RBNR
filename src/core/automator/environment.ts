export class Environment {
	parent: Environment | null = null;
	map: Map<string, any> = new Map();
	constructor(parent?: Environment) {
		if (parent) this.parent = parent;
	}
	get(key: string): any {
		return this.map.get(key) ?? this.parent?.get?.(key);
	}
	set(key: string, value: any) {
		return this.map.set(key, value);
	}
	has(key: string): boolean {
		return this.map.has(key) ? (this.parent?.has?.(key) ?? false) : false;
	}
}
