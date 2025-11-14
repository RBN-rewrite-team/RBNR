import { defineComponent } from 'vue';
import { player } from '.';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'FontUI',
	setup() {
		const $t = useI18n().t;
		return () => (
			<>
				<div>
					<p style={{ color: 'var(--color)' }}>{$t('modal.font')}</p>
					<input
						value={player.options.ui.user_font}
						onChange={($event) =>
							(player.options.ui.user_font = (
								$event.target as HTMLInputElement
							).value)
						}
						class="modal-input"
					/>
				</div>
			</>
		);
	},
});
