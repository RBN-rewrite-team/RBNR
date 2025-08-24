import { player } from '../save';

export function getTotalTheories() {
	return player.nonrecu.theories.reduce((a, b) => a.add(b));
}
