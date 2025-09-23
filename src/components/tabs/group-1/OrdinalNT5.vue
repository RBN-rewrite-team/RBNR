<script setup lang="ts">
import { player } from "@/core/global"
import { formatWhole } from "../../../utils/format.ts"

function getCurrentSequenceName(): string {
  const selecting = player.numbertheory.well_ordering.selecting
  if (selecting === 1) return "初等序列 (Primitive Sequence System)的停机性"
  if (selecting === 2) return "BMS (Bashicu Matrix System)的良序性"
  return "???"
}
</script>

<template>
  <h2>良序性</h2>
  你有<b style="color: #c98300; font-size: 30px">
    {{ formatWhole(player.numbertheory.well_ordering.energy) }}
  </b>推演能量
  <div><button class="clickable_button" style="display: inline-block" @click="player.numbertheory.well_ordering.selecting = Math.max(player.numbertheory.well_ordering.selecting - 1, 1)">←</button>当前证明中：{{ getCurrentSequenceName() }}<button class="clickable_button" style="display: inline-block" @click="player.numbertheory.well_ordering.selecting = Math.min(player.numbertheory.well_ordering.selecting + 1, 10)">→</button></div>
  <div v-if="player.numbertheory.well_ordering.selecting === 1" align="center">
    初等序列<vue-latex expression="(a_0,a_1,\ldots,a_{m-1},a_m)" />定义如下：
    <vue-latex expression="1.\ () = 0" display-mode />
    <vue-latex expression="2.\ (\#,0) = (\#)+1" display-mode />
    <div><vue-latex expression="3.\ (\#_1,{\color{Red} a_i,\#_2},a_k) m  = (\#_1,{\color{Red} a_i,\#_2},{\color{Blue} a_i,\#_2},\ldots)" />，其中<vue-latex expression="\#_1,\#_2"/>为任意两段合法序列，<vue-latex expression="a_k>0"/>，<br><vue-latex expression="a_i = a_k-1"/>为<vue-latex expression="a_k"/>前首个小于<vue-latex expression="a_k"/>的数，<br>省略号代表任意有限次循环的极限。</div>
		<div class="center_line" />
  </div>
</template>