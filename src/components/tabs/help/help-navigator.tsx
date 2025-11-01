import { player } from '@/core/save';
import { formatWhole } from '@/utils/format';
import { defineComponent } from 'vue';
import { lastPage, nextPage } from './page-controller';
import { gotoShortCut, SHORTCUTS } from './shortcuts';

export default defineComponent({
	setup() {
		return () => (
			<>
				<div style="position:sticky;top: 5px; ">
					<div style="display: flex; justify-content: center; align-items: center; margin-top: 5px;background: var(--background-color) ">
						<button class="clickable_button" onClick={lastPage}>
							-
						</button>
						第 {formatWhole(player.help.page)} 页
						<button class="clickable_button" onClick={nextPage}>
							+
						</button>
						<br />
						{Object.entries(SHORTCUTS).map((x) => (
							<button class="clickable_button" onClick={() => gotoShortCut(x[0])}>
								{x[1].text}
							</button>
						))}
					</div>
					<div style="margin: auto;">
						<div class="center_line" />
					</div>
				</div>
			</>
		);
	},
});
