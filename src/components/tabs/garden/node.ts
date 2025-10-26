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
	let width = obj.offsetWidth;
	let height = obj.offsetHeight;
	let base = {
		top: height * 0.5 + rely + (mini ? 25 : 0) - temp.garden.focus_pos[1] + 'px',
		left: width * 0.5 + relx + (mini ? 25 : 0) - temp.garden.focus_pos[0] + 'px',
	} as CSSProperties;
	if (mini) ((base.width = '45px'), (base.height = '45px'), (base['border-radius'] = '2px'));
	return base;
}
