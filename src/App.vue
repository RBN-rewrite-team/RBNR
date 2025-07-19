<script setup lang="ts">
import { computed } from "vue";
import Decimal from 'break_eternity.js';
import { format, formatWhole, formatGain, formatLaTeX, formatLaTeXWhole, notations, notationNamesMap } from '@/utils/format';
import { themes, themeDetailsMap } from '@/utils/themes';
import { player, feature, getNumberGen } from './core/global.ts';
import { UPGRADES, BUYABLES } from './core/mechanic.ts';

import Side from './components/Side.vue';
import NewsTicker from './components/Newsticker.vue';
import { save } from './core/save/index.ts';
import { UIHardReset } from './core/save/saveui.ts';
import TDUpgrade from './components/TDUpgrade.vue';
import TDBuyable from './components/TDBuyable.vue';
import {NUMTHEORY} from './core/multiplication/numbertheory.ts';
import {eulerFunction} from './utils/algorithm.ts';

const validNotations = computed(() => 
  Object.values(notations).filter(v => typeof v === 'number')
);

const validThemes = computed(() =>
	Object.values(themes).filter(v => typeof v == 'number')
);
</script>

<template>
	<Side />
	<div class="content">
		<div class="news">
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
						数值&nbsp;{{ formatWhole(player.number) }}
					</div>
					<div
						style="font-size: 17px; color: var(--title-color)"
						v-if="feature.SUCCESSOR.autoSuccessPerSecond().eq(0)"
					>
						(需要通过后继获得)
					</div>
					<div
						style="font-size: 17px; color: var(--title-color)"
						v-html="formatGain(player.number, getNumberGen(), '')"
						v-else
					/>
				</div>
				<div
					style="position: absolute; margin-left: 215px; margin-top: 5px"
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
						(+{{ formatWhole(feature.ADDITION.gain()) }}) (!{{
							formatWhole(player.totalAddpower)
						}})
					</div>
				</div>
				<div
					style="position: absolute; margin-left: 415px; margin-top: 5px"
					v-if="player.upgrades[26]"
				>
					<div style="font-weight: bold; color: #cc33ff">
						乘法能量&nbsp;
						<div style="display: inline; text-shadow: #dd77dd 1px 1px 2px">
							{{ formatWhole(player.multiplication.mulpower) }}
						</div>
					</div>
					<div style="font-size: 17px; color: #dd77dd">
						(+{{ formatWhole(feature.MULTIPLICATION.gain()) }}) (!{{
							formatWhole(player.multiplication.totalMulpower)
						}})
					</div>
				</div>
			</div>
		</div>
		<div class="main-content">
			<div class="background">
				<div class="main" v-if="player.currentTab === 0">
					<div class="clickable">
						<div
							class="clickable_button"
							@mousedown="feature.SUCCESSOR.success()"
							v-if="!player.upgrades['25']"
						>
							后继x{{ formatWhole(feature.SUCCESSOR.successorBulk())
							}}<span v-if="BUYABLES.lock('11').unlocked"
								>(自动{{
									formatWhole(feature.SUCCESSOR.autoSuccessPerSecond())
								}}/s)</span
							>
						</div>
						<div
							class="clickable_button"
							@mousedown="feature.SUCCESSOR.success()"
							v-else
						>
							加法+{{ formatWhole(feature.SUCCESSOR.successorBulk())
							}}<span v-if="BUYABLES.lock('11').unlocked"
								>(自动{{
									formatWhole(feature.SUCCESSOR.autoSuccessPerSecond())
								}}/s)</span
							>
						</div>
					</div>
					<table align="center">
						<TDUpgrade upgid="11" />
						<TDUpgrade upgid="12" />
						<TDUpgrade upgid="13" />
						<TDBuyable bylid="11" />
					</table>
				</div>
				<div class="main" v-if="player.currentTab === 1" style="text-align: center">
				  <h3>存档设置</h3>
					<div class="setting_button" @click="save()">手动保存</div>
					<div class="hard_reset" @click="UIHardReset">硬重置</div>
					<br><div class="center_line" />
					<h3>记数法</h3>
					<button @click="player.options.notation = notation" v-for="notation in validNotations" class="setting_button" >
					  {{ notationNamesMap.get(notation) }}
					</button>
					<br><div class="center_line" />
					<h3>主题</h3>
					<button v-for="theme in validThemes" class="setting_button" @click="player.options.ui.theme = theme">
						{{ themeDetailsMap.get(theme)?.name ?? "unknown" }}
            {{theme}}
					</button>
				</div>
				<div class="main" v-if="player.currentTab === 2">
					<button class="reset1" @click="feature.ADDITION.UIreset">
						<!-- prettier-ignore !-->
						<svg
							style="margin-top: 5px"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
						>
							<!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
							<path
								fill="rgb(90, 202, 255)"
								d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"
							/>
						</svg>
					</button>
					<div style="transform: translateY(60px)">
						<table align="center">
							<tbody>
								<tr>
									<TDUpgrade upgid="21" />
									<TDUpgrade upgid="22" />
									<TDUpgrade upgid="23" />
									<TDUpgrade upgid="24" />
								</tr>
                <tr>
									<TDBuyable bylid="21" />
									<TDUpgrade upgid="25" />
									<TDUpgrade upgid="26" />
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="main" v-if="player.currentTab == 4">
					<button class="reset1" @click="feature.MULTIPLICATION.UIreset">
						<!-- prettier-ignore !-->
						<svg
							style="margin-top: 5px"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
						>
							<!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
							<path
								fill="rgb(204, 51, 255)"
								d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"
							/>
						</svg>
					</button>
					<div style="transform: translateY(60px)">
						<div align="center" v-if="player.firstResetBit & 0b10">
							累计乘法能量提供了<span style="color: #cc33ff; font-weight: bold"
								>x{{ feature.MULTIPLICATION.powerEff() }}</span
							>数值增益
						</div>
						<table align="center">
							<tbody>
								<tr>
									<TDUpgrade upgid="31" />
									<TDUpgrade upgid="32" />
									<TDUpgrade upgid="33" />
									<TDUpgrade upgid="34" />
								</tr>
								<tr>
									<TDUpgrade upgid="35" />
									<TDUpgrade upgid="36" />
									<TDUpgrade upgid="37" />
								</tr>
                <tr>
                  <TDBuyable bylid="31" />
                  <TDBuyable bylid="32" />
                </tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="main" v-if="player.currentTab == 5">
					<button class="reset1" @click="feature.MULTIPLICATION.UIreset">
						<!-- prettier-ignore !-->
						<svg
							style="margin-top: 5px"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
						>
							<!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
							<path
								fill="rgb(204, 51, 255)"
								d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"
							/>
						</svg>
					</button>
					<div style="transform: translateY(60px)">
						<div align="center">
							你有<span style="color: #cc33ff; font-weight: bold"
								>x{{ formatWhole(feature.PrimeFactor.power()) }}</span
							>因数能量 <br />基于本次乘法重置耗时提供<span
								style="color: #cc33ff; font-weight: bold"
								>x{{ format(feature.PrimeFactor.powerEff()) }}</span
							>数值和加法能量增益
						</div>
						<table align="center">
							<tbody>
								<tr>
									<TDBuyable bylid="pf2" />
									<TDBuyable bylid="pf3" />
									<TDBuyable bylid="pf5" />
									<TDBuyable bylid="pf7" />
								</tr>
								<tr>
									<TDBuyable bylid="pf11" />
									<TDBuyable bylid="pf13" />
									<TDBuyable bylid="pf17" />
									<TDBuyable bylid="pf19" />
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="main" v-if="player.currentTab == 6">
					<button class="reset1" @click="feature.MULTIPLICATION.UIreset">
						<!-- prettier-ignore !-->
						<svg
							style="margin-top: 5px"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
						>
							<!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
							<path
								fill="rgb(204, 51, 255)"
								d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"
							/>
						</svg>
					</button>
					<div style="transform: translateY(60px)">
						<div align="center">
              <h1>数论研究</h1>
              <h2>研究 1： 欧拉函数</h2>
              <vue-latex expression="\varphi(n) = n \prod_{p | n} \left(1 - \frac{1}{p}\right)" display-mode />
              <vue-latex expression="S(x) = \sum_{k = 1}^{x} \varphi(k)" display-mode />
              <vue-latex :expression="'\\tau_1 =S(x)=' + formatLaTeXWhole(NUMTHEORY.funcS())" display-mode />
              <vue-latex :expression="'x = ' + formatLaTeXWhole(player.numbertheory.euler.x.floor())" display-mode />					
              <p style="font-size: 120%"><b>研究1加成：加法效果×<vue-latex expression="\tau_1" /></b></p>
            </div>
          <table align="center">
            <tbody>
              <tr>
                <TDBuyable bylid="31R" />
                <TDBuyable bylid="32R" />
                <TDUpgrade upgid="31R" />
              </tr>
            </tbody>
          </table>
					</div>
				</div>
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
