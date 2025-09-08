import { reactive } from 'vue';

export const temp = reactive({
	select_ach: [0, 0],
	plotdisplay: 0,
	plotstep: 0,
	plotcd: Date.now(),
	minigametip: '',
	dungeonsSP: 0,
	get innerWidth(): number {
		return window.innerWidth;
	},
});
