import Baixie from '@/components/group-2/Baixie.vue';
import { Oracle } from '@/core/pt/oracle/oracle.ts';
import { player } from '@/core/save/index.ts';
import { defineComponent } from 'vue';
import { format, formatWhole } from '@/utils/format.ts';
import { useUpdate } from '@/lib/useUpdate.ts';
import { DC } from '@/core/constants';
import ProgressBar from '@/components/group-2/ProgressBar';
import { useI18n } from 'vue-i18n';
import Decimal from 'break_eternity.js';

export default defineComponent({
	name: 'Oracle',

	setup(props, ctx) {
		const $t = useI18n().t;
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
										{$t(
											`oracle.fate.type.${player.oracle.fate[i][j] - 1}.slot`,
										)}
										<br />
										{(player.oracle.fateEffect[i][j] * 100).toFixed(3)}%<br />×
										{Oracle.getFateEffectRate(i, j) >= 1e5
											? Oracle.getFateEffectRate(i, j).toExponential(1)
											: Oracle.getFateEffectRate(i, j).toFixed(3)}
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
					<div style="width: calc(100% - 80px); height: 900px; padding: 5px; border: 1px solid rgb(127, 63, 0); color: rgb(127, 63, 0); margin: auto; overflow: auto">
						<h2>{$t('oracle.fate')}</h2>
						<br />
						{$t('oracle.fate.desc')}
						<br />
						{player.pt.totalPower.gte(1e30) ? (
							<>
								<span style="color: cyan; font-weight: bold;">
									{$t('oracle.fate.effect.1', {
										effect: format(Oracle.ptPowerEffectToFateEffect()),
									})}
								</span>
							</>
						) : (
							<></>
						)}
						<br />
						<span style="color: rgb(255, 127, 0); font-weight: bold;">
							{$t('oracle.fate.effect.2', {
								effect: format(
									player.oracle.totalBits.sub(87).max(0).root(2).mul(100),
								),
							})}
						</span>
						<br />
						{player.pt.totalPower.gte('e5e6') ? (
							<>
								<span style="color: cyan; font-weight: bold;">
									{$t('oracle.fate.effect.3')}
								</span>
							</>
						) : (
							<></>
						)}
						<br />
						{player.pt.totalPower.gte('ee10') ? (
							<>
								<span style="color: cyan; font-weight: bold;">
									{$t('oracle.fate.effect.4')}
								</span>
							</>
						) : (
							<></>
						)}
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
															{$t('oracle.fate.type.0')}(
															{player.oracle.fateBought[0]})
															<br />
															{formatWhole(Oracle.fateCost(0))}&nbsp;
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 1 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: silver"
																	>
																		{$t(
																			'oracle.fate.type.0.title',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.0.effect',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.tot',
																			{
																				effect: `+${format(
																					Oracle.getFateTotalEffect(
																						1,
																					),
																				)}`,
																			},
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
															{$t('oracle.fate.type.1')}(
															{player.oracle.fateBought[1]})
															<br />
															{formatWhole(Oracle.fateCost(1))}&nbsp;
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 2 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: lightgreen"
																	>
																		{$t(
																			'oracle.fate.type.1.title',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.1.effect',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.tot',
																			{
																				effect: `×${format(
																					Oracle.getFateTotalEffect(
																						2,
																					),
																				)}`,
																			},
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
															{$t('oracle.fate.type.2')}(
															{player.oracle.fateBought[2]})
															<br />
															{formatWhole(Oracle.fateCost(2))}&nbsp;
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 3 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: cyan"
																	>
																		{$t(
																			'oracle.fate.type.2.title',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.2.effect',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.tot',
																			{
																				effect: `×+${format(
																					Oracle.getFateTotalEffect(
																						3,
																					),
																				)}`,
																			},
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
															{$t('oracle.fate.type.3')}(
															{player.oracle.fateBought[3]})
															<br />
															{formatWhole(Oracle.fateCost(3))}&nbsp;
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 4 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: red"
																	>
																		{$t(
																			'oracle.fate.type.3.title',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.3.effect',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.tot',
																			{
																				effect: `×+${format(
																					Oracle.getFateTotalEffect(
																						4,
																					),
																				)}`,
																			},
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
															{$t('oracle.fate.type.4')}(
															{player.oracle.fateBought[4]})
															<br />
															{formatWhole(Oracle.fateCost(4))}&nbsp;
															{$t('oracle.bit')}
															{player.oracle.fateChoose == 5 ? (
																<>
																	<div
																		class="fate-tooltip"
																		style="border-color: blue"
																	>
																		{$t(
																			'oracle.fate.type.4.title',
																		)}
																		<br />
																		{$t(
																			'oracle.fate.type.4.effect',
																		)}
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
						<h3>
							{$t('oracle.fate.vow')}
							{formatWhole(player.oracle.vowPoints)}/
							{formatWhole(player.oracle.vowCoe)}
						</h3>
						<br />
						{$t('oracle.fate.vow.p.0')}
						{(player.oracle.gardenGenTimeProgress * 100).toFixed(2)}%<br />
						{$t('oracle.fate.vow.p.1')}
						{(player.oracle.ptResetTimeProgress * 100).toFixed(2)}%
						<br />
						<button
							class="clickable_button"
							onClick={() => Oracle.respec()}
							style={{ textAlign: 'center', margin: 'auto' }}
						>
							{$t('oracle.fate.vow.respec')}
						</button>
					</div>
					{player.pt.totalPower.lt('1e9') && $t('oracle.fate.tip')}
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
