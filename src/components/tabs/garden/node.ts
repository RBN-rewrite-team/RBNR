import { temp } from '@/core/temp-data';
import type { CSSProperties, Ref } from 'vue';

export function getNodeStyle(
	relx: number,
	rely: number,
	canvasRef: Ref<HTMLDivElement | null>,
): CSSProperties {
	const obj = canvasRef.value;
	if (!obj) return {};
	let width = obj.offsetWidth;
	let height = obj.offsetHeight;
	return {
		top: height * 0.5 + rely - temp.garden.focus_pos[1] + 'px',
		left: width * 0.5 + relx - temp.garden.focus_pos[0] + 'px',
	};
}
