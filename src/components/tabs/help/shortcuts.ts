import { player } from '@/core/save';

export const SHORTCUTS = {
	shortcut_ordinal: {
		show() {
			return true;
		},
		text: '序数',
		page: 1,
	},
	shortcut_ocf: {
		show() {
			return true;
		},
		text: '序数坍缩函数',
		page: 101,
	},
} as const;
function keyofshortcut(key: string): key is keyof typeof SHORTCUTS {
	return Object.keys(SHORTCUTS).includes(key);
}
export function gotoShortCut(id: string) {
	if (keyofshortcut(id)) player.help.page = SHORTCUTS[id].page;
}
