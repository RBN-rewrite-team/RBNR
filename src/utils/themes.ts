import {player} from '../core/save'

export enum themes {
	CLASSIC = 0,
	DARK = 1,
	SUN = 2,
	OCEAN = 3,/*
	ABYSSAL,
	REALITY,
	IMAGINARY,
	DIMENSION,
	WIND_SPIRIT,
	PARADOX*/
}

export const themeDetailsMap = new Map([
	[themes.CLASSIC, {
		name: '浅色',
		ordinary: {
			'--app-background-color': '#f3f3f3',
			'--background-color': '#fdfdfd',
			'--color': '#000000',
			'--suptitle-color': '#4f4f4f',
			'--title-color': '#8e8e8e',
			'--border-color': '#d0d0d0',
			'--hover-color': '#e2e2e2',
		} as const,
		other: {
		} as const,
	}],
	[themes.DARK, {
		name: '深色',
		ordinary: {
			'--app-background-color': '#0c0c0c',
			'--background-color': '#020202',
			'--color': '#ffffff',
			'--suptitle-color': '#b0b0b0',
			'--title-color': '#717171',
			'--border-color': '#2f2f2f',
			'--hover-color': '#1d1d1d',
		} as const,
		other: {
		} as const,
	}],
	[themes.SUN, {
		name: '太阳',
		ordinary: {
			'--app-background-color': '#ffcc00',
			'--background-color': '#ff9900',
			'--color': '#ffffff',
			'--suptitle-color': '#ffff00',
			'--title-color': '#ff6633',
			'--border-color': '#ffcc99',
			'--hover-color': '#ff6633',
		} as const,
		other: {
		} as const,
	}],
	[themes.OCEAN, {
		name: '海洋',
		ordinary: {
			'--app-background-color': '#00ccff',
			'--background-color': '#0066cc',
			'--color': '#ffffff',
			'--suptitle-color': '#00ffff',
			'--title-color': '#003333',
			'--border-color': '#006699',
			'--hover-color': '#0099cc',
		} as const,
		other: {
			filter: 'hue-rotate(15deg) brightness(0.8) contrast(0.9)',
		} as const
	}],
]);

const root = document.documentElement;

export function updateTheme(){
	let theme = themeDetailsMap.get(player.options.ui.theme);
	if(!theme) return;
	let ordinary = theme.ordinary;
	for(let i in ordinary)
	{
		root.style.setProperty(i as keyof typeof ordinary, ordinary[i as keyof typeof ordinary]);
	}
	let other = theme.other;
	if(other.filter)
	{
		root.style.filter = other.filter;
	}
	else root.style.filter = '';
	if(player.options.ui.otherwise['color_inversion']) root.style.filter += ' hue-rotate(180deg)';
	if(player.options.ui.otherwise['full_gray']) root.style.filter += ' grayscale(100%)';
	if(player.options.ui.otherwise['blur']) root.style.filter += ' blur(5px)';
	if(player.options.ui.otherwise['sepia']) root.style.filter += ' sepia(100%) brightness(0.8)';
}

export function reverseUiOptions(x: string){
	player.options.ui.otherwise[x] = !player.options.ui.otherwise[x];
}