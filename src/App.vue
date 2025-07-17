<script setup lang="ts">
import Decimal from 'break_eternity.js';
import { format, formatWhole, formatGain } from '@/utils/format';
import { player, feature, getNumberGen } from './core/global.ts';
import { UPGRADES, BUYABLES } from './core/mechanic.ts';

import Side from './components/Side.vue';
import { save } from './core/save/index.ts';
import { UIHardReset } from './core/save/saveui.ts';
</script>

<template>
  <Side />
  <div class="content">
    <div class="news">
      <div class="background">
        <div style="font-size: 18px; margin: 12px 0px; overflow-y: hidden; height: 28px">
          新闻栏给你们做吧/bx
        </div>
      </div>
    </div>
    <div class="resources" style="font-size: 20px">
      <div class="background">
        <div style="position: absolute; display: inline-block; margin-left: 15px; margin-top: 5px">
          <div style="font-weight: bold; color: #4f4f4f">
            数值&nbsp;{{ formatWhole(player.number) }}
          </div>
          <div
            style="font-size: 17px; color: #8e8e8e"
            v-if="feature.SUCCESSOR.autoSuccessPerSecond().eq(0)"
          >
            (需要通过后继获得)
          </div>
          <div
            style="font-size: 17px; color: #8e8e8e"
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
            (+{{ formatWhole(feature.ADDITION.gain()) }})
            (!{{ formatWhole(player.totalAddpower) }})
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="background">
        <div class="main" v-if="player.currentTab === 0">
          <div class="clickable">

            <div class="clickable_button" @mousedown="feature.SUCCESSOR.success()">
              后继x{{ feature.SUCCESSOR.successorBulk()
              }}<span v-if="BUYABLES.lock('11').unlocked"
                >(自动{{ formatWhole(feature.SUCCESSOR.autoSuccessPerSecond()) }}/s)</span
              >
            </div>
          </div>
          <table align="center">
            <td v-if="UPGRADES.lock('11').show">
              <div
                class="upgrade"
                @mousedown="UPGRADES.buy('11')"
                v-html="UPGRADES.singleHTML('11')"
              ></div>
            </td>
            <td v-if="UPGRADES.lock('12').show">
              <div
                class="upgrade"
                @mousedown="UPGRADES.buy('12')"
                v-html="UPGRADES.singleHTML('12')"
              ></div>
            </td>
            <td v-if="UPGRADES.lock('13').show">
              <div
                class="upgrade"
                @mousedown="UPGRADES.buy('13')"
                v-html="UPGRADES.singleHTML('13')"
              ></div>
            </td>
            <td v-if="BUYABLES.lock('11').show">
              <div
                class="upgrade"
                @mousedown="BUYABLES.buy('11')"
                v-html="BUYABLES.singleHTML('11')"
              ></div>
            </td>
          </table>
        </div>
        <div class="main" v-if="player.currentTab === 1">
          <div class="setting_button" @click="save()">手动保存</div>
          <div class="hard_reset" @click="UIHardReset">硬重置</div>
        </div>
        <div class="main" v-if="player.currentTab === 2">
          <button class="reset1" @click="feature.ADDITION.UIreset">
            <!-- prettier-disable !-->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="rgb(90, 202, 255)" d="M142.9 142.9c-17.5 17.5-30.1 38-37.8 59.8c-5.9 16.7-24.2 25.4-40.8 19.5s-25.4-24.2-19.5-40.8C55.6 150.7 73.2 122 97.6 97.6c87.2-87.2 228.3-87.5 315.8-1L455 55c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2l0 128c0 13.3-10.7 24-24 24l-8.4 0c0 0 0 0 0 0L344 224c-9.7 0-18.5-5.8-22.2-14.8s-1.7-19.3 5.2-26.2l41.1-41.1c-62.6-61.5-163.1-61.2-225.3 1zM16 312c0-13.3 10.7-24 24-24l7.6 0 .7 0L168 288c9.7 0 18.5 5.8 22.2 14.8s1.7 19.3-5.2 26.2l-41.1 41.1c62.6 61.5 163.1 61.2 225.3-1c17.5-17.5 30.1-38 37.8-59.8c5.9-16.7 24.2-25.4 40.8-19.5s25.4 24.2 19.5 40.8c-10.8 30.6-28.4 59.3-52.9 83.8c-87.2 87.2-228.3 87.5-315.8 1L57 457c-6.9 6.9-17.2 8.9-26.2 5.2S16 449.7 16 440l0-119.6 0-.7 0-7.6z"/></svg>
          </button>
          <div style="transform: translateY(60px)">
            <table align="center">
              <tbody>
                <tr>
                  <td v-if="UPGRADES.lock('21').show">
                    <div
                      class="upgrade"
                      @mousedown="UPGRADES.buy('21')"
                      v-html="UPGRADES.singleHTML('21')"
                    ></div>
                  </td>
                  <td v-if="UPGRADES.lock('22').show">
                    <div
                      class="upgrade"
                      @mousedown="UPGRADES.buy('22')"
                      v-html="UPGRADES.singleHTML('22')"
                    ></div>
                  </td>
                  <td v-if="UPGRADES.lock('23').show">
                    <div
                      class="upgrade"
                      @mousedown="UPGRADES.buy('23')"
                      v-html="UPGRADES.singleHTML('23')"
                    ></div>
                  </td>
                  <td v-if="UPGRADES.lock('24').show">
                    <div
                      class="upgrade"
                      @mousedown="UPGRADES.buy('24')"
                      v-html="UPGRADES.singleHTML('24')"
                    ></div>
                  </td>
                </tr>
                <tr style="transform: translateY(160px)">
                  <td v-if="BUYABLES.lock('21').show">
                    <div
                      class="upgrade"
                      @mousedown="BUYABLES.buy('21')"
                      v-html="BUYABLES.singleHTML('21')"
                    ></div>
                  </td>
                  <td v-if="UPGRADES.lock('25').show">
                    <div
                      class="upgrade"
                      @mousedown="UPGRADES.buy('25')"
                      v-html="UPGRADES.singleHTML('25')"
                    ></div>
                  </td>
                  <td v-if="UPGRADES.lock('26').show">
                    <div
                      class="upgrade"
                      @mousedown="UPGRADES.buy('26')"
                      v-html="UPGRADES.singleHTML('26')"
                    ></div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="main" v-if="player.currentTab === 3">
          <h1>大数之路重制版</h1>
          版本: v0.1.1<br>
          制作组名单(排名不分先后)：<br>
          静火Ω<br>
          VeryrrDefine<br>
          010000000a7<br>
          Seanxlx<br>
          EdenGameMaster<br>
          6左爷6<br>
        </div>
      </div>
    </div>
  </div>
</template>
