<script setup lang="ts">
import TDUpgrade from '../TDUpgrade.vue';

</script>

<template>
  <div>
    <h2>普通指数升级</h2>
    <table>
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
    <table>
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
