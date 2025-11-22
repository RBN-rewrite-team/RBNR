import { computed, defineComponent, type ExtractPropTypes, type PropType } from 'vue';
import type { NoTitleTab, SubTabBase, TitleTab } from './menus';

import type { LooseRequired } from '@vue/shared';
import SubMenuObject from './SubMenuObject.vue';
import { useI18n } from 'vue-i18n';
import type { $t } from '@/utils/types';
import { player } from '@/core/global';
import { useUpdate } from '@/lib/useUpdate';
function menuTitle(
	props: LooseRequired<
		Readonly<
			ExtractPropTypes<{
				menu: {
					type: PropType<NoTitleTab | TitleTab>;
					required: true;
				};
			}>
		> &
			Readonly<{}> & {}
	>,
	$t: $t,
) {
	if ('title' in props.menu) {
		return (
			<>
				<div class="menu1">{$t(props.menu.title)}</div>
				<div class="menu_line"></div>
			</>
		);
	} else {
		return <></>;
	}
}
function toSubMenuObject(ct: SubTabBase, $t: $t) {
	if (ct.show) {
		if (!ct.show()) return <></>;
	}
	return <SubMenuObject tab={ct.id} text={$t(ct.text)} />;
}
export default defineComponent({
	name: 'MenuObject',
	props: {
		menu: {
			type: Object as PropType<NoTitleTab | TitleTab>,
			required: true,
		},
	},
	setup(props) {
		const $t = useI18n().t;

		const a = useUpdate(() => Math.random());
		const show = computed(() => {
			// return props.menu.show?.() ?? a.value > 0.1;
			return props.menu.show?.() ?? true;
		});
		return () => (
			<>
				<div>
					{!show.value ? (
						''
					) : (
						<>
							{menuTitle(props, $t)}
							{props.menu.contents.map((x) => toSubMenuObject(x, $t))}
							<span style="display: none" key={a.value}></span>
						</>
					)}
				</div>
			</>
		);
	},
});
