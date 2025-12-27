import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { FFFZmacros, FFFZMilestones } from '../../../utils/fffz.ts';
import styles from './styles.module.scss';
import { VueLatex } from 'vatex';

export default defineComponent({
	name: 'FFFZDeduction',
	setup() {
		return () => (
			<>
				<div>
					<div
						class={{
						  [styles.deduction_container]: true
						}}
					>
					<VueLatex expression="test" macros={FFFZmacros} />
					</div>
				</div>
			</>
		);
	},
});
