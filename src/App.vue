<script setup lang="ts">
import Decimal from 'break_eternity.js';
import { format, formatWhole, formatGain } from '@/utils/format';
import { player, feature, getPointGen } from './core/global.ts';
import { UPGRADES, BUYABLES } from './core/mechanic.ts';

import Side from './components/Side.vue';
import {save} from './core/save/index.ts';
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
          <div style="font-size: 17px; color: #8e8e8e" v-if="feature.successor.autosuccessorPerSecond().eq(0)">(需要通过后继获得)</div>
          <div style="font-size: 17px; color: #8e8e8e" v-html="formatGain(player.number, getPointGen(), '')" v-else />
        </div>
        <div style="position: absolute;margin-left: 215px;margin-top: 5px;" id="showMP" v-if="player.upgrades[13]">
          <div style="font-weight: bold;color: #009dd9;">
            加法能量&nbsp;
            <div style="display: inline;text-shadow: #5acaff 1px 1px 2px;">{{formatWhole(player.addpower)}}</div>
          </div>
          <div style="font-size: 17px;color: #5acaff;">
            (+{{formatWhole(feature.ADDITION.gain())}})
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
              @mousedown="
                  feature.successor.dosuccessor()
              "
            >
              后继x{{ feature.successor.successorBulk()
              }}<span v-if="BUYABLES.lock('11').unlocked"
                >(自动{{ formatWhole(feature.successor.autosuccessorPerSecond()) }}/s)</span
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
        <div class="main" v-if="player.currentTab===2">
          <button class="reset1" @click="feature.ADDITION.UIreset">重置</button>
          <div style="transform: translateY(60px);">
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
            <tr style="transform: translateY(160px);">
            <td v-if="BUYABLES.lock('21').show">
              <div
                class="upgrade"
                @mousedown="BUYABLES.buy('21')"
                v-html="BUYABLES.singleHTML('21')"
              ></div>
            </td>
            </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
