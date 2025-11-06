import ModalService from '@/utils/Modal';
import type { $t } from '@/utils/types';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import PrimaryButton from './ui/PrimaryButton';
import { messages, messagesLength, setI18NLocal } from '@/utils/i18n';

const component = defineComponent({
	name: 'i18nUI',
	setup(props, ctx) {
		const u = useI18n();
		// const $t = u.t;
		console.log(u.availableLocales.value);
		return () => (
			<>
				BXD
				{u.availableLocales.value.map((x) => {
					const y = x as keyof typeof messages;
					return (
						<div
							style={{
								border: '1px solid red',
							}}
						>
							<p>
								Useable locales: {y}({messagesLength[y]} messages avaliable)
								<PrimaryButton onClick={() => setI18NLocal(y)}>Set</PrimaryButton>
							</p>
						</div>
					);
				})}
			</>
		);
	},
});
export default component;
export function openSetLangModel($t: $t) {
	ModalService.show({
		title: $t('set.setlang'),
		component: component,
	});
}
