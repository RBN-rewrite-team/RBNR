import { player } from '@/core/save';
import { isDeveloper } from '@/core/save/testing';
import { temp } from '@/core/temp-data';
import { defineComponent, ref } from 'vue';
import { getNodeStyle } from './node';
import { Garden } from '@/core/pt/index.ts';
import GardenNode from './GardenNode';
import ModalService from '@/utils/Modal';
import Baixie from '@/components/group-2/Baixie.vue';
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
					<div class={'canvas_corner'}>
						{/* <div
							class="node"
							style={{ ...getNodeStyle(0, 0, canvasRef), borderColor: 'white' }}
						>
							<span class="node_desc">{JSON.stringify(temp.garden)}</span>
						</div> */}
						<GardenNode x={-100} y={-100} canvasRef={canvasRef}>
							百因必有果，你的报应就是我
						</GardenNode>
						<GardenNode x={300} y={0} canvasRef={canvasRef}>
							还没做完
						</GardenNode>
						<GardenNode x={0} y={0} canvasRef={canvasRef}>
							你有0 ω病毒
						</GardenNode>
						<GardenNode
							x={100}
							y={100}
							canvasRef={canvasRef}
							onClick={function () {
								ModalService.show({
									title: '拜谢',
									content: '拜谢',
								});
							}}
						>
							那我问你
							<Baixie />
						</GardenNode>
						{/* 
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
