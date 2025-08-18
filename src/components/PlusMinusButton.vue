<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: "PlusMinusButton",
  props: {
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('click');
    };

    return {
      handleClick
    };
  }
});
</script>

<template>
  <div
    class="c-slider__button"
    @click="handleClick"
  >
  </div>
</template>

<style scoped>
.c-slider__button {
  display: flex;
  width: 1.6rem;
  height: 1.6rem;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  border: 0.1rem solid var(#e8e3e4);
  transition-duration: 0.2s;
  cursor: pointer;
}

.c-slider__button:hover {
  color: black;
  background-color: var(#e8e3e4);
}

.l-slider--disabled .c-slider__button {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>