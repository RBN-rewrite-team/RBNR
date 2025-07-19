<script setup lang="ts">
import { computed } from "vue";
import Decimal from 'break_eternity.js';
import { format, formatWhole, formatGain, formatLaTeX, formatLaTeXWhole, notations, notationNamesMap } from '@/utils/format';
import { themes, themeDetailsMap, reverseUiOptions } from '@/utils/themes';
import { player, feature } from './core/global.ts';
import { UPGRADES, BUYABLES } from './core/mechanic.ts';

import Side from './components/Side.vue';
import NewsTicker from './components/Newsticker.vue';
import { save, import_file, export_file } from './core/save/index.ts';
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
						<span v-if="feature.SUCCESSOR.autoSuccessPerSecond().eq(0)">(需要通过后继获得)</span>
						<span v-else v-html="formatGain(player.number, feature.resourceGain.number().value, '')"></span>
						<br>
						<span v-if="feature.resourceGain.number().softcap == 1">(受软上限限制)</span>
						<span v-if="feature.resourceGain.number().softcap == 2">(受二重软上限限制)</span>
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
					    {{ formatGain(player.addpower, feature.resourceGain.addpower().passive.mul(feature.resourceGain.addpower().value)) }}
						</span>
						(!{{
							formatWhole(player.totalAddpower)
						}})
						<br>
						<span v-if="feature.resourceGain.addpower().softcap == 1">(受软上限限制)</span>
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
					<div class="setting_button" @click="import_file()">导入存档</div>
					<div class="setting_button" @click="export_file()">导出存档</div>
					<div class="hard_reset" @click="UIHardReset">硬重置</div>
					<br><div class="center_line" />
					<h3>记数法</h3>
					<button @click="player.options.notation = notation" v-for="notation in validNotations" class="setting_button" >
					  {{ notationNamesMap.get(notation) }}
					</button>
					<br><div class="center_line" />
					<h3>主题</h3>
					<button class="setting_button" @click="reverseUiOptions('color_inversion')">
						颜色{{ player.options.ui.otherwise['color_inversion'] ? '反转' : '正常' }}
					</button>
					<button class="setting_button" @click="reverseUiOptions('full_gray')">
						{{ player.options.ui.otherwise['full_gray'] ? '全灰度' : '正常颜色' }}
					</button>
					<button class="setting_button" @click="reverseUiOptions('blur')">
						{{ player.options.ui.otherwise['blur'] ? '模糊' : '清晰' }}
					</button>
					<button class="setting_button" @click="reverseUiOptions('sepia')">
						{{ player.options.ui.otherwise['sepia'] ? '旧相片开启' : '旧相片关闭' }}
					</button>
					<br>
					<button v-for="theme in validThemes" class="setting_button" @click="player.options.ui.theme = theme">
						{{ themeDetailsMap.get(theme)?.name ?? "unknown" }} {{ theme }}
					</button>
					<h3>界面</h3>
					<button class="setting_button" @click="player.options.ui.newsbar = !player.options.ui.newsbar">
						{{ player.options.ui.newsbar ? '新闻栏开启' : '新闻栏关闭' }}
					</button>
					<button class="setting_button" @click="player.options.ui.titlebar = !player.options.ui.titlebar">
						{{ player.options.ui.titlebar ? '标题栏开启' : '标题栏关闭' }}
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
						<br>
            <div align="center" v-if="player.upgrades[31]" style="transform: translateY(65px);">
              你可以选择将U1-2, U1-3, U1-4, U1-5中的一个升级，将其的价格降为1，但会进行一次乘法重置。<br>
              <button @click="feature.ADDITION.setUPGc1(2)" class="clickable_button" style="display: inline-block;">2</button>
              <button @click="feature.ADDITION.setUPGc1(3)" class="clickable_button" style="display: inline-block;">3</button>
              <button @click="feature.ADDITION.setUPGc1(4)" class="clickable_button" style="display: inline-block;">4</button>
              <button @click="feature.ADDITION.setUPGc1(5)" class="clickable_button" style="display: inline-block;">5</button>
            </div>
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
								>x{{ format(feature.MULTIPLICATION.powerEff()) }}</span
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
									<TDUpgrade upgid="38" />
								</tr>
								<tr>
									<TDUpgrade upgid="39" />
									<TDBuyable bylid="31" />
									<TDBuyable bylid="32" />
									<TDBuyable bylid="33" />
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
        <div class="main" v-if="player.currentTab == 7">
          <p>你最高的数字是: {{format(player.stat.highestNumber)}}</p>
          <p>你最高的加法能量是: {{format(player.stat.hightestAddpower)}}</p>
          <p>你最高的乘法能量是: {{format(player.stat.highestMulpower)}}</p>
          <p>你产生了 {{format(player.stat.totalNumber)}} 数字</p>
          <p>你产生了 {{format(player.stat.totalAddpower)}} 加法能量</p>
          <p>你产生了 {{format(player.stat.totalMulpower)}} 乘法能量</p>
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
