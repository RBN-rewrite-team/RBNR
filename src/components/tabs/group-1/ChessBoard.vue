<script lang="ts" setup>
import { format, formatWhole } from '@/utils/format';
import { feature, player } from '@/core/global';
import TDBuyable from '../../group-2/TDBuyable.vue';
import TRMilestone from '../../group-2/TRMilestone.vue';

import type { $t } from '@/utils/types';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;

function t() {
	return $t('exp.cb.eff', {
		a: `<b style="color: rgb(127, 127, 255); font-size: 25px">${formatWhole(
			feature.ChessBoard.wheatGrain().round(),
		)}</b>`,
		b: `<b style="color: rgb(127, 127, 255)">${format(feature.ChessBoard.wgEffect()[0])}</b
		>`,
		c: `<b style="color: rgb(127, 127, 255)">${format(feature.ChessBoard.wgEffect()[3])}</b
		>`,
		d: `<b style="color: rgb(127, 127, 255)">${format(feature.ChessBoard.wgEffect()[1])}</b
		>`,
		e: `<b style="color: rgb(127, 127, 255)">${format(feature.ChessBoard.wgEffect()[2])}</b
		>`,
		f: `<b style="color: rgb(127, 127, 255)">${format(feature.ChessBoard.wgEffect()[4])}`,
	});
}
</script>

<template>
	<div class="main">
		<p style="color: grey; table-align: center">
			{{ $t('exp.cb.pre') }}
		</p>
		<p v-html="t()"></p>
		<p align="center">
			{{
				$t('exp.cb.base', {
					base: format(feature.ChessBoard.base()),
				})
			}}
		</p>
		<div align="center">
			<table>
				<tbody>
					<tr>
						<td>
							<div class="block">
								<b style="color: rgb(127, 127, 255); font-size: 20px"> 1 </b>
							</div>
						</td>
						<td v-if="feature.ChessBoard.maxBlocks().gte(2)">
							<div class="block">
								<b style="color: rgb(127, 127, 255); font-size: 20px">
									{{ formatWhole(feature.ChessBoard.base()) }}
								</b>
							</div>
						</td>
						<td v-if="feature.ChessBoard.maxBlocks().gte(3)">
							<div class="block">
								<b style="color: rgb(127, 127, 255); font-size: 20px">
									{{ formatWhole(feature.ChessBoard.base()) }}<sup>2</sup>
								</b>
							</div>
						</td>
						<td v-if="feature.ChessBoard.maxBlocks().gte(5)">
							<div style="width: 40px; text-align: center">
								<b style="color: rgb(127, 127, 255); font-size: 20px"> ... </b>
							</div>
						</td>
						<td v-if="feature.ChessBoard.maxBlocks().gte(4)">
							<div class="block">
								<b style="color: rgb(127, 127, 255); font-size: 20px">
									{{ formatWhole(feature.ChessBoard.base())
									}}<sup>{{
										formatWhole(feature.ChessBoard.maxBlocks().sub(1))
									}}</sup>
								</b>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<table>
				<tbody>
					<tr>
						<TDBuyable bylid="cb1" />
					</tr>
				</tbody>
			</table>
			<br /><br />
			<table style="margin: 50px">
				<tbody class="milestones">
					<TRMilestone id="cb1" />
					<TRMilestone id="cb2" />
					<TRMilestone id="cb3" />
					<TRMilestone id="cb4" />
					<TRMilestone id="cb5" v-if="player.singularity.stage < 2" />
					<TRMilestone id="cb6" />
					<TRMilestone id="cb7" />
					<TRMilestone id="cb8" />
					<TRMilestone id="cb9" v-if="player.singularity.stage < 2" />
					<TRMilestone id="cb10" v-if="player.singularity.stage < 2" />
					<TRMilestone id="cb11" />
					<TRMilestone id="cb12" v-if="player.singularity.stage < 2" />
					<TRMilestone id="cb13" v-if="player.singularity.stage < 2" />
					<TRMilestone id="cb14" />
					<TRMilestone id="cb15" v-if="player.singularity.stage < 2" />
					<TRMilestone id="cb16" />
					<TRMilestone id="cb17" v-if="player.singularity.stage < 2" />
					<TRMilestone id="cb18" v-if="player.singularity.stage < 2" />
					<TRMilestone id="cb19" />
					<TRMilestone id="cb20" />
					<TRMilestone id="cb21" />
					<TRMilestone id="cb22" />
					<TRMilestone id="cb23" />
				</tbody>
			</table>
		</div>
	</div>
</template>

<style scoped lang="scss">
.block {
	border: 2px solid #77f;
	width: 100px;
	height: 100px;
	justify-content: center;
	align-items: center;
	display: flex;
	margin: -1.7px;
}

table {
	border-collapse: collapse;
	border-spacing: 0px;
}
</style>
