import { player } from '@/core/global';
import { MMS } from '@/core/post-nonrec/mms';
import { useUpdate } from '@/lib/useUpdate';
import { formatWhole } from '@/utils/format';
import type { $t } from '@/utils/types';
import type PowiainaNum from 'powiaina_num.js';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
function rankreq(x: PowiainaNum, $t: $t) {
	if (x.lt(4)) return;
	return (
		<>
			{$t('mms.rank.requirement', {
				up: MMS.rank.getRankTierName(x),
			})}
			<br />
			{MMS.rank.getRankTierName(x.sub(1))} {formatWhole(MMS.rank.levelRequirement(x))}
		</>
	);
}
export default defineComponent({
	name: 'RankBeyond',
	setup(props, ctx) {
		const $t = useI18n().t;
		const usetetr = useUpdate(() => player.hydra.mms.tetr);

		return () => (
			<>
				{rankreq(MMS.rank.getCurrentTierFromTetr(usetetr.value).sub(2), $t)}
				<br />
				{rankreq(MMS.rank.getCurrentTierFromTetr(usetetr.value).sub(1), $t)}
				<br />
				{rankreq(MMS.rank.getCurrentTierFromTetr(usetetr.value), $t)}
			</>
		);
	},
});
