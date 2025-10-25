import { Callable, Dictionary } from '../a-objects';
import type { Environment } from '../environment';

const actx = new window.AudioContext();
export function playFrequency(frequency = 440, gain = 0.1, time = 0.1) {
	const oscillator = actx.createOscillator();
	const gainNode = actx.createGain();
	oscillator.connect(gainNode);
	gainNode.connect(actx.destination);
	oscillator.type = 'sine';

	gainNode.gain.value = gain;
	oscillator.frequency.value = frequency;
	oscillator.detune.value = 0;
	var oscillator_object = {
		stop: function () {
			oscillator.stop(actx.currentTime);
			this.played = true;
		},
		oscillator,
		played: false,
	};
	setTimeout(function () {
		oscillator_object.played = true;
	}, time * 1000);
	try {
		oscillator.start();
	} catch (e) {
		oscillator_object.played = true;
	}
	oscillator.stop(actx.currentTime + time);
	return oscillator_object;
}
class PlayFreq extends Callable {
	async call(env: Environment, ...args: any[]) {
		playFrequency(args[0], args[2]?.toNumber?.() ?? 0.1, args[1].toNumber?.() ?? 1);
	}
}
export function importMusic(parentEnvironment: Environment) {
	const readonlyDictionaryMusic = new Dictionary();
	readonlyDictionaryMusic.set('freq', new PlayFreq());
	readonlyDictionaryMusic.readonly = true;
	parentEnvironment.isReadonly = false;
	parentEnvironment.set('music', readonlyDictionaryMusic);
	parentEnvironment.isReadonly = true;
}
