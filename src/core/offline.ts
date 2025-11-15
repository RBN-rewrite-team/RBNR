import Async from '@/utils/asyncs';
import { simulate, startGameLoop, stopGameLoop } from './game-loop';
import { save } from '@/core/save/';
import Modal from '@/utils/Modal';
import { formatTime } from '@/utils/format';
import { getMessage } from '@/utils/i18n';
export function simulateTime(milliseconds: number): void {
	if (milliseconds < 0) throw new Error('?');

	let ticks = Math.floor(milliseconds / 40);
	ticks = Math.min(ticks, 200);
	let remaining = milliseconds;
	const startTime = Date.now();
	const loopFn = () => {
		if (!exited) {
			const diff = milliseconds / ticks;
			simulate(diff);
			remaining -= diff;
		}
	};
	const progress = {};
	let modal: ReturnType<typeof Modal.show>;
	let exited = false;
	Async.run(loopFn, ticks, {
		batchSize: 1,
		maxTime: 30,
		sleepTime: 1,
		asyncEntry: (doneSoFar: number) => {
			stopGameLoop();
			modal = Modal.show({
				showProgress: true,
				title: getMessage('offline.title'),
				content: getMessage('offline.tick', {
					a: 0,
					b: ticks,
				}),
				closeOnClickMask: false,
				onClose() {},
			});
		},
		asyncProgress: (doneSoFar: number) => {
			modal.controller.updateContent(
				getMessage('offline.tick2', {
					a: doneSoFar,
					b: ticks,
					c: formatTime(
						((Date.now() - startTime) / 1000 / doneSoFar) * (ticks - doneSoFar),
					),
				}),
			);
			modal.controller.updateProgress((doneSoFar / ticks) * 100);
		},
		asyncExit: () => {
			startGameLoop();
			exited = true;
			modal.controller.close();
		},
		then: save,
		progress,
	});
}
