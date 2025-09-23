<script setup lang="ts">
import { player } from "@/core/global"

function getCurrentSequenceName(): string {
  const selecting = player.numbertheory.well_ordering.selecting
  if (selecting === 1) return "初等序列 (Primitive Sequence System)的停机性"
  return "???"
}
</script>

<template>
  <h2>良序性</h2>
  <div><button class="clickable_button" style="display: inline-block">←</button>当前证明中：{{ getCurrentSequenceName() }}<button class="clickable_button" style="display: inline-block">→</button></div>
</template>