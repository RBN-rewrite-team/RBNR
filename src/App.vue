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
          <div style="font-size: 17px; color: #8e8e8e" v-if="feature.NEXT.autoNextPerSecond().eq(0)">(需要通过后继获得)</div>
          <div style="font-size: 17px; color: #8e8e8e" v-html="formatGain(player.number, getPointGen(), '')" v-else />
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
                  feature.NEXT.doNext()
              "
            >
              后继x{{ feature.NEXT.nextBulk()
              }}<span v-if="BUYABLES.lock('11').unlocked"
                >(自动{{ formatWhole(feature.NEXT.autoNextPerSecond()) }}/s)</span
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
      </div>
    </div>
  </div>
</template>
