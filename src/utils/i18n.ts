import { createI18n, useI18n } from 'vue-i18n';

import zhCN from '@/locales/zh_CN.tsx';
import enUS from '@/locales/en_US.tsx';
import type { $t, FunctionArguments } from './types';
export const messages = {
	'zh-CN': zhCN,
	'en-US': enUS,
} as const;
export const i18n = createI18n({
	locale: 'en-US',
	fallbackLocale: 'zh-CN',
	messages,
	warnHtmlMessage: false,

	fallbackWarn: false,
	missingWarn: false,
} as const);
export const messagesLength = (function () {
	const a = {
		'zh-CN': 0,
		'en-US': 0,
		'en-GB': 0,
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

// type M = typeof messages;
// type N = M[keyof M];
// export function getMessage<T extends keyof N>(inner: T extends keyof N ? T : never) {
// 	return messages[i18n.global.locale.value][inner] ?? messages['zh-CN'][inner] + inner;
// }

export const getMessage = i18n.global.t as $t;
