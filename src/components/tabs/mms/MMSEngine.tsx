import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import MMSDeduction from './MMSDeduction';

export default defineComponent({
	name: 'MMSEngine',
	setup() {
		const $t = useI18n().t;
		return () => (
			<>
				<div class="main">
					<p style="color: grey; table-align: center">{$t('mms.t')}</p>
					<div
						style={{
							margin: 'auto',
						}}
					>
						<MMSDeduction />
					</div>
				</div>
			</>
		);
	},
});
