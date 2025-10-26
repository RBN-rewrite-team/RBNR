import { player } from '@/core/save';
import { isDeveloper } from '@/core/save/testing';
import { temp } from '@/core/temp-data';
import { defineComponent, ref } from 'vue';
import { getNodeStyle } from './node';
import {
	Garden,
	GardenGenUpgs,
	type GardenGenerator,
	type GardenUpgrade,
} from '@/core/pt/index.ts';
import GardenNode from './GardenNode';
import ModalService from '@/utils/Modal';
import Baixie from '@/components/group-2/Baixie.vue';
import { format, formatWhole } from '@/utils/format';
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

function simulateText(canvasRef: any) {
	let mapping = [[], []] as [GardenGenerator[], GardenUpgrade[]];
	for (let i in GardenGenUpgs.generators) {
		mapping[0].push(
			GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators],
		);
	}
	for (let i in GardenGenUpgs.upgrades) {
		mapping[1].push(
			GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades],
		);
	}
	return (
		<>
			{mapping[0].map((g) => (
				<>
					<GardenNode
						x={g.pos[0]}
						y={g.pos[1]}
						canvasRef={canvasRef}
						onClick={function () {
							player.garden.focusNode = g;
						}}
					>
						<h2 style="position: relative; bottom: -80px">{g.name}</h2>
						<br />
						<span style="position: relative; bottom: -60px">
							{format(
								Garden.generatorCost(
									g.key as keyof typeof GardenGenUpgs.generators,
								),
							)}{' '}
							Idea
						</span>
					</GardenNode>
				</>
			))}
			{mapping[1].map((g) => (
				<>
					<GardenNode
						x={g.pos[0]}
						y={g.pos[1]}
						canvasRef={canvasRef}
						mini={true}
						onClick={function () {
							player.garden.focusNode = g;
						}}
					>
						<h3 style="position: relative; bottom: -60px">{g.name}</h3>
						<br />
						<span style="position: relative; bottom: -40px">{format(g.cost)} Idea</span>
					</GardenNode>
				</>
			))}
		</>
	);
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
						{player.garden.openSimulate ? (
							simulateText(canvasRef)
						) : (
							<>
								<GardenNode
									x={0}
									y={0}
									canvasRef={canvasRef}
									onClick={function () {
										player.garden.openSimulate = !player.garden.openSimulate;
									}}
								>
									启动子世界
								</GardenNode>
							</>
						)}
					</div>
				</div>
			</>
		);
	},
});
