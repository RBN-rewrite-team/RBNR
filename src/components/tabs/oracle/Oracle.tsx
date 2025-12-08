import Baixie from '@/components/group-2/Baixie.vue';
import { Oracle } from '@/core/pt/oracle/oracle.ts';
import { player } from '@/core/save/index.ts';
import { defineComponent } from 'vue';
import { format, formatWhole } from '@/utils/format.ts';
import { useUpdate } from '@/lib/useUpdate.ts';
import { DC } from '@/core/constants';
import ProgressBar from '@/components/group-2/ProgressBar';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'Oracle',

	setup(props, ctx) {
		const progress = useUpdate(() => Oracle.bitGainProgress());
		const s = useUpdate(() => {
			let r = [<></>, <></>, <></>, <></>, <></>];
			for (let i = 0; i < 5; i++) {
				let f = [<></>, <></>, <></>, <></>, <></>];
				let name = ['space', 'time', 'life', 'death', 'justice'];
				for (let j = 0; j < 5; j++) {
					f[j] = (
						<>
							<td style="width: 100px">
								{player.oracle.fate[i][j] ? (
									<div
										class={[
											'fate-bought',
											`fate-type-${player.oracle.fate[i][j]}`,
										]}
									>
										{name[player.oracle.fate[i][j] - 1]}
										<br />
										{(player.oracle.fateEffect[i][j] * 100).toFixed(3)}%<br />×
										{Oracle.getFateEffectRate(i, j).toFixed(3)}
									</div>
								) : (
									<div
										onClick={() => Oracle.buyFate(i, j)}
										class="fate-buy"
									></div>
								)}
							</td>
						</>
					);
				}
				r[i] = (
					<>
						<tr style="height: 100px">
							{f[0]}
							{f[1]}
							{f[2]}
							{f[3]}
							{f[4]}
						</tr>
					</>
				);
			}
			let s = (
				<>
					<table>
						<tbody>
							{r[0]}
							{r[1]}
							{r[2]}
							{r[3]}
							{r[4]}
						</tbody>
					</table>
				</>
			);
			return s;
		});
		const $t = useI18n().t;
		return () => (
			<>
				<div style={{ textAlign: 'center', margin: 'auto' }} class="oracle">
					<br />
					<div style="width: calc(100% - 80px); height: 200px; padding: 5px; border: 1px solid red; color: red; margin: auto;">
						<h2>{$t('oracle.title')}</h2>
						<br />
						{$t('oracle.bit')}
						<h3>
							{formatWhole(Oracle.nowBitsHave())}/
							{formatWhole(player.oracle.totalBits)}
						</h3>
						<div style="width: 100%; height: 40px; border: 1px solid orange; text-align: left">
							<div
								style={{
									width: progress.value * 100 + '%',
									height: '100%',
									'background-color': 'red',
									color: 'var(--color)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								{(progress.value * 100).toFixed(3) + '%'}
							</div>
						</div>
						{$t('oracle.1', {
							effect: format(Oracle.bitGainSpeedMult()),
						})}
						<br />
						{$t('oracle.2', {
							effect: format(player.pt.totalPower.add(10).log10()),
						})}
						<br />
						{$t('oracle.3', {
							effect: format(
								player.garden.totalInspiration
									.add(10)
									.log10()
									.sub(10)
									.div(4)
									.add(1),
							),
						})}
						<br />
					</div>
					<br />
					<div style="width: calc(100% - 80px); height: 700px; padding: 5px; border: 1px solid rgb(127, 63, 0); color: rgb(127, 63, 0); margin: auto; overflow: auto">
						<h2>{$t('oracle.fate')}</h2>
						<br />
						{$t('oracle.fate.desc')}
						<br />
						{player.pt.totalPower.gte(1e30) ? <><span style="color: cyan; font-weight: bold;">累计证明论能量令天命效率+{format(Oracle.ptPowerEffectToFateEffect())}%</span></> : <></>}
						<br />
						<table
							style={{
								marginInlineStart: '0',
								marginInlineEnd: '0',
								margin: 'auto',
							}}
						>
							<tbody>
								<tr>
									<td>
										<table>
											<tbody>
												<tr style="height: 100px">
													<td>
														<button
															class="fate-choose"
															onClick={() =>
																(player.oracle.fateChoose = 1)
															}
															style={{
																'background-color':
																	player.oracle.fateChoose == 1
																		? 'silver'
																		: '',
																position: 'relative',
																border: '1px solid silver',
															}}
														>
															空之命({player.oracle.fateBought[0]})
															<br />
															{formatWhole(Oracle.fateCost(0))}
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 1 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: silver"
																	>
																		Space
																		<br />
																		Base: CHE slog + 0.075
																		<br />
																		Tot: +
																		{format(
																			Oracle.getFateTotalEffect(
																				1,
																			),
																		)}
																	</div>
																</>
															) : (
																<></>
															)}
														</button>
													</td>
												</tr>
												<tr style="height: 100px">
													<td>
														<button
															class="fate-choose"
															onClick={() =>
																(player.oracle.fateChoose = 2)
															}
															style={{
																'background-color':
																	player.oracle.fateChoose == 2
																		? 'lightgreen'
																		: '',
																position: 'relative',
																border: '1px solid lightgreen',
															}}
														>
															时之命({player.oracle.fateBought[1]})
															<br />
															{formatWhole(Oracle.fateCost(1))}
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 2 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: lightgreen"
																	>
																		Time
																		<br />
																		Base: Proof Power x 1.5
																		<br />
																		Tot: x
																		{format(
																			Oracle.getFateTotalEffect(
																				2,
																			),
																		)}
																	</div>
																</>
															) : (
																<></>
															)}
														</button>
													</td>
												</tr>
												<tr style="height: 100px">
													<td>
														<button
															class="fate-choose"
															onClick={() =>
																(player.oracle.fateChoose = 3)
															}
															style={{
																'background-color':
																	player.oracle.fateChoose == 3
																		? 'cyan'
																		: '',
																position: 'relative',
																border: '1px solid cyan',
															}}
														>
															生之命({player.oracle.fateBought[2]})
															<br />
															{formatWhole(Oracle.fateCost(2))}
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 3 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: cyan"
																	>
																		Life
																		<br />
																		Base: Idea & Entropy x+ 1.5
																		<br />
																		Tot: x
																		{format(
																			Oracle.getFateTotalEffect(
																				3,
																			),
																		)}
																	</div>
																</>
															) : (
																<></>
															)}
														</button>
													</td>
												</tr>
												<tr style="height: 100px">
													<td>
														<button
															class="fate-choose"
															onClick={() =>
																(player.oracle.fateChoose = 4)
															}
															style={{
																'background-color':
																	player.oracle.fateChoose == 4
																		? 'red'
																		: '',
																position: 'relative',
																border: '1px solid red',
															}}
														>
															死之命({player.oracle.fateBought[3]})
															<br />
															{formatWhole(Oracle.fateCost(3))}
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 4 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: red"
																	>
																		Death
																		<br />
																		Base: Garden Local Speed x+
																		1.5
																		<br />
																		Tot: x
																		{format(
																			Oracle.getFateTotalEffect(
																				4,
																			),
																		)}
																	</div>
																</>
															) : (
																<></>
															)}
														</button>
													</td>
												</tr>
												<tr style="height: 100px">
													<td>
														<button
															class="fate-choose"
															onClick={() =>
																(player.oracle.fateChoose = 5)
															}
															style={{
																'background-color':
																	player.oracle.fateChoose == 5
																		? 'blue'
																		: '',
																position: 'relative',
																border: '1px solid blue',
															}}
														>
															理之命({player.oracle.fateBought[4]})
															<br />
															{formatWhole(Oracle.fateCost(4))}
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 5 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: blue"
																	>
																		Justice
																		<br />
																		Raise the sorrunding other
																		fate x 1.8
																		<br />
																	</div>
																</>
															) : (
																<></>
															)}
														</button>
													</td>
												</tr>
											</tbody>
										</table>
									</td>
									<td>{s.value}</td>
								</tr>
							</tbody>
						</table>
						<h3>Vow points: {formatWhole(player.oracle.vowPoints)}/{formatWhole(player.oracle.vowCoe)}</h3>
						<br />
						GardenGenerator Progress
						{(player.oracle.gardenGenTimeProgress * 100).toFixed(2)}%<br />
						Proof-Theory Reset Progress
						{(player.oracle.ptResetTimeProgress * 100).toFixed(2)}%
						<br />
						<button class="clickable_button" onClick={() => Oracle.respec()}>
							Respec
						</button>
					</div>
					{player.pt.totalPower.lt('1e9') && '下一个机制将在1e9证明论能量解锁'}
					{/* <br />
					<div
						style={{
							marginLeft: '50px',
							marginRight: '50px',
						}}
					>
						<ProgressBar
							progress={player.hydra.compressedPower
								.clampMin(10)
								.slog(10)
								.div(DC.D_2T1024_SLOG)
								.mul(100)
								.toNumber()}
						/>
					</div> */}
				</div>
			</>
		);
	},
});
