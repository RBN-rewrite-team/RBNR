import { player } from '../core/save';
import { computed } from 'vue';

export enum themes {
	CLASSIC = 0,
	DARK = 1,
	SUN = 2,
	OCEAN = 3 /*
	ABYSSAL,
	REALITY,
	IMAGINARY,
	DIMENSION,
	WIND_SPIRIT,
	PARADOX*/,
}

export const themeDetailsMap = new Map([
	[
		themes.CLASSIC,
		{
			name: '浅色',
			ordinary: {
				'AppBackgroundColor': '#f3f3f3',
				'BackgroundColor': '#fdfdfd',
				'Color': '#000000',
				'SuptitleColor': '#4f4f4f',
				'TitleColor': '#8e8e8e',
				'BorderColor': '#d0d0d0',
				'HoverColor': '#e2e2e2',
			} as const,
			other: {} as const,
		},
	],
	[
		themes.DARK,
		{
			name: '深色',
			ordinary: {
				'AppBackgroundColor': '#0c0c0c',
				'BackgroundColor': '#020202',
				'Color': '#ffffff',
				'SuptitleColor': '#b0b0b0',
				'TitleColor': '#717171',
				'BorderColor': '#2f2f2f',
				'HoverColor': '#1d1d1d',
			} as const,
			other: {} as const,
		},
	],
	[
		themes.SUN,
		{
			name: '太阳',
			ordinary: {
				'AppBackgroundColor': '#ffcc00',
				'BackgroundColor': '#ff9900',
				'Color': '#ffffff',
				'SuptitleColor': '#ffff00',
				'TitleColor': '#ff6633',
				'BorderColor': '#ffcc99',
				'HoverColor': '#ff6633',
			} as const,
			other: {} as const,
		},
	],
	[
		themes.OCEAN,
		{
			name: '海洋',
			ordinary: {
				'AppBackgroundColor': '#00ccff',
				'BackgroundColor': '#0066cc',
				'Color': '#ffffff',
				'SuptitleColor': '#00ffff',
				'TitleColor': '#003333',
				'BorderColor': '#006699',
				'HoverColor': '#0099cc',
			} as const,
			other: {
				filter: 'hue-rotate(15deg) brightness(0.8)',
			} as const,
		},
	],
]);

export function reverseUiOptions(x: string) {
	player.options.ui.otherwise[x] = !player.options.ui.otherwise[x];
}

export const computedTheme = computed(function() {
  let theme = themeDetailsMap.get(player.options.ui.theme)!;
  let other = theme.other;
  let filter = "";
  if (other.filter) {
		filter = other.filter;
	}
	if (player.options.ui.otherwise['color_inversion']) filter += ' hue-rotate(180deg)';
	if (player.options.ui.otherwise['full_gray']) filter += ' grayscale(100%)';
	if (player.options.ui.otherwise['blur']) filter += ' blur(5px)';
	if (player.options.ui.otherwise['sepia']) filter += ' sepia(100%) brightness(0.8)';
	return {
	  ...theme.ordinary,
	  filter
	}
})