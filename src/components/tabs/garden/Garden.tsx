import { player } from '@/core/save';
import { isDeveloper, isTester } from '@/core/save/testing';
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
export function onWheel(m: WheelEvent) {
	temp.garden.focus_pos[0] += m.deltaX;
	temp.garden.focus_pos[1] += m.deltaY;
}
function getConnect() {
	const connectOrigin = [],
		connect = [];
	for (const i in GardenGenUpgs.generators) {
		//@ts-expect-error
		if(GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators].show?.() ?? true)
		{
			const pos =
				GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators].pos;
			connectOrigin.push([
				pos,
				GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators].connect,
			]);
		}
	}
	for (const i in GardenGenUpgs.upgrades) {
		//@ts-expect-error
		if(GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.generators].show?.() ?? true)
		{
			const pos = GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].pos;
			connectOrigin.push([
				pos,
				GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].connect,
			]);
		}
	}
	for (const i in connectOrigin) {
		const c = connectOrigin[i][1];

		//@ts-expect-error
		for (const j in c[0]) {
			//@ts-expect-error
			connect.push([connectOrigin[i][0], GardenGenUpgs.generators[c[0][j]].pos]);
		}
		//@ts-expect-error
		for (const j in c[1]) {
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
	const x1 = can_cal.dx(mx1),
		x2 = can_cal.dx(mx2);
	const y1 = can_cal.dy(my1),
		y2 = can_cal.dy(my2);
	const cx = (x1 + x2) / 2,
		cy = (y1 + y2) / 2;
	let deg = Math.atan(Math.abs(y1 - y2) / Math.abs(x1 - x2)) * (180 / Math.PI);
	const length = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
	if (x1 > x2) deg = 180 - deg;
	if (y1 > y2) deg = 180 - deg;
	return { cx: cx, cy: cy, deg: deg, length: length };
}

function simulateText(canvasRef: any) {
	const mapping = [[], []] as [GardenGenerator[], GardenUpgrade[]];
	const connecting = [] as Branch[];
	const connect = getConnect();
	for (const i in GardenGenUpgs.generators) {
		mapping[0].push(
			GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators],
		);
	}
	for (const i in GardenGenUpgs.upgrades) {
		mapping[1].push(
			GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades],
		);
	}
	for (const i in connect) {
		connecting.push(
			getBranchPara(connect[i][0][0], connect[i][0][1], connect[i][1][0], connect[i][1][1]),
		);
	}
	return (
		<>
			{mapping[0].map((g) => (!(g.show?.() ?? true) ? null : (
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
							<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%)">
								{g.name}
							</h2>
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
								想法
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
							<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%)">
								???
							</h2>
						</GardenNode>
					</>
				))),
			)}
			{mapping[1].map((g) => (!(g.show?.() ?? true) ? null : (
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
								'border-color':
									(player.garden.upgrades[g.key] ? 'green' : 'grey'),
								transform:
									'scale(' + (Garden.canBoughtUpgrade(g.key as keyof typeof GardenGenUpgs.upgrades) && !Garden.boughtUpgrade(g.key as keyof typeof GardenGenUpgs.upgrades) ? '1.15' : '1'),
								'background-color':
									(GardenGenUpgs.upgrades[g.key].useInspiration ? 'rgba(255, 153, 18, 1)': 'var(--background-color)'),
							}}
						>
							<h3 style="position: absolute; left: 50%; bottom: -60px; transform: translate(-50%, -50%)">
								{g.name}
							</h3>
							{!Garden.boughtUpgrade(g.key as keyof typeof GardenGenUpgs.upgrades) ? (
								<>
									<span style="position: absolute; left: 50%; bottom: -73px; transform: translate(-50%, -50%)">
										{format(
											Garden.upgradeCost(
												g.key as keyof typeof GardenGenUpgs.upgrades,
											),
											6,
										)}{' '}
										{
											g.useInspiration ? '灵感' : '想法'
										}
									</span>
								</>
							) : (
								<></>
							)}
						</GardenNode>
					</>
				) : (
					<>
						<GardenNode
							x={g.pos[0]}
							y={g.pos[1]}
							canvasRef={canvasRef}
							mini={true}
							nodestyle={{
								filter: 'brightness(0.75)',
								'background-color':
									(GardenGenUpgs.upgrades[g.key].useInspiration ? 'rgba(255, 153, 18, 0.75)': 'var(--background-color)'),
							}}
						>
							<h3 style="position: absolute; left: 50%; bottom: -60px; transform: translate(-50%, -50%)">
								???
							</h3>
						</GardenNode>
					</>
				))),
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
			{
			(player.garden.bestIdea.gte(1e6) || player.garden.igTimes.gt(0))
				? <>
					<GardenNode
						x={-150}
						y={300}
						canvasRef={canvasRef}
						nodestyle={{ 'border-color': 'orange', 'width': '400px', 'border-radius': '0px', 'filter': 'brightness(' + (Garden.igGain().gte(1) ? '1' : '0.75') + ')' }}
						onClick={function() {
							Garden.igReset();
						}}
					>
						{
							Garden.nextIgRemain() > 0 ?
							<><h3>距离下一次可用还有<h2 style="color: orange">{Garden.nextIgRemain()}ms/{Garden.igCD()}ms</h2></h3></>
							:
							<><h3><h2 style="color: orange">{format(Garden.igGain())}</h2>灵感</h3></>
						}
						<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%); color: orange">
							灵感迸发
						</h2>
					</GardenNode>
				</>
				: <>
					<GardenNode
						x={-150}
						y={300}
						canvasRef={canvasRef}
						nodestyle={{ 'border-color': 'orange', 'width': '400px', 'border-radius': '0px' }}
					>
						<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%); color: orange">
							???
						</h2>
					</GardenNode>
				</>
			}
		</>
	);
}

