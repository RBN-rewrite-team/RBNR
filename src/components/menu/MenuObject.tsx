import { defineComponent, type ExtractPropTypes, type PropType } from 'vue';
import type { NoTitleTab, SubTabBase, TitleTab } from './menus';

import type { LooseRequired } from '@vue/shared';
import SubMenuObject from './SubMenuObject.vue';

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
) {
	if ('title' in props.menu) {
		return (
			<>
				<div class="menu1">{props.menu.title}</div>
				<div class="menu_line"></div>
			</>
		);
	} else {
		return <></>;
	}
}
function toSubMenuObject(ct: SubTabBase) {
	if (ct.show) {
		if (!ct.show()) return <></>;
	}
	return <SubMenuObject tab={ct.id} text={ct.text} />;
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
		if (props.menu.show) {
			if (!props.menu.show()) {
				return () => <></>;
			}
		}
		return () => (
			<>
				{menuTitle(props)}
				{props.menu.contents.map(toSubMenuObject)}
			</>
		);
	},
});
