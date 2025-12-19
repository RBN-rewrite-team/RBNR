import { MMS } from '@/core/post-nonrec/mms';
import { player } from '@/core/save';
import { useUpdate } from '@/lib/useUpdate';
import { format, formatWhole } from '@/utils/format';
import { getCurrentMMSMilestone } from '@/utils/mms';
import PowiainaNum from 'powiaina_num.js';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

function deduceButtonStyle() {
	if (MMS.displayDeduceSpeed().gte(10)) return {};
	const pc = player.hydra.mms.progress
		.div(player.hydra.mms.deduced.add(1).root(MMS.staticExp()).sub(player.hydra.mms.deduced.root(MMS.staticExp())))
		.mul(100)
		.toNumber();
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
	if (MMS.displayDeduceSpeed().gte(10)) return 'mms-fast';
	return '';
}
export default defineComponent({
	name: 'MMSDeduction',
	setup() {
		const $t = useI18n().t;
		const useStyle = useUpdate(() => deduceButtonStyle());
		const useClass = useUpdate(() => buttonClass());
		const useSpeed = useUpdate(() => MMS.displayDeduceSpeed());
		const useTime = useUpdate(() => player.hydra.mms.deduced);
		const useGainPerminute = useUpdate(() => MMS.resetGainPerMinute());
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
							display: 'block',
							margin: 'auto',
							zIndex: '1',
							width: '50%',
							...useStyle.value,
						}}
					>
						<span class="hydra-text">{getCurrentMMSMilestone(useTime.value)[1]}</span>
						{
							<span class="hydra-text" style="opacity: 0.5; font-size: 60px; ">
								{useSpeed.value.gte(1)
									? format(useSpeed.value) + '/s'
									: '1/' + format(useSpeed.value.rec()) + 's'}
							</span>
						}
						<span
							class="hydra-text-bottom"
							style="opacity: 0.5; font-size: 16px; bottom: 0px"
						>
							Deduced {formatWhole(useTime.value)}{' '}
							{useTime.value.eq(1) ? 'time' : 'times'}
						</span>
					</button>

					<button
						style={{
							width: '50%',
							display: 'block',
							margin: 'auto',
							backgroundColor: 'var(--background-color)',
							color: 'rgba(116, 155, 233, 1)',
							height: '50px',
							border: '2px solid',
							position: 'relative',
							zIndex: '1',
						}}
						onClick={() => MMS.reset()}
					>
						重置MMS推演次数，获得{format(MMS.resetGain())}充能九头蛇能量(
						{format(useGainPerminute.value)}/min)
					</button>
				</div>
			</>
		);
	},
});
