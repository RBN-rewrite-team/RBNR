import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { FFFZmacros } from '../../../utils/fffz.ts';
import FFFZDeduction from './FFFZDeduction';

export default defineComponent({
	name: 'FFFZEngine',
	setup() {
		return () => (
			<>
				<FFFZDeduction />
			</>
		);
	},
});
