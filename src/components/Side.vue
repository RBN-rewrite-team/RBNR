<script setup lang="ts">
import {player} from '@/core/save';

</script>

<template>
  <div class="side">
    <div class="title_box">
      <div class="background">
        <div class="title">
          <div style="font-size: 24px; color: #000000; text-shadow: #8e8e8e 1px 1px 2px">
            大数之路重制版
          </div>
          <div style="font-size: 20px">v0.0</div>
        </div>
      </div>
    </div>
    <div class="menu">
      <div class="background" style="overflow: auto">
        <div class="main">
          <div class="menu1">后继</div>
          <div class="menu2" @click="player.currentTab=0">后继</div>
          <div class="menu_line"></div>
          <div class="menu1">加法</div>
          <div class="menu2" @click="player.currentTab=2">加法</div>
          <div class="menu_line"></div>
          <div class="menu1">杂项</div>
          <div class="menu2" @click="player.currentTab=1">存档</div>
          <div class="menu_line"></div>
        </div>
      </div>
    </div>
  </div>
</template>
