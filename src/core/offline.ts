import Async from '@/utils/asyncs';
import { simulate, startGameLoop, stopGameLoop } from './game-loop';
import { player, save } from '@/core/save/';
import Modal from '@/utils/Modal';
import { formatTime } from '@/utils/format';
export function simulateTime(milliseconds: number): void {
	if (milliseconds < 0) throw new Error('?');

	if (milliseconds >= 6e5) milliseconds = 6e5 + (milliseconds / 1000 - 600) ** 0.5 * 1000;
	if (milliseconds >= 3.6e6) milliseconds = 3.6e6;

	let ticks = Math.floor(milliseconds / 40);
	ticks = Math.min(ticks, 10000);
	let remaining = milliseconds;
	const startTime = Date.now();
	const loopFn = () => {
		const diff = milliseconds / ticks;
		simulate(diff);
		remaining -= diff;
	};
	const onClose = () => {
		player.timeshard.value += Math.floor(remaining / 150000);
		remaining = 0;
		startGameLoop();
	};
	const progress = {};
	let modal: ReturnType<typeof Modal.show>;
	Async.run(loopFn, ticks, {
		batchSize: 1,
		maxTime: 30,
		sleepTime: 1,
		asyncEntry: (doneSoFar: number) => {
			stopGameLoop();
			modal = Modal.show({
				showProgress: true,
				title: '离线进度计算中',
				content: `已完成0/${ticks}帧的计算<br>如果你不想计算，你可以按下面的“跳过”直接将离线时间转换成时间碎片。`,
				closeOnClickMask: false,
				onClose(...args) {
					return onClose(...args);
				},
				buttons: [
					{
						text: '跳过',
						handler() {
							onClose()
							return modal.controller.close();
						},
					},
				],
			});
		},
		asyncProgress: (doneSoFar: number) => {
			modal.controller.updateContent(
				`已完成${doneSoFar}/${ticks}帧的计算<br>剩余时间：${formatTime(((Date.now() - startTime) / 1000 / doneSoFar) * (ticks - doneSoFar))}`,
			);
			modal.controller.updateProgress((doneSoFar / ticks) * 100);
		},
		asyncExit: () => {
			startGameLoop();
			modal.controller.close();
		},
		then: save,
		progress,
	});
}
