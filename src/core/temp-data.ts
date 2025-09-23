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
	openingCore: false,
	//@ts-ignore
	coreViewEquipment: {},
	//@ts-ignore
	coreViewColor(eq = temp.coreViewEquipment): string {
		//@ts-ignore
		let r = eq.rarity ?? 0;
		if(r >= 1.9) return 'cyan';
		if(r >= 1.8) return 'red';
		if(r >= 1.6) return 'orange';
		if(r >= 1.4) return 'purple';
		if(r >= 1.0) return 'blue';
		return 'var(--color)';
	}
});
