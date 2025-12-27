import { defineComponent, type PropType, type Ref } from 'vue';
import GardenNode from './GardenNode';
import { format } from '@/utils/format';
import { Garden, isGardenUpgrade, type GardenGenUpgs, type GardenUpgrade } from '@/core/pt/garden';
import { player } from '@/core/save';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'GardenUpgrade',
	props: {
		canvasRef: {
			type: Object as PropType<Ref<HTMLDivElement | null, HTMLDivElement | null>>,
			required: true,
		},
		upgrade: {
			type: Object as PropType<GardenUpgrade>,
			required: true,
		},
	},
	setup(props, ctx) {
		const canvasRef = props.canvasRef;
		const g = props.upgrade;

		const $t = useI18n().t;
		return () => (
			<>
				{g.unlocked() ? (
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
								'border-color': player.garden.upgrades[g.key]
									? g.currency.color
									: 'grey',
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
				)}
			</>
		);
	},
});
