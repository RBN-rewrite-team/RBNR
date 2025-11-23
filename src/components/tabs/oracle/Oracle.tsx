import Baixie from '@/components/group-2/Baixie.vue';
import { Oracle } from '@/core/pt/oracle/oracle.ts';
import { player } from '@/core/save/index.ts';
import { defineComponent } from 'vue';
import { format, formatWhole } from '@/utils/format.ts';
import { useUpdate } from '@/lib/useUpdate.ts';

export default defineComponent({
	name: 'Oracle',
	setup(props, ctx) {
		const progress = useUpdate(()=>Oracle.bitGainProgress());
		return () => (
			<>
				<div style={{textAlign: "center", margin: "auto"}}>
					<br />
					<div style="width: calc(100% - 80px); height: 200px; padding: 5px; border: 1px solid red; color: red; margin: auto;">
						<h2>神谕进程</h2>
						<br />
						神谕比特
						<h3>
							{formatWhole(Oracle.nowBitsHave())}/
							{formatWhole(player.oracle.totalBits)}
						</h3>
						<div
							style="width: 100%; height: 40px; border: 1px solid orange; text-align: left"
						>
							<div
								style={{
									width: progress.value * 100 + '%',
									height: '100%',
									'background-color': 'red',
								}}
							></div>
						</div>
					</div>
				</div>
			</>
		);
	},
});
