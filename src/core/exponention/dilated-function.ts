import { player } from '../global';
import type { upgrades } from '../mechanic';

export function dilated(text: string, dilated: string, id: keyof typeof upgrades): () => string {
	return function () {
		return (
			text +
			(player.exponention.logarithm.upgrades_in_dilated.includes(id)
				? "<span style='color: rgb(127, 127, 255)'><br>" + dilated + '</span>'
				: '')
		);
	};
}
