import { useUpdate } from '@/lib/useUpdate';
import { defineComponent, reactive } from 'vue';
import { diff } from './game-loop';

export const Performance: {
	uiOpened: boolean;
} = reactive({
	uiOpened: false,
});
export default defineComponent({
	name: 'Performance',
	setup(props, ctx) {
		const useFPS = useUpdate(() => 1000 / diff);
		return () => (
			<>
				{Performance.uiOpened && (
					<div class="performance">FPS: {useFPS.value.toFixed(3)}</div>
				)}
			</>
		);
	},
});
