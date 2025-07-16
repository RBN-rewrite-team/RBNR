<script setup lang="ts">
import Decimal from 'break_eternity.js';
import {format, formatWhole} from "@/utils/format";
import {player, feature} from './core/global.ts';
import {UPGRADES, BUYABLES} from './core/mechanic.ts';
</script>

<template>
  <div class="side">
    <div class="title_box">
      <div class="background">
        <div class="title">
          <div style="font-size: 24px;color: #000000;text-shadow: #8e8e8e 1px 1px 2px;">大数之路重制版</div>
          <div style="font-size: 20px;">v0.0</div>
        </div>
      </div>
    </div>
    <div class="menu">
      <div class="background" style="overflow: auto;">
        <div class="main">
          <div class="menu1">后继</div>
		  <div class="menu2">后继</div>
        </div>
      </div>
    </div>
  </div>
  <div class="content">
    <div class="news">
      <div class="background">
        <div style="font-size: 18px;margin: 12px 0px;overflow-y: hidden;height: 28px;">
          新闻栏给你们做吧/bx
        </div>
      </div>
    </div>
    <div class="resources" style="font-size: 20px">
      <div class="background">
        <div style="position: absolute;display: inline-block;margin-left: 15px;margin-top: 5px;">
          <div style="font-weight: bold;color: #4f4f4f;">
            数值&nbsp;{{formatWhole(player.number)}}
          </div>
          <div style="font-size: 17px;color: #8e8e8e;">
            (需要通过后继获得)
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="background">
        <div class="main">
			<div class="clickable"><div class="clickable_button" @mousedown="feature.NEXT.doNext">后继x{{feature.NEXT.nextBulk()}}<span v-if="BUYABLES.lock('11').unlocked">(自动{{formatWhole(feature.NEXT.autoNextPerSecond())}}/s)</span></div></div>
			<table align="center">
			<td v-if="UPGRADES.lock('11').show"><div class="upgrade" @mousedown="UPGRADES.buy('11')" v-html="UPGRADES.singleHTML('11')"></div></td>
			<td v-if="UPGRADES.lock('12').show"><div class="upgrade" @mousedown="UPGRADES.buy('12')" v-html="UPGRADES.singleHTML('12')"></div></td>
			<td v-if="UPGRADES.lock('13').show"><div class="upgrade" @mousedown="UPGRADES.buy('13')" v-html="UPGRADES.singleHTML('13')"></div></td>
			<td v-if="BUYABLES.lock('11').show"><div class="upgrade" @mousedown="BUYABLES.buy('11')" v-html="BUYABLES.singleHTML('11')"></div></td>
			</table>
        </div>
      </div>
    </div>
  </div>
</template>
