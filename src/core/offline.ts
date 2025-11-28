import Async from '@/utils/asyncs';
import { FPS, simulate, startGameLoop, stopGameLoop } from './game-loop';
import { save } from '@/core/save/';
import Modal from '@/utils/Modal';
import { formatTime } from '@/utils/format';
import { getMessage } from '@/utils/i18n';

const offline = {
	active: false,
	nosave: false,
	speed: 10,

	/**
	 * 经过的时间
	 */
	elapsed: 0,
};
export function simulateOffline(milliseconds: number): void {
	if (milliseconds < 0) throw new Error('?');
	if (offline.active) return;

	offline.nosave = offline.active = true;

	const time = milliseconds / 1000;
	offline.speed = Math.max(12, time / 5);
	offline.elapsed = 0;

	// el("app").style.display = "none"
	// el("offline").style.display = ""
	// resetCanvasGraph("offline")

	const d = new Date();

	// el("offline-time").innerHTML = (d.getDate() == 1 && d.getMonth() == 3 ? `For today and today only, you can type "what's e621" in my community (discord) to get a free role! ` : "")+lang_text('offline-time-text',time)

	// graphs.offline.max_graph_x = time
	// addGraphPlot("offline",0,player.fish,false)

	let date = Date.now();
	var tt = 0;

	// var update_graph = setInterval(updateCanvasGraph,1000/FPS,"offline")
	const modal = Modal.show({
		showProgress: true,
		title: getMessage('offline.title'),
		content: getMessage('offline.tick', {
			a: 0,
			b: milliseconds,
		}),
		closeOnClickMask: false,
		onClose() {},
	});
	var ol = setInterval(() => {
		// updateTemp()
		var diff = (Date.now() - date) / 1000;
		var dt = Math.min(time, offline.elapsed + diff * offline.speed) - offline.elapsed;
		modal.controller.updateContent(
			getMessage('offline.tick2', {
				a: formatTime(offline.elapsed),
				b: formatTime(milliseconds / 1000),
			}),
		);
		modal.controller.updateProgress((offline.elapsed / (milliseconds / 1000)) * 100);
		// modal.controller.updateContent(
		// 	`Running offline with${offline.elapsed / (milliseconds / 1000)}`,
		// );
		tt += diff;
		// console.log(diff,dt,tt)
		simulate(dt * 1000);
		offline.elapsed += dt;

		date = Date.now();
		// addGraphPlot("offline",offline.elapsed,player.fish,false)

		if (offline.elapsed >= time) {
			// updateCanvasGraph("offline")
			offline.nosave = false;
			offline.active = false;
			clearInterval(ol);
			startGameLoop();
			// clearInterval(update_graph)
			// el("offline-done").style.display = ""
			modal.controller.close();
		}
	}, 1000 / FPS);

	// let ticks = Math.floor(milliseconds / 40);
	// ticks = Math.min(ticks, 200);
	// let remaining = milliseconds;
	// const startTime = Date.now();
	// const loopFn = () => {
	// 	if (!exited) {
	// 		const diff = milliseconds / ticks;
	// 		simulate(diff);
	// 		remaining -= diff;
	// 	}
	// };
	// const progress = {};
	// let modal: ReturnType<typeof Modal.show>;
	// let exited = false;
	// Async.run(loopFn, ticks, {
	// 	batchSize: 1,
	// 	maxTime: 30,
	// 	sleepTime: 1,
	// 	asyncEntry: (doneSoFar: number) => {
	// 		stopGameLoop();
	// 		modal = Modal.show({
	// 			showProgress: true,
	// 			title: getMessage('offline.title'),
	// 			content: getMessage('offline.tick', {
	// 				a: 0,
	// 				b: ticks,
	// 			}),
	// 			closeOnClickMask: false,
	// 			onClose() {},
	// 		});
	// 	},
	// 	asyncProgress: (doneSoFar: number) => {
	// 		modal.controller.updateContent(
	// 			getMessage('offline.tick2', {
	// 				a: doneSoFar,
	// 				b: ticks,
	// 				c: formatTime(
	// 					((Date.now() - startTime) / 1000 / doneSoFar) * (ticks - doneSoFar),
	// 				),
	// 			}),
	// 		);
	// 		modal.controller.updateProgress((doneSoFar / ticks) * 100);
	// 	},
	// 	asyncExit: () => {
	// 		startGameLoop();
	// 		exited = true;
	// 		modal.controller.close();
	// 	},
	// 	then: save,
	// 	progress,
	// });
}
