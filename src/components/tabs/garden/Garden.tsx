import { player } from '@/core/save';
import { temp } from '@/core/temp-data';
import { defineComponent, ref } from 'vue';
import {
	Garden,
	GardenGenUpgs,
	isGardenGenerator,
	isGardenUpgrade,
	isShow,
	type GardenGenerator,
	type GardenUpgrade,
} from '@/core/pt/index.ts';
import GardenNode from './GardenNode';
import GardenConnect from './GardenConnect';
import { format, formatLaTeX, formatTimestamp, formatWhole } from '@/utils/format';
import GardenLevelFormula from './GardenLevelFormula';
import { VueLatex } from 'vatex';
import type { $t } from '@/utils/types';
import { useI18n } from 'vue-i18n';
import { vHold } from '@/utils/vHold';
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
		if (
			isShow(GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators])
		) {
			const pos =
				GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators].pos;
			connectOrigin.push([
				pos,
				GardenGenUpgs.generators[i as unknown as keyof typeof GardenGenUpgs.generators]
					.connect,
			]);
		}
	}
	for (const i in GardenGenUpgs.upgrades) {
		if (isShow(GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.generators])) {
			const pos =
				GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].pos;
			connectOrigin.push([
				pos,
				GardenGenUpgs.upgrades[i as unknown as keyof typeof GardenGenUpgs.upgrades].connect,
			]);
		}
	}
	for (const i in connectOrigin) {
		const c = connectOrigin[i][1];

		// @ts-expect-error
		for (const j in c[0]) {
			// @ts-expect-error
			connect.push([connectOrigin[i][0], GardenGenUpgs.generators[c[0][j]].pos]);
		}
		// @ts-expect-error
		for (const j in c[1]) {
			// @ts-expect-error
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

function simulateText(canvasRef: any, $t: $t) {
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
			{mapping[0].map((g) =>
				!(g.show?.() ?? true) ? null : g.unlocked() ? (
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
							hold={{
								handler: {
									onProgress() {
										if (
											isGardenGenerator(player.garden.focusNode) &&
											player.garden.focusNode.key == g.key
										)
											Garden.buyGenerator(
												g.key as keyof typeof GardenGenUpgs.generators,
											);
										player.garden.focusNode = g;
									},
								},
							}}
						>
							<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%)">
								<span style={{ color: g.currency.elementColor }}>
									{$t(`garden.gen.${g.key}`)}
								</span>
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
								<span style={{ color: g.currency.color }}>
									{$t(`currency.${g.currency.name}`)}
								</span>
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
				),
			)}
			{mapping[1].map((g) =>
				!(g.show?.() ?? true) ? null : g.unlocked() ? (
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
								'border-color': player.garden.upgrades[g.key] ? 'green' : 'grey',
								transform:
									'scale(' +
									(Garden.canBoughtUpgrade(
										g.key as keyof typeof GardenGenUpgs.upgrades,
									) &&
									!Garden.boughtUpgrade(
										g.key as keyof typeof GardenGenUpgs.upgrades,
									)
										? '1.15'
										: '1'),
							}}
						>
							<h3 style="position: absolute; left: 50%; bottom: -60px; transform: translate(-50%, -50%)">
								<span style={{ color: g.currency.elementColor }}>
									{$t(`garden.upg.${g.key}`)}
								</span>
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
										<span style={{ color: g.currency.color }}>
											{$t(`currency.${g.currency.name}`)}
										</span>
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
							}}
						>
							<h3 style="position: absolute; left: 50%; bottom: -60px; transform: translate(-50%, -50%)">
								???
							</h3>
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
			{player.garden.bestIdea.gte(1e6) || player.garden.igTimes.gt(0) ? (
				<>
					<GardenNode
						x={-150}
						y={300}
						canvasRef={canvasRef}
						nodestyle={{
							'border-color': 'orange',
							width: '400px',
							'border-radius': '0px',
							filter: 'brightness(' + (Garden.igGain().gte(1) ? '1' : '0.75') + ')',
						}}
						onClick={function () {
							Garden.igReset();
						}}
					>
						{Garden.nextIgRemain() > 0 ? (
							<>
								<h3>
									{$t('garden.nextig2')}
									<h2 style="color: orange">
										{Garden.nextIgRemain()}ms/{Garden.igCD()}ms
									</h2>
								</h3>
								<p style="color: orange">
									{$t('garden.nextig', {
										time: formatTimestamp(Garden.nextIg()),
									})}
								</p>
							</>
						) : (
							<>
								<h3>
									<h2 style="color: orange">{format(Garden.igGain())}</h2>
									{$t('currency.灵感')}
								</h3>
							</>
						)}
						<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%); color: orange">
							{$t('garden.inspirationgenerate')}
						</h2>
					</GardenNode>
				</>
			) : (
				<>
					<GardenNode
						x={-150}
						y={300}
						canvasRef={canvasRef}
						nodestyle={{
							'border-color': 'orange',
							width: '400px',
							'border-radius': '0px',
						}}
					>
						<h2 style="position: absolute; left: 50%; bottom: -90px; transform: translate(-50%, -50%); color: orange">
							???
						</h2>
					</GardenNode>
				</>
			)}
			{Garden.boughtUpgrade(23) ? (
				<>
					<GardenNode
						x={400}
						y={300}
						canvasRef={canvasRef}
						nodestyle={{ 'border-color': 'rgb(127, 255, 2)' }}
					>
						{$t('currency.灵感能量')}
						<br />
						<span style="color: rgb(127, 255, 2); font-weight: bold;">
							{format(player.garden.insPower, 1)}
						</span>
						<br />
						<span style="font-size: 11px">
							{$t('garden.localspeedmult')}
							<br />
							<span style="color: rgb(127, 255, 2); font-weight: bold">
								{format(Garden.insPowerEffect())}
							</span>
						</span>
					</GardenNode>
				</>
			) : (
				<></>
			)}
			{Garden.boughtUpgrade(24) ? (
				<>
					<GardenNode
						x={300}
						y={0}
						canvasRef={canvasRef}
						onClick={function () {
							((temp.garden.focus_pos[0] = 0), (temp.garden.focus_pos[1] = -1750));
						}}
					>
						<h4>{$t('garden.shortcut.0.0')}</h4>
						<h3>{$t('garden.shortcut.0.1')}</h3>
					</GardenNode>
				</>
			) : (
				<></>
			)}
		</>
	);
}

