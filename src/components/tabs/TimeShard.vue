<script setup lang="ts">
import { player, feature } from '@/core/global';
function timeF(ms = 0) {
	const s = new Date(ms);
	return s.toLocaleString();
}
</script>

<template>
	<div class="main">
		<div align="center">
			你有
			<span style="color: rgb(255, 63, 255)">{{ player.timeshard.value }}</span>
			时间碎片，它没有直接效果<br />
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
									产量：30~150<br />
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
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
