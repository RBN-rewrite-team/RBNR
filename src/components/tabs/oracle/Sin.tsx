import TRMilestone from '@/components/group-2/TRMilestone.vue';
import { player } from '@/core/global';
import { SIN } from '@/core/pt/oracle/sin';
import { useUpdate } from '@/lib/useUpdate';
import { format } from '@/utils/format';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Sin',
	setup() {
		const useSinValue = useUpdate(() => SIN.getSinValue());
		const useKarma = useUpdate(() => player.oracle.originalsin.karma);
		return () => (
			<>
				<div class="main">
					<p>Sin value: {format(useSinValue.value)}</p>
					<p>你有 {format(useKarma.value)} 业{player.milestones['sin_6'] ? <>，令CHE在软上限后slog+{format(useKarma.value.div(100).min(useKarma.value.root(4).mul(100)))}</> : <></>}</p>
					<table
						style={{
							marginInlineStart: '0',
							marginInlineEnd: '0',
							margin: 'auto',
						}}
					>
						<tbody>
							<TRMilestone id={'sin_1'} />
							<TRMilestone id={'sin_2'} />
							<TRMilestone id={'sin_3'} />
							<TRMilestone id={'sin_4'} />
							<TRMilestone id={'sin_5'} />
							<TRMilestone id={'sin_6'} />
						</tbody>
					</table>
				</div>
			</>
		);
	},
});
