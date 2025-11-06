import { createI18n } from 'vue-i18n';

import zhCN from '@/locales/zh_CN';
import enUS from '@/locales/en_US';
export const messages = {
	'zh-CN': zhCN,
	'en-US': enUS,
};
export const i18n = createI18n({
	locale: 'en-US',
	fallbackLocale: 'zh-CN',
	messages,
});

export const messagesLength = (function () {
	const a = {} as { [key in keyof typeof messages]: number };
	for (const key in messages) {
		a[key as keyof typeof messages] = Object.keys(
			messages[key as keyof typeof messages],
		).length;
	}

	return a;
})();

export function setI18NLocal(loc: keyof typeof messages) {
	i18n.global.locale.value = loc;
}
