<script setup lang="ts">
import { player } from '@/core/save';
import { feature } from '@/core/global.ts';
import TDUpgrade from '../TDUpgrade.vue';
import { format, formatWhole } from '@/utils/format.ts';
import Decimal from 'break_eternity.js';

</script>

<template>
  <div>
    <span v-if="player.firstResetBit & 0b100">
			累计指数能量提供了<span style="color: rgb(127, 127, 255)">^{{format(feature.EXPONENTION.powerEff())}}</span>
			数值增益<br>
			战利品提供了<span style="color: rgb(127, 127, 255)">^{{format(new Decimal(1.03))}}</span>
			数值增益
		</span>
		<br>
    <table align="center">
      <tbody>
        <tr>
          <TDUpgrade upgid="41"/>
          <TDUpgrade upgid="42"/>
          <TDUpgrade upgid="43"/>
          <TDUpgrade upgid="44"/>
        </tr>
        <tr></tr>
      </tbody>
    </table>
    <h2>QoL点数升级</h2>
    <table align="center">
      <tbody>
        <tr>
            <TDUpgrade upgid="400q" />
        </tr>
        <tr>
            <TDUpgrade upgid="411q" />
            <TDUpgrade upgid="412q" />
            <TDUpgrade upgid="413q" />
            <TDUpgrade upgid="414q" />
            <TDUpgrade upgid="415q" />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
</style>
