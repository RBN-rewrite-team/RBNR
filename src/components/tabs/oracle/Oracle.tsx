import Baixie from '@/components/group-2/Baixie.vue';
import { Oracle } from '@/core/pt/oracle/oracle.ts';
import { player } from '@/core/save/index.ts';
import { defineComponent } from 'vue';
import { format, formatWhole } from '@/utils/format.ts';

export default defineComponent({
	name: 'Oracle',
	setup(props, ctx) {
		return () => (
			<>
				<div align="center">
					<br/>
					<div style="width: calc(100% - 40px); height: 200px; padding: 5px; border: 1px solid red; color: red">
						<h2>神谕进程</h2><br/>
						神谕比特<h3>{formatWhole(Oracle.nowBitsHave())}/{formatWhole(player.oracle.totalBits)}</h3>
						<div style="width: 100%; height: 40px; border: 1px solid orange" align="left">
							<div style={{width: Oracle.bitGainProgress() * 100 + '%', height: '100%', 'background-color': 'red'}}></div>
						</div>
					</div>
				</div>
			</>
		);
	},
});
