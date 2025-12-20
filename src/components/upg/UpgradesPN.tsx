import { pnupgrades as upgrades, PN_UPGRADES as UPGRADES } from '@/core/PN-upg-byl';
import { defineComponent, ref, type PropType } from 'vue';
import { player } from '@/core/save';
import { useI18n } from 'vue-i18n';
import type { $t } from '@/utils/types';
import { getUpgradeDescription } from './displays';
import TDUpgradePN from './TDUpgradePN.vue';
import { currencyName } from '@/core/pn-currencies';
import { format } from '@/utils/format';
import { getCurrency } from '@/core/pn-currencies';

export function sliceUpgID<T extends `u${keyof typeof upgrades}`>(
	x: T,
): T extends `${'u'}${infer Q}` ? (Q extends keyof typeof upgrades ? Q : never) : never {
	return x.slice(1) as T extends `${'u'}${infer Q}`
		? Q extends keyof typeof upgrades
			? Q
			: never
		: never;
}
function getUpgName(b: `u${keyof typeof upgrades}`, $t: $t) {
	return upgrades[sliceUpgID(b)].name == 'U3-114514'
		? $t(`upgs.${sliceUpgID(b)}.name`)
		: upgrades[sliceUpgID(b)].name;
}
function showUpgrade(b: `u${keyof typeof upgrades}`) {
	return UPGRADES.lock(sliceUpgID(b)).show;
}

const isTouchDevice = navigator.maxTouchPoints > 0;

function displayUpgrade(b: `u${keyof typeof upgrades}`, $t: $t) {
	return (
		<>
			{
				<>
					<div class="sky">[{getUpgName(b, $t)}]</div>
					<div innerHTML={$t(`upgs.${sliceUpgID(b)}`)}></div>

					{(() => {
						const curupg = upgrades[sliceUpgID(b)];

						return (
							<>
								{/* {UpgradeWithEffect.isWithEffect<any>(curupg) && (
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
								)} */}
								{
									<div
										innerHTML={$t('upg.cost', {
											cost: format(
												typeof curupg.cost == 'function'
													? curupg.cost()
													: curupg.cost,
											),
											currency: currencyName(curupg.currency, $t),
										})}
									></div>
								}
							</>
						);
					})()}
				</>
			}
		</>
	);
}
function buyUpgrade(b: `u${keyof typeof upgrades}`) {
	return UPGRADES.buy(sliceUpgID(b));
}
function getClass(b: `u${keyof typeof upgrades}`) {
	const upgs = ['newui-upg'];

	const id = sliceUpgID(b);
	const a = upgrades[id];
	const cost = typeof a.cost == 'function' ? a.cost() : a.cost;
	if (player.pnupgrades[id]) upgs.push('newui-upg_bought');
	else if (
		UPGRADES.lock(id).unlocked &&
		upgrades[id].canAfford() &&
		cost.lte(getCurrency(upgrades[id].currency))
	)
		upgs.push('newui-upg_buyable');

	return upgs;
}
export default defineComponent({
	name: 'Upgrades',
	props: {
		upgids: {
			type: Array as PropType<Readonly<Readonly<`u${keyof typeof upgrades}`[]>[]>>,
			required: true,
		},
		smaller: {
			type: Boolean,
		},
	},
	setup(props, ctx) {
		const hoverupg = ref<`u${keyof typeof upgrades}` | null>(null);
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
															onTouchstart={() => {
																if (isTouchDevice)
																	hoverupg.value = b;
															}}
															onTouchend={() => {
																if (isTouchDevice)
																	hoverupg.value = null;
															}}
															onMouseover={() => {
																if (!isTouchDevice)
																	hoverupg.value = b;
															}}
															onMouseleave={() => {
																if (!isTouchDevice)
																	hoverupg.value = null;
															}}
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
										{a.map((b) => {
											let unique = Math.random().toString();
											return (
												<>
													<TDUpgradePN
														upgid={sliceUpgID(b)}
														test={unique}
													/>
												</>
											);
										})}
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
