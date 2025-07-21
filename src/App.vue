<script setup lang="ts">
import {
	format,
	formatWhole,
	formatGain,
	formatLaTeX,
	formatLaTeXWhole,
	notations,
	notationNamesMap,
} from '@/utils/format';
import { player, feature } from './core/global.ts';
import { UPGRADES, BUYABLES, SOFTCAPS, buyables } from './core/mechanic.ts';

import Side from './components/Side.vue';
import NewsTicker from './components/Newsticker.vue';
import TDChallenge from './components/TDChallenge.vue';
import Successor from './components/tabs/Successor.vue';
import Settings from './components/tabs/Settings.vue';
import Addition from './components/tabs/Addition.vue';
import Multip from './components/tabs/Multip.vue';
import PF from './components/tabs/PF.vue';
import NumberTheory from './components/tabs/NumberTheory.vue';
import Stat from './components/tabs/Stat.vue';
import MultipChals from './components/tabs/MultipChals.vue';

import AdditionResetButton from './components/AdditionResetButton.vue';
import MultipResetButton from './components/MultipResetButton.vue';
import {predictableRandom} from './utils/algorithm.ts';
</script>

<template>
	<Side />
	<div class="content">
		<div class="news" v-if="player.options.ui.newsbar">
			<div class="background">
				<NewsTicker />
			</div>
		</div>
		<div class="resources" style="font-size: 20px">
			<div class="background">
				<div
					style="
						position: absolute;
						display: inline-block;
						margin-left: 15px;
						margin-top: 5px;
					"
				>
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
							v-html="
								formatGain(player.number, feature.resourceGain.number().value, '')
							"
						></span>
						<br />
						<span
							v-if="
								SOFTCAPS.reach('number^1', player.number) &&
								!SOFTCAPS.reach('number^2', player.number)
							"
							>(受软上限限制)</span
						>
						<span v-if="SOFTCAPS.reach('number^2', player.number)"
							>(受二重软上限限制)</span
						>
					</div>
				</div>
				<div
					style="position: absolute; margin-left: 265px; margin-top: 5px"
					id="showMP"
					v-if="player.upgrades[13]"
				>
					<div style="font-weight: bold; color: #009dd9">
						加法能量&nbsp;
						<div style="display: inline; text-shadow: #5acaff 1px 1px 2px">
							{{ formatWhole(player.addpower) }}
						</div>
					</div>
					<div style="font-size: 17px; color: #5acaff">
						<span v-if="!player.upgrades[38]">
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
						<span v-if="SOFTCAPS.reach('addpower^1', player.addpower)"
							>(受软上限限制)</span
						>
					</div>
				</div>
				<div
					style="position: absolute; margin-left: 515px; margin-top: 5px"
					v-if="player.upgrades[26]"
				>
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
			</div>
		</div>
		<div class="main-content">
			<div class="background">
				<AdditionResetButton />
				<MultipResetButton />
				<Successor v-if="player.currentTab === 0" />
				<Settings v-if="player.currentTab === 1" />
				<Addition v-if="player.currentTab === 2" />
				<Multip v-if="player.currentTab === 4" />
				<PF v-if="player.currentTab === 5" />
				<NumberTheory v-if="player.currentTab === 6" />
				<Stat v-if="player.currentTab === 7" />
				<MultipChals v-if="player.currentTab === 8" />
				<div class="main" v-if="player.currentTab === 3">
					<h1>大数之路重制版</h1>
					版本: v0.1.1<br />
					制作组名单(排名不分先后)：<br />
					静火Ω<br />
					VeryrrDefine<br />
					010000000a7<br />
					Seanxlx<br />
					EdenGameMaster<br />
					6左爷6<br />
				</div>
			</div>
		</div>
	</div>
</template>

<style>
tr {
	height: 180px;
}
</style>
