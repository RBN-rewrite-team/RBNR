import { reactive } from 'vue';

export const temp = reactive({
	select_ach: [0, 0],
	plotdisplay: 0,
	plotstep: 0,
	plotcd: Date.now(),
	nonrecpagevisit: [false, true, false],
});
