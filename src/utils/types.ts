import type { LocaleMessage, RemoveIndexSignature } from '@intlify/core-base';
import { type ComposerTranslation, type LocaleMessageValue, type VueMessageType } from 'vue-i18n';
export type ChooseTypes<A extends object, C> = keyof {
	[key in keyof A as A[key] extends C ? key : never]: A[key];
};

export type $t = ComposerTranslation<
	{ [x: string]: LocaleMessage<VueMessageType> },
	string,
	RemoveIndexSignature<{ [x: string]: LocaleMessageValue<VueMessageType> }>,
	never,
	never,
	never
>;
