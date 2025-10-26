import { defineComponent } from 'vue';
import { Qol7Upgrades } from '@/core/pt/qolcryupgs';
import { chunk as lodashchunk } from 'lodash-es';
import { upgrades } from '@/core/mechanic';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
const qol7keys = Object.keys(Qol7Upgrades.upgrades).filter(
	(x) => x in upgrades,
) as (keyof typeof upgrades)[];
const qol7upgs_chunked = lodashchunk(qol7keys, 5);
export default defineComponent({
	name: 'QolCrystalUpgrade',

	setup() {
		return () => (
			<>
				<p style={{ color: 'red' }}>特别提醒： 这些qol升级还没做完，买了没有效果!!!!!</p>
				<table
					style={{
						marginInlineStart: 'auto',
						marginInlineEnd: 'auto',
					}}
				>
					<tbody>
						{qol7upgs_chunked.map((a) => {
							return (
								<tr>
									{a.map((b) => (
										<TDUpgrade upgid={b} />
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</>
		);
	},
});
