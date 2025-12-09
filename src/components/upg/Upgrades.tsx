import type { buyables, upgrades } from '@/core/mechanic';
import { defineComponent, type PropType } from 'vue';
import TDUpgrade from '../group-2/TDUpgrade.vue';
import TDBuyable from '../group-2/TDBuyable.vue';

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
		return () => (
			<>
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
			</>
		);
	},
});
