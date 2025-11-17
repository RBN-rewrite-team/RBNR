import { onUnmounted, shallowRef } from 'vue';

export const useUpdate = <T>(selector: () => T) => {
	const value = shallowRef(selector());

	const updateRefValue = () => {
		value.value = selector();
		animationFrameRequest = requestAnimationFrame(updateRefValue);
	};

	let animationFrameRequest = requestAnimationFrame(updateRefValue);

	onUnmounted(() => {
		cancelAnimationFrame(animationFrameRequest);
	});

	return value;
};