export default defineComponent({
	name: 'Garden',
	setup(props, ctx) {
		if (!player.options.gammaTest) return () => <></>;

		const canvasRef = ref<HTMLDivElement | null>(null);
		const $t = useI18n().t;
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
								simulateText(canvasRef, $t)
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
										{$t('garden.startsimulate')}
									</GardenNode>
								</>
							)}
						</div>
					</div>
					<div
						class={'focus_box'}
						style={{ 'border-color': player.garden.focusNode.currency.elementColor }}
					>
						<div style="position: relative; width: 100%; height: 100%">
							<h4 style="position: absolute; top: 4px; left: 4px">
								{isGardenGenerator(player.garden.focusNode)
									? $t(`garden.gen.${player.garden.focusNode.key}`)
									: $t(`garden.upg.${player.garden.focusNode.key}`)}
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
								<span style={{ color: player.garden.focusNode.currency.color }}>
									{$t(`currency.${player.garden.focusNode.currency.name}`)}
								</span>
							</h5>
							<br />
							<br />
							{(isGardenGenerator(player.garden.focusNode) ?? false) ? (
								<>
									{$t('garden.produce', {
										prod: format(
											Garden.generatorIdea(
												player.garden.focusNode
													.key as keyof typeof GardenGenUpgs.generators,
											),
										),
									})}
									<br />
									{$t('garden.produce2', {
										prod2: format(
											Garden.generatorEntropy(
												player.garden.focusNode
													.key as keyof typeof GardenGenUpgs.generators,
											),
										),
									})}
									<br />
									{Garden.generatorEffectDescription(
										player.garden.focusNode
											.key as keyof typeof GardenGenUpgs.generators,
									)}
								</>
							) : (
								<>
									{$t('garden.enhance')}
									{(player.garden.focusNode as GardenUpgrade).effect.key >= 0
										? $t(
												`garden.gen.${
													GardenGenUpgs.generators[
														(player.garden.focusNode as GardenUpgrade)
															.effect
															.key as unknown as keyof typeof GardenGenUpgs.generators
													].key
												}`,
											)
										: Garden.upgradeImproving(
												(player.garden.focusNode as GardenUpgrade).effect
													.key,
												$t,
											)}
									: x
									{format((player.garden.focusNode as GardenUpgrade).effect.mult)}
									<br />
									{Garden.upgradeEffectDescription(
										player.garden.focusNode
											.key as keyof typeof GardenGenUpgs.upgrades,
									)}
								</>
							)}
						</div>
					</div>

					{Garden.boughtUpgrade(23) ? (
						<>
							<div style="position: absolute; top: 5px; left: 50%; transform: translateX(-50%); z-index: 3; width: 400px; height: 75px; background-color: rgb(50, 24, 2); border: 2px solid rgb(50, 50, 2)">
								<div style="position: relative; width: 100%; height: 100%">
									<div
										style={{
											position: 'absolute',
											bottom: '0',
											left: '0',
											height: '5px',
											width: Garden.expPercent(),
											'background-color': 'cyan',
										}}
									></div>
									{$t('garden.level.tag')}{' '}
									<span style="font-weight: bold; color: cyan">
										{Garden.level()}
									</span>
									<br />
									{$t('garden.level.upgrade')}
									{Garden.expPercent()}
									<br />
									<span
										innerHTML={$t('garden.level.base', {
											effect: `<span style="color: rgb(127, 255, 2); font-weight: bold">
										${format(Garden.insPowerGain(), 1)}
									</span>`,
										})}
									></span>
								</div>
							</div>
							<>
								<GardenNode x={500} y={500} canvasRef={canvasRef}>
									{$t('garden.tiplevel1')}
								</GardenNode>
								<GardenNode x={800} y={500} canvasRef={canvasRef}>
									{$t('garden.tiplevel2')}
								</GardenNode>
							</>
						</>
					) : (
						<></>
					)}
				</div>
			</>
		);
	},
});
