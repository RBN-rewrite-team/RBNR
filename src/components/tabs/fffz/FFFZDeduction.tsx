import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { FFFZmacros, FFFZMilestones } from '../../../utils/fffz.ts';
import styles from './styles.scss';

export default defineComponent({
	name: 'FFFZDeduction',
	setup() {
		return () => (
			<>
				<div>
					<div
						style={{
							backgroundColor: 'var(--background-color)',
							color: 'rgba(116, 155, 233, 1)',
							height: '250px',
							border: '2px solid',
							borderImage: `linear-gradient(135deg, #1a6c5e, #1fb286, #ef2dfd) 1`,
							position: 'relative',
							display: 'block',
							margin: 'auto',
							zIndex: '1',
							width: '50%',
						}}
					></div>
				</div>
			</>
		);
	},
});
