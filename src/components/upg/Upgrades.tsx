import { BUYABLES, buyables, UPGRADES, upgrades } from '@/core/mechanic';
import { defineComponent, ref, type PropType } from 'vue';
import TDUpgrade from './TDUpgrade.vue';
import TDBuyable from './TDBuyable.vue';
import { player } from '@/core/save';
import { useI18n } from 'vue-i18n';
import type { $t } from '@/utils/types';
import { format, formatWhole } from '@/utils/format';
import { i18n } from '@/utils/i18n';
import { wordShift } from '@/core/word-shift';
import { Upgrade, UpgradeWithEffect } from '@/core/upgrade';
import { OrdinalUtils } from '@/utils/ordinal';
import { Dilute } from '@/core/hydra/dilute';
import { currencyName, getCurrency } from '@/core/currencies';
import { feature } from '@/core/global';
import { costHTMLBYL, getUpgradeDescription } from './displays';
import { Logarithm } from '@/core/exponention/logarithm';

export function isNotBuyable<T extends `u${string}` | `b${string}`>(
	x: T,
): x is T extends `u${string}` ? T : never {
	return x[0] == 'u';
}

export function sliceUpgID<T extends `u${keyof typeof upgrades}` | `b${keyof typeof buyables}`>(
	x: T,
): T extends `${'u' | 'b'}${infer Q}`
	? Q extends keyof typeof upgrades | keyof typeof buyables
		? Q
		: never
	: never {
	return x.slice(1) as T extends `${'u' | 'b'}${infer Q}`
		? Q extends keyof typeof upgrades | keyof typeof buyables
			? Q
			: never
		: never;
}
function getUpgName(b: `u${keyof typeof upgrades}` | `b${keyof typeof buyables}`, $t: $t) {
	return isNotBuyable(b)
		? upgrades[sliceUpgID(b)].name == 'U0-114514'
			? $t(`upgs.${sliceUpgID(b)}.name`)
			: upgrades[sliceUpgID(b)].name
		: buyables[sliceUpgID(b)].name == 'B0-114514'
			? $t(`upgs.byl.${sliceUpgID(b)}.name`)
			: buyables[sliceUpgID(b)].name;
}
function showUpgrade(b: `u${keyof typeof upgrades}` | `b${keyof typeof buyables}`) {
	return isNotBuyable(b) ? UPGRADES.lock(sliceUpgID(b)).show : BUYABLES.lock(sliceUpgID(b)).show;
}

const isTouchDevice = navigator.maxTouchPoints > 0

