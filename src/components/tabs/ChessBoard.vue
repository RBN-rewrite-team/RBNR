<script lang="ts" setup>
import { format, formatWhole } from '@/utils/format';
import { feature, player } from '@/core/global';
import TDBuyable from '../TDBuyable.vue';
import TRMilestone from '../TRMilestone.vue';
</script>

<template>
  <div class="main">
    <p style="color: grey; table-align: center">古时候，有一位国王想要犒赏一位聪明的大臣，奖赏他发明了国际象棋……</p>
      你有 <b style="color: rgb(127, 127, 255); font-size: 25px">{{ formatWhole(feature.ChessBoard.wheatGrain().round()) }}</b> 麦粒，
      使数值^<b style="color: rgb(127, 127, 255);">{{ format(feature.ChessBoard.wgEffect()[0]) }}</b>, 加法能量×<b style="color: rgb(127, 127, 255);">{{ format(feature.ChessBoard.wgEffect()[3]) }}</b>,^<b style="color: rgb(127, 127, 255);">{{ format(feature.ChessBoard.wgEffect()[1]) }}</b>, 乘法能量^<b style="color: rgb(127, 127, 255);">{{ format(feature.ChessBoard.wgEffect()[2]) }}</b>，乘法能量溢出的效果×<b style="color: rgb(127,127,255);">{{format(feature.ChessBoard.wgEffect()[4])}}</b>
    <p align="center">当前格子底数：{{format(feature.ChessBoard.base())}}</p>
    <div align="center">
      <table>
        <tbody>
          <tr>
            <td><div class="block">
              <b style="color: rgb(127, 127, 255); font-size: 20px">
                1
              </b>
            </div></td>
            <td v-if="feature.ChessBoard.maxBlocks().gte(2)"><div class="block">
              <b style="color: rgb(127, 127, 255); font-size: 20px">
                {{ formatWhole(feature.ChessBoard.base()) }}
              </b>
            </div></td>
            <td v-if="feature.ChessBoard.maxBlocks().gte(3)"><div class="block">
              <b style="color: rgb(127, 127, 255); font-size: 20px">
                {{ formatWhole(feature.ChessBoard.base()) }}<sup>2</sup>
              </b>
            </div></td>
            <td v-if="feature.ChessBoard.maxBlocks().gte(5)"><div style="width: 40px; text-align: center">
              <b style="color: rgb(127, 127, 255); font-size: 20px">
                ...
              </b>
            </div></td>
            <td v-if="feature.ChessBoard.maxBlocks().gte(4)"><div class="block">
              <b style="color: rgb(127, 127, 255); font-size: 20px">
                {{ formatWhole(feature.ChessBoard.base()) }}<sup>{{ formatWhole(feature.ChessBoard.maxBlocks().sub(1)) }}</sup>
              </b>
            </div></td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <TDBuyable bylid="cb1" />
          </tr>
        </tbody>
      </table><br><br>
      <table style="margin: 50px;">
        <tbody class="milestones">
          <TRMilestone id="cb1" />
          <TRMilestone id="cb2" />
          <TRMilestone id="cb3" />
          <TRMilestone id="cb4" />
          <TRMilestone id="cb5" />
          <TRMilestone id="cb6" />
          <TRMilestone id="cb7" />
          <TRMilestone id="cb8" />
          <TRMilestone id="cb9" />
          <TRMilestone id="cb10" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .block {
    border: 2px solid #77f;
    width: 100px;
    height: 100px;
    justify-content: center;
    align-items: center;
    display: flex;
    margin: -1.7px;
  }
  
  table {
    border-collapse: collapse;
    border-spacing: 0px;
  }

  .milestones> tr{
    height: 60px;
  }
</style>