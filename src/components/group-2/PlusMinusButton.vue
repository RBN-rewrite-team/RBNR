<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'PlusMinusButton',
	props: {
		type: {
			type: String,
			default: 'plus',
		},
	},
	emits: ['click'],
	setup(props, { emit }) {
		const handleClick = () => {
			emit('click');
		};

		const getText = () => {
			switch (props.type) {
				case 'plus':
					return '+';
				case 'minus':
					return '-';
				default:
					return '';
			}
		};

		return {
			handleClick,
			getText,
		};
	},
});
</script>

<template>
	<div class="c-slider__button" @click="handleClick">{{ getText() }}</div>
</template>

<style scoped>
.c-slider__button {
	display: flex;
	width: 1.6rem;
	height: 1.6rem;
	justify-content: center;
	align-items: center;
	font-size: 1rem;
	border: 0.1rem solid var(--color);
	transition-duration: 0.2s;
	cursor: pointer;
}

.c-slider__button:hover {
	color: black;
	background-color: var(--color);
}

.l-slider--disabled .c-slider__button {
	opacity: 0.5;
	cursor: not-allowed;
}
</style>
