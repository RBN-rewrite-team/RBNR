<script setup lang="ts">
import Decimal from 'break_eternity.js';
import {player} from './core/save';

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
            数值&nbsp;PLACEHOLDER
          </div>
          <div style="font-size: 17px;color: #8e8e8e;">
            (+PLACEHOLDER/s)
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="background">
        <div class="main">
          PLACEHOLDER
          {{JSON.stringify([new Decimal(114513)])}}
          <br> {{player.lastUpdated}}
          <br> {{player.saveCreateTime}}
        </div>
      </div>
    </div>
  </div>
</template>
