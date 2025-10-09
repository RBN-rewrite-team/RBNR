<script setup lang="ts">
import { player, feature } from '@/core/global';
import { format, formatTime } from '../../../utils/format.ts';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
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
</script>

<template>
	<div class="main">
		<div align="center">
			你有
			<span style="color: rgb(255, 63, 255)">{{ format(player.timeshard.value) }}</span>
			时间碎片，转换它以获得同等分钟的3x时间加速效果<br />
			<span v-if="player.timeshard.tf.gt(0)">
				你有
				<span style="color: rgb(127, 31, 127)">{{
					formatTime(player.timeshard.tf.div(1000))
				}}</span>
				的时间加速<br />
				<button
					class="setting_button"
					@click="player.timeshard.openTf = !player.timeshard.openTf"
				>
					启用：{{ player.timeshard.openTf ? '开' : '关' }}
				</button>
			</span>
			<br />
			<button class="setting_button" @click="openHard">
				获得1000时间碎片，但进入困难模式。{{
					player.options.hardMode ? '(已锁定)' : '(未开启)'
				}}<br />
				困难模式没做完。
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
									<h3 style="color: rgb(255, 63, 255)">碎片生成器 I</h3>
									<br />
									冷却时间：1小时<br />
									产量：10~50<br />
									<span
										v-if="Date.now() >= player.timeshard.cd[0]"
										style="color: green; font-weight: bold"
										>冷却完毕</span
									>
									<span v-else style="color: orange; font-weight: bold"
										>请等待至<br />{{ timeF(player.timeshard.cd[0]) }}</span
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
									<h3 style="color: rgb(255, 63, 255)">碎片生成器 II</h3>
									<br />
									冷却时间：24小时<br />
									产量：80~400<br />
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
									<h3 style="color: rgb(255, 63, 255)">碎片生成器 III</h3>
									<br />
									冷却时间：7天<br />
									产量：1000~5000<br />
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
									<h3 style="color: rgb(255, 63, 255)">碎片转换器 I</h3>
									<br />
									转换1个时间碎片
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
									<h3 style="color: rgb(255, 63, 255)">碎片转换器 II</h3>
									<br />
									转换10个时间碎片
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
									<h3 style="color: rgb(255, 63, 255)">碎片转换器 III</h3>
									<br />
									转换100个时间碎片<br />
									可以额外获得25%时间
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
									<h3 style="color: rgb(255, 63, 255)">碎片转换器 IV</h3>
									<br />
									转换1000个时间碎片<br />
									可以额外获得50%时间
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
									<h3 style="color: rgb(255, 63, 255)">碎片转换器 V</h3>
									<br />
									转换10,000个时间碎片<br />
									可以额外获得75%时间
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
									<h3 style="color: rgb(255, 63, 255)">碎片转换器 VI</h3>
									<br />
									转换100,000个时间碎片<br />
									可以额外获得100%时间
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
				</tbody>
			</table>
		</div>
	</div>
</template>
