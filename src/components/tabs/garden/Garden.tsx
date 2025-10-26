import { player } from '@/core/save';
import { isDeveloper } from '@/core/save/testing';
import { temp } from '@/core/temp-data';
import { computed, defineComponent, ref, type CSSProperties } from 'vue';

export function onMousedown(m: MouseEvent) {
	temp.garden.press = true;
	temp.garden.press_last = [m.clientX, m.clientY];
}
export function onTouchstart(m: TouchEvent) {
	temp.garden.tpress = true;
	temp.garden.tpress_last = [m.changedTouches[0].clientX, m.changedTouches[0].clientY];
}
export function onMouseup(m: MouseEvent) {
	temp.garden.press = false;
}
export function onTouchend(m: TouchEvent) {
	temp.garden.tpress = false;
}
export function onMousemove(m: MouseEvent) {
	if (temp.garden.press) {
		temp.garden.focus_pos[0] -= m.clientX - temp.garden.press_last[0];
		temp.garden.focus_pos[1] -= m.clientY - temp.garden.press_last[1];
		temp.garden.press_last = [m.clientX, m.clientY];
	}
}
export function onTouchmove(m: TouchEvent) {
	if (temp.garden.tpress) {
		temp.garden.focus_pos[0] -= m.changedTouches[0].clientX - temp.garden.tpress_last[0];
		temp.garden.focus_pos[1] -= m.changedTouches[0].clientY - temp.garden.tpress_last[1];
		temp.garden.tpress_last = [m.changedTouches[0].clientX, m.changedTouches[0].clientY];
	}
}

export default defineComponent({
	name: 'Garden',
	setup(props, ctx) {
		if (!isDeveloper()) return () => <></>;

		const canvasRef = ref<HTMLDivElement | null>(null);

		function getNodeStyle(relx: number, rely: number): CSSProperties {
			const obj = canvasRef.value;
			if (!obj) return {};
			let width = obj.offsetWidth;
			let height = obj.offsetHeight;
			return {
				top: height * 0.5 + rely - temp.garden.focus_pos[1] + 'px',
				left: width * 0.5 + relx - temp.garden.focus_pos[0] + 'px',
			};
		}

		return () => (
			<>
				<div
					class={'main'}
					onMousedown={onMousedown}
					onTouchstart={onTouchstart}
					onMouseup={onMouseup}
					onTouchend={onTouchend}
					onTouchmove={onTouchmove}
					onMousemove={onMousemove}
					id="canvas"
					ref={canvasRef}
				>
					何意味。
					<div class={'canvas_corner'}>
						<div class="node" style={{ ...getNodeStyle(0, 0), borderColor: 'white' }}>
							<span class="node_desc">{JSON.stringify(temp.garden)}</span>
						</div>
						<div
							class="node"
							style={{ ...getNodeStyle(100, 100), borderColor: 'white' }}
						>
							<span class="node_desc">何意味</span>
						</div>
						{/* <div 
                            class="node" 
                            style=" top: 596px; left: 627px; border-color: white"
                            >
                            <span class="node_desc">{JSON.stringify(temp.garden)}</span>
                        </div>
                        <div 
                            class="node_conn" 
                            style="border-color: white; transform: translate(-50%, -50%) rotate(90deg); top: 96px; left: 627px; width: 1000px"
                        >
                            <span class="node_desc">Boost</span></div>
                        <div  
                            class="node_conn" 
                            style="border-color: white; transform: translate(-50%, -50%) rotate(116.56505117707799deg); top: 696px; left: 577px; width: 223.60679774997897px"
                        ></div>
                        <div 
                            class="node" 
                            style="transform: translate(-50%, -50%); top: 796px; left: 527px; border-color: white" 
                        >
                            <span class="node_desc">何意味</span>
                        </div>
                        <div 
                            class="node" 
                            style="transform: translate(-50%, -50%); top: 996px; left: 827px; border-color: white"
                        ><span class="node_desc">百因必有果，你的报应就是我</span></div> */}
					</div>
				</div>
			</>
		);
	},
});