function displayUpgrade(b: `u${keyof typeof upgrades}` | `b${keyof typeof buyables}`, $t: $t) {
	return (
		<>
			{isNotBuyable(b) ? (
				<>
					<div class="sky">[{getUpgName(b, $t)}]</div>
					<div innerHTML={getUpgradeDescription(sliceUpgID(b), $t)}></div>

					{(() => {
						const curupg = upgrades[sliceUpgID(b)];

						function actualCost(curupg: Upgrade) {
							let cost =
								typeof curupg.cost === 'function' ? curupg.cost() : curupg.cost;
							if (
								player.hydra.dilute.inDilute &&
								sliceUpgID(b).startsWith('6') &&
								(!sliceUpgID(b).endsWith('S') || player.challengein[0] == 1)
							) {
								cost = cost.pow(4 - 3 * 0.75 ** Dilute.diluteAmount(1));
							}
							return cost;
						}
						return (
							<>
								{UpgradeWithEffect.isWithEffect<any>(curupg) && (
									<>
										<div
											style={{
												color: 'green',
											}}
											innerHTML={$t('upg.effect', {
												effect: curupg.effectDescription(curupg.effect()),
											})}
										></div>
									</>
								)}
								{
									<div
										innerHTML={$t('upg.cost', {
											cost:
												b == 'using1'
													? 'ω+4'
													: curupg.ordinal
														? OrdinalUtils.numberToOrdinal(
																actualCost(curupg),
																feature.Ordinal.base(),
															)
														: format(actualCost(curupg)),
											currency: currencyName(curupg.currency, $t),
										})}
									></div>
								}
							</>
						);
					})()}
				</>
			) : (
				<>
					<div class="sky">
						[{getUpgName(b, $t)}](
						{formatWhole(player.buyables[sliceUpgID(b)])})
					</div>
					<div innerHTML={$t(`upgs.byl.${sliceUpgID(b)}`)}></div>

					<div
						style={{
							color: 'green',
						}}
						innerHTML={$t('upg.effect.byl', {
							effect: buyables[sliceUpgID(b)].effectDescription(
								player.buyables[sliceUpgID(b)],
								$t,
							),
							next: buyables[sliceUpgID(b)].effectDescription(
								player.buyables[sliceUpgID(b)].add(1),
								$t,
							),
						})}
					></div>
					<div innerHTML={costHTMLBYL(sliceUpgID(b), $t)}></div>
				</>
			)}
		</>
	);
}
function buyUpgrade(b: `u${keyof typeof upgrades}` | `b${keyof typeof buyables}`) {
	if (isNotBuyable(b)) {
		return UPGRADES.buy(sliceUpgID(b));
	}
	return BUYABLES.buy(sliceUpgID(b));
}
function getClass(b: `u${keyof typeof upgrades}` | `b${keyof typeof buyables}`) {
	const upgs = ['newui-upg'];
	if (isNotBuyable(b)) {
		const id = sliceUpgID(b);
		if (player.upgrades[id]) upgs.push('newui-upg_bought');
		else if (UPGRADES.lock(id).unlocked && upgrades[id].canAfford())
			upgs.push('newui-upg_buyable');
	} else {
		const id = sliceUpgID(b);
		if (buyables[id].capped(player.buyables[id])) upgs.push('newui-upg_bought');
		else if (
			BUYABLES.lock(id).unlocked &&
			buyables[id].canAfford() &&
			buyables[id].cost(player.buyables[id]).lte(getCurrency(buyables[id].currency))
		) {
			upgs.push('newui-upg_buyable');
		}
	}

	return upgs;
}
export default defineComponent({
	name: 'Upgrades',
	props: {
		upgids: {
			type: Array as PropType<
				Readonly<Readonly<(`u${keyof typeof upgrades}` | `b${keyof typeof buyables}`)[]>[]>
			>,
			required: true,
		},
		smaller: {
			type: Boolean,
		},
	},
	setup(props, ctx) {
		const hoverupg = ref<`u${keyof typeof upgrades}` | `b${keyof typeof buyables}` | null>(
			null,
		);
		const $t = useI18n().t;
		return () => (
			<>
				{player.options.ui.upgnewui ? (
					<>
						<div class="upg_text_box">
							<span>
								{hoverupg.value !== null && displayUpgrade(hoverupg.value, $t)}
							</span>
						</div>
						<br />
						<table
							style={{
								marginInlineStart: 'auto',
								marginInlineEnd: 'auto',
							}}
						>
							<tbody>
								{props.upgids.map((a) => {
									return (
										<tr>
											{a.map((b) => (
												<td>
													{showUpgrade(b) && (
														<div
															class={getClass(b)}
															onTouchstart={() =>
																{if (isTouchDevice) hoverupg.value = b}
															}
															onTouchend={() =>
																{if (isTouchDevice) hoverupg.value = null}
															}
															onMouseover={() => {if (!isTouchDevice) hoverupg.value = b}}
															onMouseleave={() =>
																{if (!isTouchDevice) hoverupg.value = null}
															}
															onClick={() => buyUpgrade(b)}
															v-hold={{
																handler: {
																	onProgress() {
																		buyUpgrade(b);
																	},
																},
																interval: 5,
															}}
														>
															{getUpgName(b, $t)}
														</div>
													)}
												</td>
											))}
										</tr>
									);
								})}
							</tbody>
						</table>
					</>
				) : (
					<table
						style={{
							marginInlineStart: 'auto',
							marginInlineEnd: 'auto',
						}}
					>
						<tbody class={props.smaller ? ['smaller'] : ''}>
							{props.upgids.map((a) => {
								return (
									<tr
										style={{
											height: props.smaller ? '135px' : '180px',
										}}
									>
										{a.map((b) =>
											isNotBuyable(b) ? (
												<TDUpgrade upgid={sliceUpgID(b)} />
											) : (
												// b
												<TDBuyable bylid={sliceUpgID(b)} />
											),
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</>
		);
	},
});
