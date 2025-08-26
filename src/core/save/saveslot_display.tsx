import { defineComponent } from 'vue';
import { current_save, readSaveDetail } from '.';
import Details_toHTML from './details_toHTML';

// 给Seanxlx的提示： <del>这是船新的JSX写法，不要太惊讶</del>这是我乱写的
export default defineComponent({
	name: 'SaveSlotDisplay',
	setup() {
		const slot_ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		return () => (
			<>
				<div style="color: var(--color)">
					<div style="border: 2px solid red; width: 250px; margin: auto;">
						<div>你当前的槽位为{current_save}</div>
						{slot_ids.map((item) => {
							const curslot = readSaveDetail(item);
							if (curslot)
								return (
									<div>
										<div>槽位{item}</div>
										<Details_toHTML det={curslot}></Details_toHTML>
									</div>
								);
							else {
							}
						})}
					</div>
				</div>
			</>
		);
	},
});
