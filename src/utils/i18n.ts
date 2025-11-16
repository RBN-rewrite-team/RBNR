import { createI18n, useI18n } from 'vue-i18n';

import zhCN from '@/locales/zh_CN.tsx';
import enUS from '@/locales/en_US.tsx';
import type { $t, FunctionArguments } from './types';
import { handleError } from 'vue';
export const messages = {
	'zh-CN': zhCN,
	'en-US': enUS,
} as const;
function checkAndFallbackLocale() {
	let a = navigator.language;
	let b = localStorage.getItem('rbnr-lang');
	if (b) {
		a = b;
	}
	if (a.startsWith('en')) {
		a = 'en-US';
	}
	if (!(a in messages)) {
		return 'zh-CN';
	}
	return a;
}

function handle(message: any): any {
	const a: any = {};
	for (const key in message) {
		let israw = false;
		if (typeof message[key] == 'string') {
			israw = message[key].startsWith('RAW::');
		}
		a[key] = israw
			? function () {
					return message[key].slice(5);
				}
			: message[key];
	}
	return a;
}
function handle2(message: any): any {
	const b: any = {};
	for (const k in message) {
		b[k] = handle(message[k]);
	}
	return b;
}
const message_handled = handle2(messages);
export const i18n = createI18n({
	locale: checkAndFallbackLocale(),
	fallbackLocale: 'zh-CN',
	messages: message_handled,
	warnHtmlMessage: false,

	fallbackWarn: false,
	missingWarn: false,
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
	// @ts-expect-error I must change this value with type error
	i18n.global.locale.value = loc;
	localStorage.setItem('rbnr-lang', loc);
}

// type M = typeof messages;
// type N = M[keyof M];
// export function getMessage<T extends keyof N>(inner: T extends keyof N ? T : never) {
// 	return messages[i18n.global.locale.value][inner] ?? messages['zh-CN'][inner] + inner;
// }

export const getMessage = i18n.global.t as $t;
