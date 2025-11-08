<script setup lang="ts">
import { player, feature } from '@/core/global';
import { format, formatTime } from '../../../utils/format.ts';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;
function timeF(ms = 0) {
	const s = new Date(ms);
	return s.toLocaleString();
}
function openHard() {
	if (!player.options.hardMode) {
		player.options.hardMode = true;
		player.timeshard.value = player.timeshard.value.add(1000);
	}
}
function unlAuto() {
	if (player.timeshard.value.gte(1000) && !player.timeshard.unlAuto) {
		player.timeshard.unlAuto = true;
		player.timeshard.value = player.timeshard.value.sub(1000);
	}
}
function t() {
	return $t('timeshard.t', {
		amount: `<span style="color: rgb(255, 63, 255)">${format(player.timeshard.value)}</span>`,
	});
}
function t2() {
	return $t('timeshard.t2', {
		amount: `<span style="color: rgb(127, 31, 128)">${formatTime(player.timeshard.tf.div(1000))}</span>`,
	});
}
</script>

<template>
	<div class="main">
		<div align="center">
			<span v-html="t()"></span><br />
			<span v-if="player.timeshard.tf.gt(0)">
				<span v-html="t2()"></span><br />
				<button
					class="setting_button"
					@click="player.timeshard.openTf = !player.timeshard.openTf"
				>
					{{ $t(player.timeshard.openTf ? 'set.status.on' : 'set.status.off') }}
				</button>
			</span>
			<br />
			<button class="setting_button" @click="openHard">
				{{ $t('timeshard.u1')
				}}{{ $t(player.options.hardMode ? 'set.status.locked' : 'set.status.unlocked')
				}}<br />
				WIP
			</button>
			<br />
			<button
				class="setting_button"
				@click="unlAuto"
				v-if="(player.firstResetBit & 0b10000) == 0b10000"
			>
				花费1000时间碎片，解锁自动机
			</button>
			<!-- <div v-if="player.timeshard.unlAuto">
				<h2>自动机商店</h2>
				<p>花费</p>
			</div> -->
			<table>
				<tbody>
					<tr>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.generatorReceive(0)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.gen', { tier: 'I' }) }}
									</h3>
									<br />
									<span v-html="$t('timeshard.gen.1')"></span><br />
									<span
										v-if="Date.now() >= player.timeshard.cd[0]"
										style="color: green; font-weight: bold"
										>{{ $t('timeshard.gen.avaliable') }}</span
									>
									<span v-else style="color: orange; font-weight: bold"
										>{{ $t('timeshard.gen.waituntil') }}<br />{{
											timeF(player.timeshard.cd[0])
										}}</span
									>
								</button>
							</div>
						</td>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.generatorReceive(1)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.gen', { tier: 'II' }) }}
									</h3>
									<br />
									<span v-html="$t('timeshard.gen.2')"></span><br />
									<span
										v-if="Date.now() >= player.timeshard.cd[1]"
										style="color: green; font-weight: bold"
										>冷却完毕</span
									>
									<span v-else style="color: orange; font-weight: bold"
										>请等待至<br />{{ timeF(player.timeshard.cd[1]) }}</span
									>
								</button>
							</div>
						</td>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.generatorReceive(2)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.gen', { tier: 'III' }) }}
									</h3>
									<br />
									<span v-html="$t('timeshard.gen.3')"></span><br />
									<span
										v-if="Date.now() >= player.timeshard.cd[2]"
										style="color: green; font-weight: bold"
										>冷却完毕</span
									>
									<span v-else style="color: orange; font-weight: bold"
										>请等待至<br />{{ timeF(player.timeshard.cd[2]) }}</span
									>
								</button>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.convert(1)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.conv', { tier: 'I' }) }}
									</h3>
									<br />
									{{
										$t('timeshard.conv.desc', {
											amount: '1',
										})
									}}
								</button>
							</div>
						</td>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.convert(10)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.conv', { tier: 'II' }) }}
									</h3>
									<br />
									{{
										$t('timeshard.conv.desc', {
											amount: '10',
										})
									}}
								</button>
							</div>
						</td>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.convert(100, 1.25)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.conv', { tier: 'III' }) }}
									</h3>
									<br />
									{{
										$t('timeshard.conv.desc', {
											amount: '100',
										})
									}}<br />
									{{
										$t('timeshard.conv.desc2', {
											amount: '25',
										})
									}}
								</button>
							</div>
						</td>
					</tr>
					<tr>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.convert(1000, 1.5)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.conv', { tier: 'IV' }) }}
									</h3>
									<br />
									{{
										$t('timeshard.conv.desc', {
											amount: '1000',
										})
									}}<br />
									{{
										$t('timeshard.conv.desc2', {
											amount: '50',
										})
									}}
								</button>
							</div>
						</td>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.convert(10_000, 1.75)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.conv', { tier: 'V' }) }}
									</h3>
									<br />
									{{
										$t('timeshard.conv.desc', {
											amount: '10,000',
										})
									}}<br />
									{{
										$t('timeshard.conv.desc2', {
											amount: '50',
										})
									}}
								</button>
							</div>
						</td>
						<td>
							<div class="upgrade">
								<button
									class="upgrade_buttonbig"
									style="color: var(--color)"
									@click="feature.TimeShard.convert(100_000, 2)"
								>
									<h3 style="color: rgb(255, 63, 255)">
										{{ $t('timeshard.conv', { tier: 'VI' }) }}
									</h3>
									<br />
									{{
										$t('timeshard.conv.desc', {
											amount: '100,000',
										})
									}}<br />
									{{
										$t('timeshard.conv.desc2', {
											amount: '100',
										})
									}}
								</button>
							</div>
						</td>
					</tr>
					<tr>
						<TDUpgrade upgid="ts01" />
						<TDUpgrade upgid="ts02" />
						<TDUpgrade upgid="ts03" />
					</tr>
					<tr>
						<TDUpgrade upgid="ts11" />
						<TDUpgrade upgid="ts12" />
						<TDUpgrade upgid="ts13" />
					</tr>
					<tr>
						<TDUpgrade upgid="ts21" />
						<TDUpgrade upgid="ts22" />
						<TDUpgrade upgid="ts23" />
					</tr>
					<tr>
						<TDUpgrade upgid="ts_auto_pkg_hydra" />
						<TDUpgrade upgid="ts_auto_pkg_nonrec" />
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
