import Baixie from '@/components/group-2/Baixie.vue';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Oracle',
	setup(props, ctx) {
		return () => (
			<>
				<p>
					没做完
					<Baixie />
				</p>
			</>
		);
	},
});
