<script setup lang="ts">
import { Logarithm } from '@/core/exponention/logarithm';
import TDBuyable from '../../group-2/TDBuyable.vue';
import { format, formatGain, formatTime } from '@/utils/format';
import { player } from '@/core/save';
import ObserveButton from '../../group-2/ObserveButton.vue';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;
function datas() {
	return `<p>
			${$t('exp.log.obsd', {
				amount: `<b style="color: rgb(127, 127, 255); font-size: 25px">
				${format(Logarithm.logarithm.observe_datas)}
			</b>`,
			})}
		</p>
		<p>
			${$t('exp.log.cald', {
				amount: `<b style="color: rgb(127, 127, 255); font-size: 25px">
				${format(Logarithm.logarithm.calculate_datas)}
			</b>`,
			})}
		</p>`;
}
</script>

<template>
	<div class="main">
		<p style="color: grey; table-align: center">
			{{ $t('exp.log.pre') }}
		</p>
		<div v-html="datas()"></div>
		<div>
			<p v-for="astr in Object.entries(player.exponention.logarithm.astronomers)">
				{{ $t('plot.astronaut') }} {{ astr[0] }}: {{ formatTime(astr[1].life) }}
				{{
					formatGain(
						Logarithm.logarithm.calculate_datas,
						Logarithm.astronomerProduce(Number(astr[0])),
					)
				}}
			</p>
		</div>
		<p>
			{{
				$t('exp.log.conv', {
					res: format(Logarithm.observeDataConvert()),
				})
			}}
		</p>
		<table align="center">
			<tbody>
				<tr>
					<TDBuyable bylid="lgr_emp" />
					<TDBuyable bylid="lgr_impr" />
				</tr>
			</tbody>
		</table>
		<div align="center" style="margin-top: 100px">
			<div @click="Logarithm.observe">
				<ObserveButton>{{ $t('exp.log.observe') }}</ObserveButton>
			</div>
			<div @click="Logarithm.observeConvert">
				<ObserveButton style="font-size: 15px">{{ $t('exp.log.calc') }}</ObserveButton>
			</div>
		</div>
		<div class="phys_law">
			<p>{{ $t('exp.log.tip') }}</p>
			<h1>{{ $t('exp.log.law.1') }}</h1>
			{{ $t('exp.log.law.1.desc') }}
			<div class="requirement">
				{{
					$t('exp.log.law.req', {
						amount: 5000,
					})
				}}
			</div>
			<div class="effect">
				{{ $t('exp.log.law.1.eff') }}
			</div>
			<h1>{{ $t('exp.log.law.2') }}</h1>
			{{ $t('exp.log.law.2.desc') }}
			<div class="requirement">
				{{
					$t('exp.log.law.req', {
						amount: 40000,
					})
				}}
			</div>
			<div class="effect">{{ $t('exp.log.law.2.eff') }}</div>

			<h1>{{ $t('exp.log.law.3') }}</h1>
			{{ $t('exp.log.law.3.desc') }}
			<div class="requirement">
				{{
					$t('exp.log.law.req', {
						amount: 3000000,
					})
				}}
			</div>
			<div class="effect">{{ $t('exp.log.law.3.eff') }}</div>

			<div v-if="player.singularity.stage < 1">
				<h1>{{ player.milestones.log_G ? $t('exp.log.law.g') : '??????' }}</h1>
				{{ player.milestones.log_G ? $t('exp.log.law.yg') : '?????' }}
				<div class="requirement">
					{{
						$t('exp.log.law.req', {
							amount: 5000000,
						})
					}}
				</div>
				<div class="effect">{{ $t('exp.log.law.g.eff') }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.phys_law {
	border: 2px solid blue;
	border-radius: 36px;
	width: 500px;
	height: fit-content;
	padding-left: 70px;
	padding-top: 30px;
	padding-bottom: 30px;
	padding-right: 70px;
	margin: auto;
	margin-bottom: 100px;
}
.requirement {
	margin: auto;
	width: fit-content;
	border: 2px solid rgb(0, 119, 255);
	border-radius: 4px;
	padding: 5px;
}
.effect {
	margin: auto;
	max-width: 80%;
	border: 2px solid rgb(0, 255, 115);
	border-radius: 4px;
	padding: 5px;
}
</style>
