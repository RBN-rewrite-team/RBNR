import { Garden, GardenGenUpgs, isGardenGenerator, type GardenGenerator } from '@/core/pt/garden';
import { player } from '@/core/save';
import Decimal from 'break_eternity.js';
import { defineComponent, type PropType, type Ref } from 'vue';
import GardenNode from './GardenNode';
import { format, formatWhole } from '@/utils/format';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'GardenGenerator',
	props: {
		canvasRef: {
			type: Object as PropType<Ref<HTMLDivElement | null, HTMLDivElement | null>>,
			required: true,
		},
		upgrade: {
			type: Object as PropType<GardenGenerator>,
			required: true,
		},
	},
	setup(props, ctx) {
		const canvasRef = props.canvasRef;
		const g = props.upgrade;

		const $t = useI18n().t;
		return () => (
			<>
				<div
					v-hold={{
						handler: {
							onProgress() {
								if (
									isGardenGenerator(player.garden.focusNode) &&
									player.garden.focusNode.key == g.key &&
									g.unlocked()
								)
									Garden.buyGenerator(
										g.key as keyof typeof GardenGenUpgs.generators,
										new Decimal(1),
									);
								player.garden.focusNode = g;
							},
						},
					}}
				>
					{g.unlocked() ? (
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
											new Decimal(1),
										);
									player.garden.focusNode = g;
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
					)}
				</div>
			</>
		);
	},
});
