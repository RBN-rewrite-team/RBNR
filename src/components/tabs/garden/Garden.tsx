import { player } from '@/core/save';
import { isDeveloper } from '@/core/save/testing';
import { temp } from '@/core/temp-data';
import { defineComponent, ref } from 'vue';
import { getNodeStyle } from './node';
import {
	Garden,
	GardenGenUpgs,
	isGardenGenerator,
	isGardenUpgrade,
	type GardenGenerator,
	type GardenUpgrade,
} from '@/core/pt/index.ts';
import GardenNode from './GardenNode';
import GardenConnect from './GardenConnect';
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

function getConnect() {
	let connectOrigin = [],
		connect = [];
	for (let i in GardenGenUpgs.generators) {
		let pos =
			GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators].pos;
		connectOrigin.push([
			pos,
			GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators].connect,
		]);
	}
	for (let i in GardenGenUpgs.upgrades) {
		let pos = GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].pos;
		connectOrigin.push([
			pos,
			GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].connect,
		]);
	}
	for (let i in connectOrigin) {
		let c = connectOrigin[i][1];

		//@ts-expect-error
		for (let j in c[0]) {
			//@ts-expect-error
			connect.push([connectOrigin[i][0], GardenGenUpgs.generators[c[0][j]].pos]);
		}
		//@ts-expect-error
		for (let j in c[1]) {
			//@ts-expect-error
			connect.push([connectOrigin[i][0], GardenGenUpgs.upgrades[c[1][j]].pos]);
		}
	}
	return connect;
}

const can_cal = {
	dx(x: number) {
		return temp.garden.focus_pos[0] - x;
	},
	dy(y: number) {
		return temp.garden.focus_pos[1] - y;
	},
};

type Branch = {
	cx: number;
	cy: number;
	deg: number;
	length: number;
};

function getBranchPara(mx1: number, my1: number, mx2: number, my2: number): Branch {
	let x1 = can_cal.dx(mx1),
		x2 = can_cal.dx(mx2);
	let y1 = can_cal.dy(my1),
		y2 = can_cal.dy(my2);
	let cx = (x1 + x2) / 2,
		cy = (y1 + y2) / 2;
	let deg = Math.atan(Math.abs(y1 - y2) / Math.abs(x1 - x2)) * (180 / Math.PI);
	let length = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	if (x1 > x2) deg = 180 - deg;
	if (y1 > y2) deg = 180 - deg;
	return { cx: cx, cy: cy, deg: deg, length: length };
}

