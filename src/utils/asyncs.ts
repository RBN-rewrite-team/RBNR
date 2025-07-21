export type AsyncConfig = {
	maxTime: number;
	batchSize?: number;
	sleepTime?: number;
	asyncEntry?: (done: number) => void;
	asyncProgress?: (done: number) => void;
	asyncExit?: () => void;
	then?: () => void;
	progress?: {
		maxIter?: number;
		remaining?: number;
		[key: string]: unknown;
	};
};

export default {
	_enabled: true,

	get enabled(): boolean {
		return this._enabled;
	},

	set enabled(val: boolean) {
		this._enabled = val;
	},

	runForTime(fun: (remaining: number) => void, maxIter: number, config: AsyncConfig): number {
		const batchSize = config.batchSize || 1;
		const maxTime = config.maxTime;
		const t0 = Date.now();

		for (let remaining = maxIter; remaining > 0; ) {
			for (let j = 0; j < Math.min(remaining, batchSize); ++j) {
				fun(remaining);
				--remaining;
			}
			if (Date.now() - t0 >= maxTime) return remaining;
		}
		return 0;
	},

	sleepPromise(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	run(
		fun: (iteration: number) => void,
		maxIter: number,
		config: AsyncConfig,
	): Promise<void> | void {
		if (this.enabled) {
			this.enabled = false;
			const runResult = this._run(fun, maxIter, config);

			return config.then
				? runResult.then(() => {
						config.then?.();
						this.enabled = true;
					})
				: runResult.then(() => {
						this.enabled = true;
					});
		}

		for (let i = 0; i < maxIter; ++i) fun(i);
		config.then?.();
	},

	async _run(
		fun: (iteration: number) => void,
		maxIter: number,
		config: AsyncConfig,
	): Promise<void> {
		if (!config.progress) config.progress = {};

		config.progress.maxIter = maxIter;
		config.progress.remaining = this.runForTime(
			(remaining) => fun(maxIter - remaining),
			config.progress.maxIter,
			config,
		);

		if (!config.progress.remaining) return;

		const sleepTime = config.sleepTime || 1;
		if (config.asyncEntry) {
			config.asyncEntry(config.progress.maxIter - config.progress.remaining);
		}

		do {
			await this.sleepPromise(sleepTime);
			config.progress.remaining = this.runForTime(
				(remaining) => fun(maxIter - remaining),
				config.progress.remaining,
				config,
			);
			if (config.asyncProgress) {
				config.asyncProgress(config.progress.maxIter - config.progress.remaining);
			}
		} while (config.progress.remaining > 0);

		config.asyncExit?.();
	},
};
