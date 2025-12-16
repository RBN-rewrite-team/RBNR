import { MMS } from '@/core/post-nonrec/mms';
import { player } from '@/core/save';
import { useUpdate } from '@/lib/useUpdate';
import { formatP } from '@/utils/format-pow';
import { getCurrentMMSMilestone } from '@/utils/mms';
import PowiainaNum from 'powiaina_num.js';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

function deduceButtonStyle() {
	if (MMS.deduceSpeed().gte(10)) return {};
	const pc = player.hydra.mms.progress.mul(100).toNumber();
	return {
		backgroundImage:
			'linear-gradient(to right, rgba(125, 152, 195, 0.5) ' +
			pc +
			'%, var(--background-color) ' +
			pc +
			'%)',
	};
}
function buttonClass() {
	if (MMS.deduceSpeed().gte(10)) return 'mms-fast';
	return '';
}
export default defineComponent({
	name: 'MMSDeduction',
	setup() {
		const $t = useI18n().t;
		const useStyle = useUpdate(() => deduceButtonStyle());
		const useClass = useUpdate(() => buttonClass());
		const useSpeed = useUpdate(() => MMS.deduceSpeed());
		const useTime = useUpdate(() => player.hydra.mms.deduced);
		return () => (
			<>
				<div>
					<button
						class={useClass.value}
						style={{
							backgroundColor: 'var(--background-color)',
							color: 'rgba(116, 155, 233, 1)',
							height: '250px',
							border: '2px solid',
							borderImage: `linear-gradient(to right, #002aff, rgba(87, 138, 239, 1)) 1`,
							position: 'relative',
							zIndex: '1',
							width: '50%',
							...useStyle.value,
						}}
					>
						<span class="hydra-text">{getCurrentMMSMilestone(useTime.value)[1]}</span>
						<span class="hydra-text" style="opacity: 0.5; font-size: 60px; ">
							{formatP(useSpeed.value)}/s
						</span>
						<span
							class="hydra-text-bottom"
							style="opacity: 0.5; font-size: 16px; bottom: 0px"
						>
							Deduced {formatP(useTime.value)}{' '}
							{useTime.value.eq(1) ? 'time' : 'times'}
						</span>
					</button>
				</div>
			</>
		);
	},
});