export default defineComponent({
	name: 'Garden',
	setup(props, ctx) {
		if (!player.options.gammaTest) return () => <></>;

		const canvasRef = ref<HTMLDivElement | null>(null);

		return () => (
			<>
				<div style="position: absolute; width: 100%; height: 100%; overflow: hidden">
					<div
						class={'main'}
						onMousedown={onMousedown}
						onTouchstart={onTouchstart}
						onMouseup={onMouseup}
						onTouchend={onTouchend}
						onTouchmove={onTouchmove}
						onMousemove={onMousemove}
						onWheel={onWheel}
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
											player.garden.openSimulate =
												!player.garden.openSimulate;
											player.garden.lastIG = Date.now();
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
								{(isGardenGenerator(player.garden.focusNode) ?? false)
									? '想法'
									: (GardenGenUpgs.upgrades[player.garden.focusNode.key as keyof typeof GardenGenUpgs.upgrades].useInspiration ? '灵感' : '想法'
									)}
							</h5>
							<br />
							<br />
							{(isGardenGenerator(player.garden.focusNode) ?? false) ? (
								<>
									生产{' '}
									{format(
										Garden.generatorIdea(
											player.garden.focusNode
												.key as keyof typeof GardenGenUpgs.generators,
										),
									)}{' '}
									想法
									<br />
									生产{' '}
									{format(
										Garden.generatorEntropy(
											player.garden.focusNode
												.key as keyof typeof GardenGenUpgs.generators,
										),
									)}{' '}
									熵
									<br />
								</>
							) : (
								<>
									增强
									{
										(player.garden.focusNode as GardenUpgrade).effect.key >= 0 ?
											GardenGenUpgs.generators[
												(player.garden.focusNode as GardenUpgrade).effect
													.key as unknown as keyof typeof GardenGenUpgs.generators
											].name
										:
											Garden.upgradeImproving((player.garden.focusNode as GardenUpgrade).effect.key)
									}
									：x
									{format((player.garden.focusNode as GardenUpgrade).effect.mult)}
									<br />
									{
										Garden.upgradeEffectDescription(player.garden.focusNode.key as keyof typeof GardenGenUpgs.upgrades)
									}
								</>
							)}
						</div>
					</div>
				</div>
			</>
		);
	},
});
