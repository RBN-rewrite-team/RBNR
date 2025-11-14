import ModalService from '@/utils/Modal';
import type { $t } from '@/utils/types';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import PrimaryButton from './ui/PrimaryButton';
import { messages, messagesLength, setI18NLocal } from '@/utils/i18n';
import Baixie from './group-2/Baixie.vue';

const langName = {
	'zh-CN': '简体中文',
	'en-US': 'English',
};
const component = defineComponent({
	name: 'i18nUI',
	setup(props, ctx) {
		const u = useI18n();
		const browserLang = navigator.language;
		// const $t = u.t;
		const locales = ['zh-CN', 'en-US'];

		const max = Math.max(...Object.values(messagesLength));
		return () => (
			<>
				<p>Your current language is {langName[u.locale.value as keyof typeof messages]}</p>
				<p>
					Your browser language is {browserLang} (detected).
					{!locales.includes(browserLang)
						? 'The game is no t provided this language localization.'
						: ''}
				</p>
				<p>
					If you are proficient in other languages, you can apply to translate this game.
					<Baixie />
				</p>
				{locales.map((x) => {
					const y = x as keyof typeof messages;
					return (
						<div
							style={{
								border: '1px solid red',
							}}
						>
							<p>
								Language: {langName[y]}
								<p>
									{y == 'zh-CN' ? (
										<b>(Main)</b>
									) : (
										<b>
											({((messagesLength[y] / max) * 100).toFixed(3)}
											%)
										</b>
									)}
								</p>
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
