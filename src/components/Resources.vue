<script setup lang="ts">
import { formatWhole, formatGain } from '@/utils/format';
import { player } from '@/core/save';
import { feature } from '@/core/global';
import { SOFTCAPS } from '@/core/mechanic';
import Decimal from 'break_eternity.js';
</script>
<template>
	<div class="resources" style="font-size: 20px">
		<div class="background">
			<div style="margin-left: 15px" class="resource">
				<div style="font-weight: bold; color: var(--suptitle-color)">
					数值&nbsp;
					{{ formatWhole(player.number) }}
				</div>
				<div style="font-size: 17px; color: var(--title-color)">
					<span v-if="feature.SUCCESSOR.autoSuccessPerSecond().eq(0)"
						>(需要通过后继获得)</span
					>
					<span
						v-else
						v-html="formatGain(player.number, feature.resourceGain.number().value, '')"
					></span>
					<br />
					<span v-if="feature.resourceGain.number().softcaps > 0">
						(受{{ feature.resourceGain.number().softcaps }}个软上限限制)
					</span>
				</div>
			</div>
			<div style="margin-left: 265px" class="resource" id="showMP" v-if="player.upgrades[13]">
				<div style="font-weight: bold; color: #009dd9">
					加法能量&nbsp;
					<div style="display: inline; text-shadow: #5acaff 1px 1px 2px">
						{{ formatWhole(player.addpower) }}
					</div>
				</div>
				<div style="font-size: 17px; color: #5acaff">
					<span v-if="feature.resourceGain.addpower().passive.eq(0)">
						(+{{ formatWhole(feature.resourceGain.addpower().value) }})
					</span>
					<span v-else>
						{{
							formatGain(
								player.addpower,
								feature.resourceGain
									.addpower()
									.passive.mul(feature.resourceGain.addpower().value),
							)
						}}
					</span>
					(!{{ formatWhole(player.totalAddpower) }})
					<br />
					<span v-if="feature.resourceGain.addpower().softcaps > 0">
						(受{{ feature.resourceGain.addpower().softcaps }}个软上限限制)
					</span>
				</div>
			</div>
			<div style="margin-left: 515px" class="resource" v-if="player.upgrades[26]">
				<div style="font-weight: bold; color: #cc33ff">
					乘法能量&nbsp;
					<div style="display: inline; text-shadow: #dd77dd 1px 1px 2px">
						{{ formatWhole(player.multiplication.mulpower) }}
					</div>
				</div>
				<div style="font-size: 17px; color: #dd77dd">
					(+{{ formatWhole(feature.resourceGain.mulpower().value) }}) (!{{
						formatWhole(player.multiplication.totalMulpower)
					}})
				</div>
			</div>
			<div
				style="margin-left: 755px"
				class="resource"
				v-if="player.stat.highestMulpower.gte(new Decimal(2).pow(1024))"
			>
				<div style="font-weight: bold; color: rgb(127, 127, 255)">
					指数能量&nbsp;
					<div style="display: inline; text-shadow: rgb(0, 20, 127) 1px 1px 2px">
						{{ formatWhole(player.exponention.exppower) }}
					</div>
				</div>
				<div style="font-size: 17px; color: rgb(63, 63, 127)">
					(+{{ formatWhole(feature.resourceGain.exppower().value) }}) (!{{
						formatWhole(player.exponention.totalExppower)
					}})
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.resource {
	position: absolute;
	margin-top: 5px;
}
.background {
	width: 100%;
	overflow: scroll;
}
* {
	white-space: nowrap;
}
</style>