function simulateText(canvasRef: any) {
	let mapping = [[], []] as [GardenGenerator[], GardenUpgrade[]];
	let connecting = [] as Branch[];
	let connect = getConnect();
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
	for (let i in connect) {
		connecting.push(
			getBranchPara(connect[i][0][0], connect[i][0][1], connect[i][1][0], connect[i][1][1]),
		);
	}
	return (
		<>
			{mapping[0].map((g) =>
				g.unlocked() ? (
					<>
						<GardenNode
							x={g.pos[0]}
							y={g.pos[1]}
							canvasRef={canvasRef}
							onClick={function () {
								if (
									isGardenGenerator(player.garden.focusNode) &&
									player.garden.focusNode.key == g.key
								)
									Garden.buyGenerator(
										g.key as keyof typeof GardenGenUpgs.generators,
									);
								player.garden.focusNode = g;
							}}
						>
							<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%)">{g.name}</h2>
							<h3 style="position: absolute; top: -60px; left: -60px">
								x
								{formatWhole(
									player.garden.generators[
										g.key as unknown as keyof typeof GardenGenUpgs.generators
									],
								)}
							</h3>
							<span style="position: absolute; left: 50%; bottom: -100px; transform: translate(-50%, -50%)">
								{format(
									Garden.generatorCost(
										g.key as keyof typeof GardenGenUpgs.generators,
									),
									6,
								)}{' '}
								Idea
							</span>
						</GardenNode>
					</>
				) : (
					<>
						<GardenNode
							x={g.pos[0]}
							y={g.pos[1]}
							canvasRef={canvasRef}
							nodestyle={{ filter: 'brightness(0.75)' }}
						>
							<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%)">???</h2>
						</GardenNode>
					</>
				),
			)}
			{mapping[1].map((g) =>
				g.unlocked() ? (
					<>
						<GardenNode
							x={g.pos[0]}
							y={g.pos[1]}
							canvasRef={canvasRef}
							mini={true}
							onClick={function () {
								if (
									isGardenUpgrade(player.garden.focusNode) &&
									player.garden.focusNode.key == g.key
								)
									Garden.buyUpgrade(g.key as keyof typeof GardenGenUpgs.upgrades);
								player.garden.focusNode = g;
							}}
							nodestyle={{
								filter:
									'brightness(' +
									(player.garden.upgrades[g.key] ? 1 : 0.75) +
									')',
							}}
						>
							<h3 style="position: absolute; left: 50%; bottom: -60px; transform: translate(-50%, -50%)">{g.name}</h3>
							{
								!Garden.boughtUpgrade(g.key as keyof typeof GardenGenUpgs.upgrades) ?
								<>
									<span style="position: absolute; left: 50%; bottom: -73px; transform: translate(-50%, -50%)">
										{format(Garden.upgradeCost(
											g.key as keyof typeof GardenGenUpgs.upgrades
										), 6)} Idea
									</span>
								</>
								: <></>
							}
						</GardenNode>
					</>
				) : (
					<>
						<GardenNode
							x={g.pos[0]}
							y={g.pos[1]}
							canvasRef={canvasRef}
							mini={true}
							nodestyle={{ filter: 'brightness(0.75)' }}
						>
							<h3 style="position: absolute; left: 50%; bottom: -60px; transform: translate(-50%, -50%)">???</h3>
						</GardenNode>
					</>
				),
			)}
			{connecting.map((c) =>
				true ? (
					<>
						<GardenConnect
							x={c.cx}
							y={c.cy}
							canvasRef={canvasRef}
							rotate={c.deg}
							length={c.length}
						></GardenConnect>
					</>
				) : (
					<></>
				),
			)}
		</>
	);
}

export default defineComponent({
	name: 'Garden',
	setup(props, ctx) {
		if (!isDeveloper()) return () => <></>;

		const canvasRef = ref<HTMLDivElement | null>(null);

		return () => (
			<><div style="position: absolute; width: 100%; height: 100%; overflow: hidden">
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
				<div class={'focus_box'}>
					<div style="position: relative; width: 100%; height: 100%">
						<h4 style="position: absolute; top: 4px; left: 4px">
							{player.garden.focusNode.name}
						</h4>
						<h5 style="position: absolute; top: 4px; right: 4px">
							{(isGardenGenerator(player.garden.focusNode) ?? false)
								? format(
										Garden.generatorCost(
											player.garden.focusNode
												.key as keyof typeof GardenGenUpgs.generators,
										),
									)
								: format(
										Garden.upgradeCost(
											player.garden.focusNode
												.key as keyof typeof GardenGenUpgs.upgrades,
										),
									)}{' '}
							Idea
						</h5>
						<br />
						<br />
						{(isGardenGenerator(player.garden.focusNode) ?? false) ? (
							<>
								Produce{' '}
								{format(
									Garden.generatorIdea(
										player.garden.focusNode
											.key as keyof typeof GardenGenUpgs.generators,
									),
								)}{' '}
								Idea
								<br />
								Produce{' '}
								{format(
									Garden.generatorEntropy(
										player.garden.focusNode
											.key as keyof typeof GardenGenUpgs.generators,
									),
								)}{' '}
								Entropy
								<br />
							</>
						) : (
							<>
								Improve{' '}
								{
									GardenGenUpgs.generators[
										(player.garden.focusNode as GardenUpgrade).effect
											.key as unknown as keyof typeof GardenGenUpgs.generators
									].name
								}{' '}
								by x{format((player.garden.focusNode as GardenUpgrade).effect.mult)}
								<br />
							</>
						)}
					</div>
				</div></div>
			</>
		);
	},
});
