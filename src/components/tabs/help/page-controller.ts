import { player } from '@/core/save';

export function nextPage() {
	if (player.help.page >= 4321) return; //没做
	let adder = 1;
	if (player.help.page >= 2125) player.help.milestone = Math.max(player.help.milestone, 1);
	if (player.help.page >= 3200) player.help.milestone = Math.max(player.help.milestone, 2);
	if (player.help.milestone == 1) adder = 2;
	if (player.help.milestone == 2) adder = 3;
	if (player.help.page >= 1000)
		player.help.page +=
			Math.random() > 0.99 ** ((player.help.page - 1000) ** 0.612881628721905905) ? -1 : adder;
	else player.help.page++;
}
export function lastPage() {
	player.help.page = Math.min(Math.max(player.help.page - 1, 1), 1000);
}
