import type { Directive, DirectiveBinding } from 'vue';

export interface HoldHandlers {
	onStart?: (event: Event) => void;
	onHold?: (event: Event) => void;
	onProgress?: (event: Event) => void;
	onRelease?: (event: Event) => void;
}

export interface HoldDirectiveValue {
	handler: HoldHandlers;
	delay?: number;
	interval?: number;
}

interface HoldElement extends HTMLElement {
	_holdData?: {
		start: (event: Event) => void;
		stop: (event: Event) => void;
		pressTimer: ReturnType<typeof setTimeout> | null;
		progressTimer: ReturnType<typeof setInterval> | null;
	};
}

export const vHold: Directive<HoldElement, HoldDirectiveValue> = {
	mounted(el: HoldElement, binding: DirectiveBinding<HoldDirectiveValue>) {
		let { handler, delay = 500, interval = 40 } = binding.value;
		if (handler === undefined) {
			handler = {};
		}
		delay *= 1;
		interval *= 1;
		const holdData = {
			pressTimer: null as ReturnType<typeof setTimeout> | null,
			progressTimer: null as ReturnType<typeof setInterval> | null,
			start: (e: Event) => {
				if (handler.onStart) handler.onStart(e);

				if (holdData.pressTimer) clearTimeout(holdData.pressTimer);
				if (holdData.progressTimer) clearInterval(holdData.progressTimer);

				holdData.pressTimer = setTimeout(() => {
					handler.onHold?.(e);

					if (handler.onProgress) {
						holdData.progressTimer = setInterval(() => {
							handler.onProgress!(e);
						}, interval);
					}
				}, delay);
			},
			stop: (e: Event) => {
				if (holdData.pressTimer) {
					clearTimeout(holdData.pressTimer);
					holdData.pressTimer = null;
				}

				if (holdData.progressTimer) {
					clearInterval(holdData.progressTimer);
					holdData.progressTimer = null;
				}

				if (handler.onRelease) handler.onRelease(e);
			},
		};

		el._holdData = holdData;

		el.addEventListener('mousedown', holdData.start);
		el.addEventListener('touchstart', holdData.start, { passive: false });
		el.addEventListener('mouseup', holdData.stop);
		el.addEventListener('mouseleave', holdData.stop);
		el.addEventListener('touchend', holdData.stop);
		el.addEventListener('touchcancel', holdData.stop);
	},

	unmounted(el: HoldElement) {
		if (!el._holdData) return;

		if (el._holdData.pressTimer) clearTimeout(el._holdData.pressTimer);
		if (el._holdData.progressTimer) clearInterval(el._holdData.progressTimer);

		el.removeEventListener('mousedown', el._holdData.start);
		el.removeEventListener('touchstart', el._holdData.start);
		el.removeEventListener('mouseup', el._holdData.stop);
		el.removeEventListener('mouseleave', el._holdData.stop);
		el.removeEventListener('touchend', el._holdData.stop);
		el.removeEventListener('touchcancel', el._holdData.stop);

		delete el._holdData;
	},
};
