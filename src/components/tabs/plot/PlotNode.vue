<script setup lang="ts">
</script>
<template>
  <div class="node"><div style="transform: rotateZ(45deg);"><slot></slot></div></div>
</template>

<style lang="scss" scoped>
.node {
  transform: rotateZ(-45deg);
  border: 1px solid red;
  width: 50px;
  height: 50px;
  line-height: 50px;
  &:hover{
    background-color: var(--hover-color);
    cursor: pointer;
  }
  &:active{
    background-color: var(--border-color);
    cursor: pointer;
  }
}
</style>
