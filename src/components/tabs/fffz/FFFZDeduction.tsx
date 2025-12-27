import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { FFFZmacros, getCurrentFFFZMilestone } from '../../../utils/fffz.ts';
import styles from './styles.module.scss';
import { VueLatex } from 'vatex';
import { FFFZ } from "../../../core/post-nonrec/fffz.ts"
import { player } from '@/core/save';
import { format, formatWhole } from '@/utils/format';

export default defineComponent({
	name: 'FFFZDeduction',
	setup() {
		return () => (
			<>
				<div>
					<div
						class={{
						  [styles.deduction_container]: true,
						  [styles.fast]: FFFZ.deduceSpeed().gte(10)
						}}
						style={{
						  "--progress": player.hydra.fffz.progress.mul(100).toNumber() + "%"
						}}
					>
					<VueLatex expression={getCurrentFFFZMilestone(player.hydra.fffz.deduced.add(player.hydra.fffz.progress))[1]} macros={FFFZmacros} />
							<span class="hydra-text" style="opacity: 0.5; font-size: 60px; ">
								{FFFZ.deduceSpeed().gte(1)
									? format(FFFZ.deduceSpeed()) + '/s'
									: '1/' + format(FFFZ.deduceSpeed().rec()) + 's'}
							</span>
						<span
							class="hydra-text-bottom"
							style="opacity: 0.5; font-size: 16px; bottom: 0px"
						>
							Deduced {formatWhole(player.hydra.fffz.deduced)}{' '}
							{player.hydra.fffz.deduced.eq(1) ? 'time' : 'times'}
						</span>
					</div>
				</div>
			</>
		);
	},
});
