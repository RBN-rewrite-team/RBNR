import { createI18n, useI18n } from 'vue-i18n';

import zhCN from '@/locales/zh_CN.tsx';
import enUS from '@/locales/en_US.tsx';
import type { $t, FunctionArguments } from './types';
import { handleError } from 'vue';
import { difference, xor } from 'lodash-es';
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
		return 'en-US';
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
} as any);

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
	localStorage.setItem('rbnr-lang', loc);
}
export function getI18NLocal(): string {
	return i18n.global.locale.value;
}
window.addEventListener(
	'message',
	function (event) {
		if (event.origin === 'https://galaxy.click') {
			// Load from English only website, use en-US
			if (getI18NLocal() === 'zh-CN') {
				setI18NLocal('en-US');
			}
		}
		console.log('Received message:', event.data);
	},
	false,
);
// type M = typeof messages;
// type N = M[keyof M];
// export function getMessage<T extends keyof N>(inner: T extends keyof N ? T : never) {
// 	return messages[i18n.global.locale.value][inner] ?? messages['zh-CN'][inner] + inner;
// }

export const getMessage = i18n.global.t as $t;
export function findRaw(x: string): any {
	return messages[i18n.global.locale.value][x];
}
const array1 = Object.keys(messages['en-US']);
const array2 = Object.keys(messages['zh-CN']);
// 找出 arr1 中有但 arr2 中没有的元素
const onlyInFirst = difference(array1, array2);

// 对称差集
const symmetricDifference = xor(array1, array2);

function exportUntranslated(withoutraw = true) {
	const untranslated: any = {};
	for (let i of symmetricDifference) {
		//@ts-expect-error
		const b = messages['zh-CN'][i];
		let a = true;
		if (typeof b == 'string' && b.startsWith('RAW::')) {
			a = false;
		}
		if (a) untranslated[i] = b;
	}
	return untranslated;
}

declare global {
	interface Window {
		i18n: {
			getMessage: typeof getMessage;
			i18n: typeof i18n;
			messages: typeof messages;
			global: typeof i18n.global;
			exportUntranslated: typeof exportUntranslated;
		};
	}
}
window.i18n = {
	getMessage,
	i18n,
	messages,
	global: i18n.global,
	exportUntranslated: exportUntranslated,
};
