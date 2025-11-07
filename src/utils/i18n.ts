import { createI18n, useI18n } from 'vue-i18n';

import zhCN from '@/locales/zh_CN.tsx';
import enUS from '@/locales/en_US.tsx';
export const messages = {
	'zh-CN': zhCN,
	'en-US': enUS,
} as const;
export const i18n = createI18n({
	locale: 'en-US',
	fallbackLocale: 'zh-CN',
	messages,
} as const);
export const messagesLength = (function () {
	const a = {
		'zh-CN': 0,
		'en-US': 0,
	};
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
