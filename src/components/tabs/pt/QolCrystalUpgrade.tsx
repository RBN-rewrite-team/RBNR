import { defineComponent } from 'vue';
import { Qol7Upgrades } from '@/core/pt/qolcryupgs';
import { chunk as lodashchunk } from 'lodash-es';
import { upgrades } from '@/core/mechanic';
import Upgrades from '@/components/upg/Upgrades';
const qol7keys = Object.keys(Qol7Upgrades.upgrades)
	.filter((x) => x in upgrades)
	.map((x) => 'u' + x) as `u${keyof typeof upgrades}`[];
const qol7upgs_chunked = lodashchunk(qol7keys, 5);
console.log(qol7keys);
export default defineComponent({
	name: 'QolCrystalUpgrade',

	setup() {
		return () => (
			<>
				<Upgrades upgids={qol7upgs_chunked} />
			</>
		);
	},
});
