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
		},
		other: {
		}
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
		},
		other: {
		}
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
		},
		other: {
		}
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
		},
		other: {
			filter: 'hue-rotate(15deg) brightness(1.2) contrast(0.9)',
		}
	}],
]);

const root = document.documentElement;

export function updateTheme(){
	let theme = themeDetailsMap.get(player.options.ui.theme);
	let ordinary = theme.ordinary;
	for(let i in ordinary)
	{
		root.style.setProperty(i, ordinary[i]);
	}
	let other = theme.other;
	if(other.filter)
	{
		root.style.filter = other.filter;
	}
	else root.style.filter = '';
}