import { defineComponent } from 'vue';
import { notifies } from '.';
import { player } from '@/core/save';

export default defineComponent({
	name: 'Notifies',
	setup() {
		return () => (
			<>
				<div class="notify">
					{notifies.map(
						(x) =>
							!x.expired && (
								<div class={['notify-content-box', x.quiting && 'quiting']}>
									{x.content}
									<span style="display:none">{player.lastUpdated}</span>
								</div>
							),
					)}
				</div>
			</>
		);
	},
});
