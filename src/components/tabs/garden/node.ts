import { temp } from '@/core/temp-data';
import type { CSSProperties, Ref } from 'vue';

export function getNodeStyle(
	relx: number,
	rely: number,
	canvasRef: Ref<HTMLDivElement | null>,
	mini: boolean,
): CSSProperties {
	const obj = canvasRef.value;
	if (!obj) return {};
	const width = obj.offsetWidth;
	const height = obj.offsetHeight;
	const base = {
		top: height * 0.5 + rely + (mini ? 25 : 0) - temp.garden.focus_pos[1] + 'px',
		left: width * 0.5 + relx + (mini ? 25 : 0) - temp.garden.focus_pos[0] + 'px',
	} as CSSProperties;
	if (mini) ((base.width = '45px'), (base.height = '45px'), (base['border-radius'] = '2px'));
	return base;
}

export function outOfScreen(relx: number, rely: number, canvasRef: Ref<HTMLDivElement | null>) {
	const obj = canvasRef.value;
	if (!obj) return {};
	const width = obj.offsetWidth;
	const height = obj.offsetHeight;
	const base = {
		top: height * 0.5 + rely - temp.garden.focus_pos[1],
		left: width * 0.5 + relx - temp.garden.focus_pos[0],
	};
	return base.top < -100 || base.left < -100 || base.top > height || base.left > width;
}

export function getConnectStyle(
	relx: number,
	rely: number,
	canvasRef: Ref<HTMLDivElement | null>,
): CSSProperties {
	const obj = canvasRef.value;
	if (!obj) return {};
	const width = obj.offsetWidth;
	const height = obj.offsetHeight;
	const base = {
		top: height * 0.5 - rely + 50 + 'px',
		left: width * 0.5 - relx + 50 + 'px',
	} as CSSProperties;
	return base;
}
